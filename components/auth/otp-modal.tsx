import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp"
import  React, {useState} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {sendEmailOTP, verifyEmailOTP} from "@/lib/actions/user.actions";


export default function OtpModal({accountId, email}: {accountId: string, email: string}) {
	const router = useRouter()
	const [value, setValue] = useState("")
	const [isOpen, setIsOpen] = useState(true)
	const [isLoading, setIsLoading] = useState(false)

	async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
		setIsLoading(true)

		try {
			await verifyEmailOTP(accountId, value)
		} catch (error) {
			console.log(error)
		}finally {
			setIsLoading(false)
			setIsOpen(false)
			router.push("/")
		}
	}
	async function handleResendOtp(){
		await sendEmailOTP(email)
	}
return (
	<AlertDialog open={isOpen} onOpenChange={setIsOpen} >
		<AlertDialogContent>
			<AlertDialogHeader className={"relative flex justify-center"}>
				<AlertDialogTitle className={"text-center h2"}>
					Enter your OTP
					<Image src={"/assets/icons/close-dark.svg"} alt={"close"} width={20} height={20} className={"cursor-pointer absolute top-0 right-0"} onClick={() => setIsOpen(false)}/>
				</AlertDialogTitle>
				<AlertDialogDescription className={"subtitle-2 text-center"}>
					code sent to <span className={"text-brand"}>{email}</span>
				</AlertDialogDescription>
			</AlertDialogHeader>

			<InputOTP maxLength={6} value={value} onChange={setValue}>
				<InputOTPGroup className={"w-full flex justify-center items-center space-x-2"}>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
					<InputOTPSlot index={2} />
					<InputOTPSlot index={3} />
					<InputOTPSlot index={4} />
					<InputOTPSlot index={5} />
				</InputOTPGroup>
			</InputOTP>

			<AlertDialogFooter>
				<div className={"flex flex-col justify-center w-full"}>
				<AlertDialogAction type={"button"} onClick={handleSubmit} disabled={isLoading} className={"bg-brand"}>
					Submit
					{isLoading && (<Image src={"/assets/icons/loader.svg"} alt={"loading"} width={24} height={24} className={"ml-2 animate-spin"} />)}
				</AlertDialogAction>

					<AlertDialogDescription className={"subtitle-2 text-center"}>
						Didn't get a code? <span className={"text-brand cursor-pointer"} onClick={handleResendOtp}>click to resend</span>
					</AlertDialogDescription>
				</div>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>

)
}