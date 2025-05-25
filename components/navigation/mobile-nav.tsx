"use client"
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import Image from "next/image";
import {usePathname} from "next/navigation";
import {navigation} from "@/constants";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import FileUpload from "@/components/header/file-upload";

interface Props {
	avatar: string,
	fullName: string,
	email: string,
	$id: string,
	accountId: string,
}

export default function MobileNav({avatar, fullName, email, $id: ownerId, accountId}: Props) {

	const pathname = usePathname()
	return(
		<header className={"flex h-[60px] justify-between px-5 sm:hidden"}>
			<Image src={"/assets/icons/logo-full-brand.svg"} alt={"logo"} width={120} height={52} className={"h-auto"}/>

			<Sheet>
				<SheetTrigger>
					<Image src={"/assets/icons/menu.svg"} alt={"menu"} width={24} height={24} className={"h-auto"}/>
				</SheetTrigger>
				<SheetContent className={"pt-0 h-screen px-3"}>
						<SheetTitle>
							<div className={"my-3 flex items-center gap-2 rounded-full p-1 text-light-100 sm:justify-center sm:bg-brand/10 lg:justify-start lg:p-3"}>
								<Image src={avatar} alt={"avatar"} width={44} height={44} className={"aspect-square w-10 rounded-full object-cover"}/>
								<div className={"sm:hidden lg:block "}>
								<p className={"subtitle-2 capitalize"}>{fullName}</p>
								<p className={"caption"}>{email}</p>
								</div>
							</div>
							<Separator className={"mb-4 bg-light-200/20"}/>

						</SheetTitle>
						<nav className={"h5 flex-1 gap-1 text-brand"}>
							<ul className={"flex flex-1 flex-col gap-4"}>
								{navigation.map(({href, name, icons}) => (
									<Link href={href} key={name} className={"lg:w-full"}>
										<li className={cn("flex text-light-100 gap-4 w-full justify-start items-center h5 px-6 h-[52px] rounded-full", pathname === href && "bg-brand text-white drop-shadow-lg")}>
											<Image src={icons} alt={name} width={24} height={24} className={cn("w-6 filter invert opacity-25", pathname === href && "invert-0 opacity-100")}/>
											<p>{name}</p>
										</li>
									</Link>
								))}
							</ul>
						</nav>

					<Separator className={"my-5 bg-light-200/20"}/>

					<div className={"flex flex-col gap-5 justify-between pb-5"}>

						<FileUpload ownerId={ownerId} accountId={accountId}/>
						<Button type={"submit"} className={"h5 flex h-[52px] w-full items-center gap-4 rounded-full bg-brand/10 px-6 text-brand shadow-none transition-all hover:bg-brand/20"} onClick={() => {}}>
							<Image src={"/assets/icons/logout.svg"} alt={"logout"} width={24} height={24} />
							<p className={"text-brand"}>Logout</p>
						</Button>

					</div>
				</SheetContent>
			</Sheet>

		</header>
	)
}