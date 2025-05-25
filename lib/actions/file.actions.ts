'use server'

import {createAdminClient} from "@/lib/appwrite";
import {InputFile} from "node-appwrite/file"
import {appwriteConfig} from "@/lib/appwrite/config";
import {ID, Models, Query} from "node-appwrite";
import {constructFileUrl, getFileTypes} from "@/lib/utils";
import {parseStringify} from "@/lib/utils";
import { revalidatePath } from "next/cache";
import {getCurrentUser} from "@/lib/actions/user.actions";

function handleError(error: unknown, message: string) {
	console.log(error, message)
	throw error;
}

export async function uploadFile({file,ownerId,accountId,path}: UploadFileProps) {
	const {storage, databases} = await createAdminClient()

	try {
		const inputFile = InputFile.fromBuffer(file, file.name)
		const bucketFile = await storage.createFile(appwriteConfig.bucketId, ID.unique(), inputFile)

		const fileDoc = {
			name: bucketFile.name,
			type: getFileTypes(bucketFile.name).type,
			extension: getFileTypes(bucketFile.name).ext,
			url: constructFileUrl(bucketFile.$id),
			size: bucketFile.sizeOriginal,
			owner: ownerId,
			accountId,
			users: [],
			bucketFileId: bucketFile.$id
		}

		const newFile = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			ID.unique(),
			fileDoc
		).catch(async(error: unknown) => {
			await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id)
			handleError(error, "Failed to create file")
		})

		revalidatePath(path)
		return parseStringify(newFile)
	}catch (e) {
		handleError(e, "Failed to upload file")
	}
}

function createQuery(currentUser: Models.Document) {
	const queries = [
		Query.or([
			Query.equal("owner", [currentUser.$id]),
			Query.contains("users", [currentUser.email]),
		])
	]

	return queries;
}

export async function getFiles() {
	const {databases} = await createAdminClient()

	try {
		const currentUser = await getCurrentUser()
		if(!currentUser) throw new Error("No user")

		const queries = createQuery(currentUser)
		const files = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			queries
		)

		return parseStringify(files)
	}catch (e) {
		handleError(e, "Failed to get files")
	}
}

export async function renameFile({fileId, name, extension, path}: RenameFileProps) {
	const {databases} = await createAdminClient()

	try {
		const newName = `${name}.${extension}`

		const updateFile = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			fileId,
			{
				name: newName,
			}
		)

		revalidatePath(path)
		return parseStringify(updateFile)
	} catch (e) {
		handleError(e, "Failed to rename file")
	}
}

export async function updateFileShared({fileId, emails, path}: UpdateFileShareProps) {
	const {databases} = await createAdminClient()

	try {

		const updateFile = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			fileId,
			{
				users: emails,
			}
		)

		revalidatePath(path)
		return parseStringify(updateFile)
	} catch (e) {
		handleError(e, "Failed to share file")
	}
}

export async function deleteFile({fileId, bucketFileId, path}: DeleteFileProps) {
	const {databases,storage} = await createAdminClient()

	try {

		const deletedFile = await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.filesCollectionId,
			fileId,
		)

		if(deletedFile) await storage.deleteFile(appwriteConfig.bucketId, bucketFileId)

		revalidatePath(path)
		return parseStringify({"success": true})
	} catch (e) {
		handleError(e, "Failed to share file")
	}
}