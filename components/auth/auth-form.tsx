"use client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import Image from "next/image";
import {createUser, login} from "@/lib/actions/user.actions";
import OtpModal from "@/components/auth/otp-modal";


export default function AuthForm({type}:{type:"login" | "register"}) {
	const [errorMessage, setErrorMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [accountId, setAccountId] = useState(null)

	const formSchema = z.object({
		email: z.string().email(),
		fullName: type === 'login' ? z.string().optional() : z.string().min(3).max(20),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			fullName: "",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {

		setErrorMessage("")
		setIsLoading(true)

		try {

		const user = type === "register" ? await createUser({
			fullName: values.fullName || "",
			email: values.email,
		}) : await login({email: values.email})

		setAccountId(user.accountId)

		}catch{
			setErrorMessage("Something went wrong")
		}finally {
			setIsLoading(false)
		}
	}
	return (
		<>
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex max-h-[800px] w-full max-w-[580px] flex-col justify-center space-y-6 transition-all lg:h-full lg:space-y-8">
				<h1 className={"h1 text-center text-light-100 md:text-left"}>{type === "login" ? "Login" : "Create Account"}</h1>

				{type === "register" &&
					<FormField
						control={form.control}
						name="fullName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full Name</FormLabel>
								<FormControl>
									<Input placeholder="Enter your full name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				}
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="Enter your email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className={"bg-brand rounded-full h-[66px]"} disabled={isLoading}>
					{type === "login" ? "Login" : "Register"}
					{isLoading && <Image src={"/assets/icons/loader.svg"} alt={"loading"} width={24} height={24} className={"ml-2 animate-spin"} />}
				</Button>
				{errorMessage && <FormDescription className={"text-error"}>*{errorMessage}</FormDescription>}
				<FormDescription className={"text-center body-2"}>
					{type === "login" ? (
						<>
						<span>Don&apos;t have an account? </span>
						<Link href={"/register"} className={"text-brand"}>Register</Link>
						</>) : (
						<>
							<span>Already have an account? </span>
							<Link href={"/login"} className={"text-brand"}>Login</Link>
						</>
					)}
				</FormDescription>
			</form>
		</Form>

			{accountId && <OtpModal accountId={accountId} email={form.getValues("email")} />}
		</>
	)
}