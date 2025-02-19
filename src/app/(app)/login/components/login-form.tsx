"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Eye } from "lucide-react";
import { useRef, useState } from "react";

import { loginAction } from "@/server/actions/authentication";
import { loginSchema, type TLoginSchema } from "@/lib/schemas/auth";


export default function LoginForm() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const passwordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const form = useForm<TLoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: TLoginSchema) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value.toString());
        });

        const result = await loginAction(formData);

        if (result.errors) {
            for (const [key, value] of Object.entries(result.errors)) {
                form.setError(key as keyof TLoginSchema | 'root', { message: value });
            }
        }

        if (result.success) {
            form.reset();
            router.push('/my-profile');
        }
    }

    return (
        <div className="max-w-md w-full mx-auto flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center">Login to your account</h2>
            <Form {...form}>
                <FormMessage className="text-destructive">{form.formState.errors?.root?.message}</FormMessage>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                                        <Input placeholder="Password" {...field} type={passwordVisible ? "text" : "password"} ref={passwordRef} autoComplete="password" />
                                        <Button onClick={() => setPasswordVisible(!passwordVisible)} type="button" variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 ">
                                            <Eye />
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button disabled={form.formState.isSubmitting} type="submit" className="mt-2 w-full">{form.formState.isSubmitting ? 'Logging in...' : 'Login'}</Button>
                </form>
            </Form>
            <p className="text-center mt-5">Don't have an account? <Link href="/sign-up" className="underline font-bold">Register</Link></p>
            {/* TODO: Add social login */}
            {/* <div className="flex flex-col gap-5">
                <Button type="button" variant="outline" className="w-full">Continue with Google</Button>
                <Button type="button" variant="outline" className="w-full">Continue with Github</Button>
            </div> */}
        </div >
    );
}
