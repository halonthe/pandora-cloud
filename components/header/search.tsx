'use client'
import Image from "next/image";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {getFiles} from "@/lib/actions/file.actions";
import {Models} from "node-appwrite";
import Thumbnail from "@/components/file-upload/thumbnail";
import ShowDate from "@/components/content/date";
import {useDebounce} from "use-debounce";

export default function Search() {
	const [search, setSearch] = useState<string>('')
	const [result, setResult] = useState<Models.Document[]>([])
	const [open, setOpen] = useState<boolean>(false)

	const searchParams = useSearchParams()
	const searchQuery = searchParams.get('search') || ''

	const [searchDebounce] = useDebounce(search, 300)

	const path = usePathname()
	const router = useRouter()

	useEffect(() => {
		const fetchData = async () => {
			if(searchDebounce.length === 0) {
				setResult([])
				setOpen(false)
				return router.push(path.replace(searchParams.toString(), ''))
			}

			const files = await getFiles({types: [],search: searchDebounce})
			setResult(files.documents)
			setOpen(true)
		}

		fetchData()
	}, [searchDebounce]);

	useEffect(() => {
		if(searchQuery) {
			setSearch("")
		}
	}, [searchQuery])

	const handleClickItem = (file: Models.Document) => {
		setOpen(false)
		setResult([])
		router.push(`/${(file.type === 'videos' || file.type === 'audios') ? 'media' : file.type}?search=${search}`)
	}

	return(
		<div className={"relative w-full md:max-w-[480px]"}>
			<div className={"flex h-[52px] flex-1 items-center gap-3 rounded-full px-4 drop-shadow-xl bg-white"}>
				<Image src={"/assets/icons/search.svg"} alt={"search"} width={24} height={24} />
				<Input
					value={search}
					placeholder={"search file ..."}
					className={"body-2 placeholder:body-1 w-full border-none p-0 shadow-none placeholder:text-light-200 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"}
					onChange={e => setSearch(e.target.value)}
				/>
			</div>

			{open && (
				<ul className={"absolute left-0 top-16 z-50 flex w-full flex-col gap-3 rounded-[20px] bg-white p-4"}>
					{result.length > 0 ? (
						result.map((file: Models.Document) => (
							<li key={file.$id} className={"flex items-center justify-between"} onClick={()=>handleClickItem(file)}>
								<div className={"flex items-center gap-4 cursor-pointer"}>
									<Thumbnail type={file.type} ext={file.extension} url={file.url} className={"!size-9 min-w-9"}/>
									<p className={"subtitle-2 line-clamp-1 text-light-100"}>{file.name}</p>
								</div>
								<ShowDate date={file.$createdAt} className={"caption text-light-200 line-clamp-1"}/>
							</li>
						))
					) : <p className={"body-2 text-center text-light-100"}>No results found</p>}
				</ul>
			)}
		</div>
	)
}