"use client"
import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {Button} from "@/components/ui/button";
import {cn, convertFileToUrl, getFileType} from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/file-upload/thumbnail";

interface Props {
	ownerId: string,
	accountId: string,
	className?: string,
}


export default function FileUpload({ownerId, accountId, className}: Props) {
	const [files, setFiles] = useState<File[]>([])

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		// Do something with the files
		setFiles(acceptedFiles)
	}, [])

	const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

	const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string) => {
		e.stopPropagation()
		setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
	}

	return (
		<div {...getRootProps()} className={"cursor-pointer"}>
			<input {...getInputProps()} />
			<Button type={"button"} className={cn("bg-brand hover:bg-brand-100 transition-all rounded-full button h-[52px] gap-2 px-10 drop-shadow-lg", className)}>
				<Image src={"/assets/icons/upload.svg"} alt={"upload"} width={24} height={24} />
				<p>Upload</p>
			</Button>
			{ files.length > 0 && (
				<ul className={"fixed bottom-10 right-10 z-50 flex size-full h-fit max-w-[480px] flex-col gap-3 rounded-[20px] bg-white p-7 drop-shadow-xl"}>
					<h4 className={"h4 text-light-100"}>Uploading</h4>

					{files.map((file, index) => {
						const {type,ext} = getFileType(file.name)

						return (
							<li key={`${file.name}-${index}`} className={"flex items-center justify-between gap-3 rounded-xl p-3 drop-shadow-lg"}>
								<div className={"flex items-center gap-3"}>
									<Thumbnail type={type} ext={ext} url={convertFileToUrl(file)}/>
									<div className={"subtitle-2 mb-2 line-clamp-1 max-w-[300px]"}>
									{file.name}
										<Image src={"/assets/icons/file-loader.gif"} alt={"loading"} width={80} height={26} />
									</div>
								</div>

								<div>
									<Image src={"/assets/icons/remove.svg"} alt={"remove"} width={24} height={24} onClick={(e)=> handleRemoveFile(e, file.name)} />
								</div>
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}