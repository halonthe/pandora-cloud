import {Models} from "node-appwrite";
import Link from "next/link";
import Thumbnail from "@/components/file-upload/thumbnail";
import {convertFileSize} from "@/lib/utils";
import ShowDate from "@/components/content/date";
import CardDropdown from "@/components/content/card-dropdown";

export default function Card({file}: {file: Models.Document}) {
	return(
		<Link
			href={file.url}
			target={"_blank"}
			className={"flex cursor-pointer flex-col gap-6 rounded-[18px] bg-white p-5 shadow-sm transition-all hover:drop-shadow-md"}
		>
			<div className={"flex justify-between"}>
				<Thumbnail type={file.type} ext={file.extension} url={file.url} className={"!size-20"} imageClassName={"!size-11"}/>
				<div className={"flex flex-col items-end justify-between"}>
					<CardDropdown file={file}/>
					<p className={"body-1"}>{convertFileSize(file.size)}</p>
				</div>
			</div>

			<div className={"flex flex-col gap-2 text-light-100"}>
				<p className={"subtitle-2 line-clamp-1"}>{file.name}</p>
				<ShowDate date={file.$createdAt}/>
				<p className={"caption text-light-200 line-clamp-1"}>By: {file.owner.fullName}</p>
			</div>
		</Link>
	)
}