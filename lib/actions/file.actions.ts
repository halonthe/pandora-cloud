'use server'

import {UploadFileProps} from "@/lib/types";
import {createAdminClient} from "@/lib/appwrite";
import {InputFile} from "node-appwrite/file"
import {appwriteConfig} from "@/lib/appwrite/config";
import { ID } from "node-appwrite";
import {constructFileUrl, getFileTypes} from "@/lib/utils";
import {parseStringify} from "@/lib/utils";
import { revalidatePath } from "next/cache";

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