import React from "react"
import Sidebar from "@/components/navigation/sidebar";
import Header from "@/components/header/header";
import MobileNav from "@/components/navigation/mobile-nav";
import {getCurrentUser} from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

export const dynamic = 'force-dynamic';

export default async function Layout({children}:{children: React.ReactNode}) {
	const currentUser = await getCurrentUser();
	if(!currentUser) return redirect('/login')
	return (
		<main className={"flex h-screen"}>
			<Sidebar {...currentUser}/>
			<section className={"flex flex-col flex-1 h-full"}>
				<MobileNav {...currentUser}/>
				<Header accountId={currentUser.accountId} userId={currentUser.$id}/>
				<div className={"remove-scrollbar h-full flex-1 overflow-auto bg-light-400 px-5 py-7 sm:mr-7 sm:rounded-[30px] md:mb-7 md:px-9 md:py-10"}>
					{children}
				</div>
			</section>

			<Toaster/>
		</main>
	)
}