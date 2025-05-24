import React from "react";
import Image from "next/image"

export default function AuthLayout({children}: {children: React.ReactNode}) {
	return (
		<div className={"flex min-h-screen"}>
			<section className={"hidden lg:flex flex-col w-1/2 xl:w-2/5 items-center justify-center bg-brand p-10"}>
				<div className={"flex flex-col max-h-[800px] max-w-[430px] space-y-12 justify-center"}>
				<Image src={"/assets/icons/logo-full.svg"} alt={"logo"} width={224} height={82} />
				<div className={"text-white space-y-5"}>
				<h1 className={"h1"}>Manage your files the best way</h1>
					<p className={"body-1"}>Awesome, we've created the perfect place for you to store all your documents.</p>
				</div>
				<Image src={"/assets/images/files.png"} alt={"files"} width={342} height={342} className={"hover:rotate-2 hover:scale-110 transition-all"}/>
				</div>
			</section>

			<section className={"flex flex-col flex-1 items-center lg:justify-center bg-white p-4 py-10 lg:p-10 lg:py-0"}>
				<div className={"mb-16 lg:hidden"}>
					<Image src={"/assets/icons/logo-full-brand.svg"} alt={"logo"} width={224} height={82} />
				</div>
			{children}
			</section>
		</div>
	)
}