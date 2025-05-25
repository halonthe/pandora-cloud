import {Models} from "node-appwrite";
import Thumbnail from "@/components/file-upload/thumbnail";
import ShowDate from "@/components/content/date";
import {convertFileSize, formatDate} from "@/lib/utils";
import React from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Image from "next/image";

function ImageThumbnails({file}: {file: Models.Document}) {
	return(
		<div className={"mb-1 flex items-center gap-3 rounded-xl border border-light-200/40 bg-light-400/50 p-3"}>
			<Thumbnail type={file.type} ext={file.extension} url={file.url} />
			<div className={"flex flex-col"}>
				<p className={"subtitle-2 mb-1"}>{file.name}</p>
				<ShowDate date={file.$createdAt} className={"caption"}/>
			</div>
		</div>
	)
}

function DetailRow({label,value}:{label: string, value: string}) {
	return(
		<div className={"flex"}>
			<p className={"body-2 w-[30%] text-light-100 text-left"}>{label}</p>
			<p className={"subtitle-2 flex-1 text-left"}>{value}</p>
		</div>
	)
}

export function FileDetails({file}:{file: Models.Document}) {
	return(
		<>
			<ImageThumbnails file={file}/>
			<div className={"space-y-4 px-2 pt-2"}>
			<DetailRow label={"Format:"} value={file.extension}/>
			<DetailRow label={"Size:"} value={convertFileSize(file.size)}/>
			<DetailRow label={"Owner:"} value={file.owner.fullName}/>
			<DetailRow label={"Last edit:"} value={formatDate(file.$updatedAt)}/>
			</div>
		</>
	)
}

interface Props {
	file: Models.Document,
	onInputChange: React.Dispatch<React.SetStateAction<string[]>>,
	onRemove: (email: string) => void,
}

export  function ShareInput({file,onInputChange, onRemove}: Props) {
	return(
		<>
			<ImageThumbnails file={file}/>
			<div className={"mt-2 space-y-2"}>
				<p className={"pl-1 subtitle-2 text-light-100"}>Share files with other users?</p>
				<Input
					type={"email"}
					placeholder={"Enter email"}
					onChange={e => onInputChange(e.target.value.trim().split(','))}
					className={"body-2 shad-no-focus h-[52px] w-full rounded-full border px-4 shadow-drop-1"}
				/>

				<div className={"pt-4"}>
					<div className={"flex justify-between"}>
						<p className={"subtitle-2 text-light-100"}>Share with</p>
						<p className={"subtitle-2 text-light-200"}>{file.users.length} users</p>
					</div>

					<ul className={"pt-2"}>
						{file.users.map((email: string) => (
							<li key={email} className={"flex items-center gap-2 justify-between"}>
								<p className={"subtitle-2"}>{email}</p>
								<Button onClick={() => onRemove(email)} type={"button"} className={"rounded-full bg-transparent shadow-none hover:bg-transparent"}>
									<Image src={"/assets/icons/remove.svg"} alt={"remove"} width={24} height={24} className={"aspect-square rounded-full"}/>
								</Button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	)
}