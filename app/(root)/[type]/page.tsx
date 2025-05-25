import Sort from "@/components/content/sort";
import {getFiles} from "@/lib/actions/file.actions";
import {Models} from "node-appwrite";
import Card from "@/components/content/card";


export default async function Page({params}: SearchParamsProps) {
	const type = ((await params)?.type as string) || "";
	const files = await getFiles();
	return(
		<div className={"mx-auto flex w-full flex-col items-center gap-8"}>
			{/*heading*/}
			<section className={"w-full"}>
				<h1 className={"h1 capitalize"}>{type}</h1>

				<div className={"flex mt-2 flex-col justify-between sm:flex-row sm:items-center"}>
					<p className={"body-1"}>
						Total: <span className={"h5"}>0 MB</span>
					</p>

					<div className={"mt-5 flex items-center sm:mt-0 sm:gap-3"}>
						<p className={"body-1 hidden sm:block text-light-200"}>Sort By:</p>
						<Sort/>
					</div>
				</div>
			</section>

			{/*content*/}
			{files.total > 0 ? (
				<section className={"grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
					{files.documents.map((file: Models.Document) => (
						<Card key={file.$id} file={file}/>
					))}
				</section>
			) : <p className={"body-1 mt-10 text-center text-light-200"}>No files found</p>}
		</div>
	)
}