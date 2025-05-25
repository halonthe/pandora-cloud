"use client"

import {
	Dialog,
	DialogContent, DialogDescription,
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
import {deleteFile, renameFile, updateFileShared} from "@/lib/actions/file.actions";
import {usePathname} from "next/navigation";
import {FileDetails, ShareInput} from "@/components/content/action-modals";



export default function CardDropdown({file}: {file: Models.Document}) {
	const [modalOpen, setModalOpen] = useState(false)
	const [dropdownOpen, setDropdownOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [action, setAction] = useState<ActionType | null>(null)
	const [fileName, setFileName] = useState(file.name)
	const [emails, setEmails] = useState<string[]>([])

	const path = usePathname()

	const handleOpenAction = (item: ActionType) => () => {
		setAction(item)
		if(['rename','share','delete','details'].includes(item.value)) setModalOpen(true)
	}

	const handleSubmitAction = () => async () => {
		if(!action) return;

		const actions = {
			rename: () => renameFile({
				fileId: file.$id,
				name: fileName,
				extension: file.extension,
				path: path,
			}),
			share: () => updateFileShared({
				fileId: file.$id,
				emails: emails,
				path: path,
			}),
			delete: () => deleteFile({
				fileId: file.$id,
				bucketFileId: file.bucketFileId,
				path: path,
			}),
		}

		let success = false
		setIsLoading(true)

		success = await actions[action.value as keyof typeof actions]();
		if(success) handleCancel()

		setIsLoading(false)

	}

	const handleCancel = () => {
		setAction(null)
		setFileName(file.name)
		setModalOpen(false)
		setDropdownOpen(false)
	}

	const handleRemoveUser = async (email: string) => {
		const filteredEmails = emails.filter((e) => e !== email)

		const success = await updateFileShared({
			fileId: file.$id,
			emails: filteredEmails,
			path: path,
		})

		if(success) setEmails(filteredEmails)
		handleCancel()
	}

	const renderDialogContent = () => {
		if(!action) return null

		const {value, label} = action
		return (<DialogContent className={"rounded-[26px] w-[90%] max-w-[400px] px-6 py-8"}>
			<DialogHeader className={"flex flex-col gap-3"}>
				<DialogTitle className={"text-light-100 text-center"}>{label}</DialogTitle>

				{value === 'rename' && <Input type={"text"} placeholder={"New file name"} value={fileName} onChange={(e) => setFileName(e.target.value)}
				className={"body-2 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-[52px] w-full rounded-full border px-4 shadow-drop-1"}/>}

				{value === 'details' && <FileDetails file={file}/>}
				{value === 'share' && <ShareInput file={file} onInputChange={setEmails} onRemove={handleRemoveUser}/>}
				{value === 'delete' && <DialogDescription className={"text-center text-light-100"}>Are you sure you want to delete <span className={"font-medium text-brand-100"}>{file.name}</span>?</DialogDescription>}
			</DialogHeader>

			{['rename','share','delete'].includes(value) && (
				<DialogFooter className={"flex flex-col gap-3 md:flex-row"}>
					<Button onClick={handleCancel} className={"h-[52px] flex-1 rounded-full bg-white text-light-100 hover:bg-transparent"}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmitAction()}
						className={"bg-brand hover:bg-brand-100 transition-all rounded-full text-[14px] leading-[20px] font-medium !mx-0 h-[52px] w-full flex-1"}
					>
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
						<DropdownMenuItem key={item.value} className={"cursor-pointer"} onClick={handleOpenAction(item)}>
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