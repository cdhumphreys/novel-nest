"use client"

import Link from "next/link";
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
import { Checkbox } from "@/components/ui/checkbox"
import { Eye } from "lucide-react";
import { useRef } from "react";

import { signUpAction } from "@/server/actions/authentication";
import { registerSchema } from "@/lib/schemas/auth";



export default function RegisterForm() {
    const passwordRef = useRef<HTMLInputElement>(null);
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            terms: false,
            offers: false,
        },

    });

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value.toString());
        });
        const result = await signUpAction(formData);
        console.log(result);
    }

    return (
        <div className="max-w-md w-full mx-auto flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center">Create your account</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Display Name" {...field} autoComplete="username" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Email" {...field} type="email" autoComplete="email" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="Password" {...field} type="password" ref={passwordRef} autoComplete="new-password" />
                                        <Button onClick={() => passwordRef.current!.type = (passwordRef.current!.type === "password" ? "text" : "password")} type="button" variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 ">
                                            <Eye />
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md px-4 py-2">
                                <FormControl>
                                    <Checkbox
                                        className="w-6 h-6"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        required
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        I agree to the <Link className="underline font-bold" href="#">terms of service</Link>
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="offers"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md px-4 py-2">
                                <FormControl>
                                    <Checkbox
                                        className="w-6 h-6"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        I want to receive offers and updates via email.
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="mt-2 w-full">Sign up with email</Button>
                </form>
            </Form>
            <p className="text-center mt-5">Already have an account? <Link href="/login" className="underline font-bold">Login</Link></p>
            {/* TODO: Add social login */}
            {/* <div className="flex flex-col gap-5">
                <Button type="button" variant="outline" className="w-full">Continue with Google</Button>
                <Button type="button" variant="outline" className="w-full">Continue with Github</Button>
            </div> */}
        </div>
    );
}
