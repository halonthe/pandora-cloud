"use client"
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {navigation} from "@/constants";
import {cn} from "@/lib/utils";

interface Props {
	fullName: string,
	email: string,
	avatar: string,
}
export default function Sidebar({fullName, email, avatar} : Props) {
	const pathname = usePathname()

	return (
		<aside className={"remove-scrollbar hidden h-screen w-[90px] flex-col overflow-auto px-5 py-7 sm:flex lg:w-[280px] xl:w-[325px]"}>
			<Link href={"/"}>
				<Image src={"/assets/icons/logo-full-brand.svg"} alt={"logo"} width={160} height={50} className={"hidden lg:block h-auto"}/>
				<Image src={"/assets/icons/logo-brand.svg"} alt={"logo"} width={52} height={52} className={"lg:hidden"}/>
			</Link>

			<nav className={"h5 mt-9 flex-1 gap-1 text-brand"}>
				<ul className={"flex flex-1 flex-col gap-6"}>
					{navigation.map(({href, name, icons}) => (
						<Link href={href} key={name} className={"lg:w-full"}>
							<li className={cn("flex text-light-100 gap-4 rounded-xl lg:w-full justify-center lg:justify-start items-center h5 lg:px-[30px] h-[52px] lg:rounded-full", pathname === href && "bg-brand text-white drop-shadow-lg")}>
								<Image src={icons} alt={name} width={24} height={24} className={cn("w-6 filter invert opacity-25", pathname === href && "invert-0 opacity-100")}/>
								<p className={"hidden lg:block"}>{name}</p>
							</li>
						</Link>
					))}
				</ul>
			</nav>
			
			<Image src={'/assets/images/files-2.png'} alt={"files"} width={506} height={418} className={"w-full hidden lg:block h-auto"}/>

			<div className={"mt-4 flex items-center justify-center gap-2 rounded-full bg-brand/10 p-1 text-light-100 lg:justify-start lg:p-3"}>
				<Image src={avatar} alt={"avatar"} width={44} height={44} className={"aspect-square w-10 rounded-full object-cover"}/>
				<div className={"hidden lg:block "}>
				<p className={"subtitle-2 capitalize"}>{fullName}</p>
				<p className={"caption"}>{email}</p>
				</div>
			</div>
		</aside>
	)
}