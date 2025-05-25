import {cn, formatDate} from "@/lib/utils";


export default function ShowDate({date, className}: {date: string, className?: string}){
return(
	<p className={cn("body-1 text-light-100", className)}>{formatDate(date)}</p>
)
}