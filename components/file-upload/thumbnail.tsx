import Image from "next/image";
import {getFileIcons} from "@/lib/utils";
import {cn} from "@/lib/utils";

interface Props {
	type: string,
	ext: string,
	url?: string,
	className?: string,
	imageClassName?: string,
}

export default function Thumbnail({type, ext, url = '', className,imageClassName}: Props) {
	const isImage = type === 'images' && ext !== 'svg'
	return(
		<figure className={cn("flex item-center justify-center size-[50px] min-w-[50px] overflow-hidden rounded-full bg-brand/10", className)}>
			<Image src={isImage ? url : getFileIcons(ext,type)} alt={"thumbnail"} width={100} height={100} className={cn("size-8 object-contain", imageClassName, isImage && "size-full object-cover object-center")}/>
		</figure>
	)
}