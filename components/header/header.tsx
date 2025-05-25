import {Button} from "@/components/ui/button";
import Image from "next/image";
import Search from "@/components/header/search";
import FileUpload from "@/components/header/file-upload";

export default function Header({userId, accountId}:{userId: string, accountId: string}) {
	return(
		<header className={"hidden items-center justify-between gap-5 p-5 sm:flex lg:py-7 xl:gap-10"}>
			<Search/>
			<div className={"flex items-center min-w-fit gap-4"}>
				<FileUpload accountId={accountId} ownerId={userId}/>
				<form>
					<Button className={"flex-center h-[52px] min-w-[54px] items-center rounded-full bg-brand/10 p-0 text-brand shadow-none transition-all hover:bg-brand/20"}>
						<Image src={"/assets/icons/logout.svg"} alt={"logout"} width={24} height={24} />
					</Button>
				</form>
			</div>
		</header>
	)
}