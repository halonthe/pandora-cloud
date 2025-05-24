'use server'

import { Query, ID } from "node-appwrite"
import { createAdminClient,createSessionClient } from "@/lib/appwrite"
import { appwriteConfig } from "@/lib/appwrite/config"
import {parseStringify} from "@/lib/utils";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function getUserByEmail(email: string) {
	const { databases } = await createAdminClient()

	const result = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, [Query.equal("email", [email])])

	return result.total > 0 ? result.documents[0] : null
}

function handleError(error: unknown, message: string) {
	console.log(error, message)
	throw error;
}

export async function sendEmailOTP(email: string) {
	const { account } = await createAdminClient()

	try {
		const session = await account.createEmailToken(ID.unique(), email)
		return session.userId;
	} catch (error) {
		handleError(error, "Failed to send OTP")
	}
}

export async function createUser({fullName, email}: {fullName: string, email: string}) {
	const userExists = await getUserByEmail(email);
	if(userExists) throw new Error("User already exists")

	const accountId = await sendEmailOTP(email)
	if(!accountId) throw new Error("Failed to send OTP")

	const { databases } = await createAdminClient()
	await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, ID.unique(), {fullName, email, accountId, avatar:"https://avatar.iran.liara.run/public"})

	return parseStringify({accountId})
}

export async function verifyEmailOTP(accountId: string, otp: string) {
	try {
	const { account } = await createAdminClient()

	const session = await account.createSession(accountId, otp);

	(await cookies()).set('appwrite-session', session.secret, {
		path: '/',
		maxAge: 60 * 60 * 24 * 30, // 30 days
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
	})

	return parseStringify({sessionId: session.$id})
	}catch (e) {
		handleError(e, "Failed to verify OTP")
	}
}

export async function logout() {
	const { account } = await createSessionClient()

	try {
		await account.deleteSession("current");
		(await cookies()).delete('appwrite-session')
	} catch (error) {
		handleError(error, "Failed to logout")
	}finally {
		redirect("/")
	}
}

export async function login({email}:{email:string}) {
	try {
		const user = await getUserByEmail(email)
		if(!user) return parseStringify({accountId: null, error: "User not found"})

		await sendEmailOTP(email)
		return parseStringify({accountId: user.accountId})
	}catch (e) {
		handleError(e, "Failed to login")
	}
}

export async function getCurrentUser() {
	const { account, databases } = await createSessionClient()

	const result = await account.get()

	const user = await databases.listDocuments(
		appwriteConfig.databaseId,
		appwriteConfig.usersCollectionId,
		[Query.equal("accountId", result.$id)]
	)
	if(user.total <= 0) return null

	return parseStringify(user.documents[0])
}