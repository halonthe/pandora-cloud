"use client"

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useState} from "react";
import Image from "next/image";
import {Models} from "node-appwrite";
import {dropdownMenu} from "@/constants";
import Link from "next/link";
import {constructDownloadUrl} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";


export default function CardDropdown({file}: {file: Models.Document}) {
	const [modalOpen, setModalOpen] = useState<true | false>(false)
	const [dropdownOpen, setDropdownOpen] = useState<true | false>(false)
	const [isLoading, setIsLoading] = useState<true | false>(false)
	const [action, setAction] = useState<ActionType | null>(null)
	const [fileName, setFileName] = useState<string | null>(file.name)

	const handleAction = (action: ActionType) => () => {
		setAction(action)
		if(['rename','share','delete','details'].includes(action.value)) setModalOpen(true)
	}

	const handleCancel = () => {
		setAction(null)
		setFileName(file.name)
		setModalOpen(false)
	}

	const renderDialogContent = () => {
		if(!action) return null

		const {value, label} = action
		return (<DialogContent className={"rounded-[26px] w-[90%] max-w-[400px] px-6 py-8"}>
			<DialogHeader className={"flex flex-col gap-3"}>
				<DialogTitle className={"text-light-100 text-center"}>{label}</DialogTitle>
				{value === 'rename' && <Input type={"text"} placeholder={"New file name"} value={fileName} onChange={(e) => setFileName(e.target.value)}
				className={"body-2 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-[52px] w-full rounded-full border px-4 shadow-drop-1"}/>}
			</DialogHeader>
			{['rename','share','delete'].includes(value) && (
				<DialogFooter className={"flex flex-col gap-3 md:flex-row"}>
					<Button onClick={handleCancel} className={"h-[52px] flex-1 rounded-full bg-white text-light-100 hover:bg-transparent"}>
						Cancel
					</Button>
					<Button className={"bg-brand hover:bg-brand-100 transition-all rounded-full text-[14px] leading-[20px] font-medium !mx-0 h-[52px] w-full flex-1"}>
						<p className={"capitalize"}>{value}</p>
						{isLoading && <Image src={"/assets/icons/loader.svg"} alt={"loading"} width={24} height={24} className={"animate-spin"}/>}
					</Button>
				</DialogFooter>
			)}
		</DialogContent>)
	}

	return(
		<Dialog open={modalOpen} onOpenChange={setModalOpen}>
			<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
				<DropdownMenuTrigger className={"outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"}>
					<Image src={"/assets/icons/dots.svg"} alt={"action"} width={34} height={34} />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel className={"max-w-[200px] truncate"}>{file.name}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{dropdownMenu.map((item) => (
						<DropdownMenuItem key={item.value} className={"cursor-pointer"} onClick={handleAction(item)}>
							{item.value === 'download' ? (
								<Link href={constructDownloadUrl(file.bucketFileId)} download={file.name} className={"flex items-center gap-2"}>
									<Image src={item.icon} alt={item.label} width={30} height={30}/>
									{item.label}
								</Link>
							): <div className={"flex items-center gap-2"}>
								<Image src={item.icon} alt={item.label} width={30} height={30}/>
								{item.label}
							</div>}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			{renderDialogContent()}
		</Dialog>
	)
}