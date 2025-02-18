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
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye } from "lucide-react";
import { useRef, useState } from "react";

import { signUpAction } from "@/server/actions/authentication";
import { signUpSchema, type TSignUpSchema } from "@/lib/schemas/auth";


export default function SignUpForm() {
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);

    const passwordRef = useRef<HTMLInputElement>(null);
    const form = useForm<TSignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            terms: false,
            offers: false,
        },
    });

    async function onSubmit(values: TSignUpSchema) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value.toString());
        });

        await new Promise(resolve => setTimeout(resolve, 3000));

        const result = await signUpAction(formData);

        if (result.errors) {
            for (const [key, value] of Object.entries(result.errors)) {
                form.setError(key as keyof TSignUpSchema | 'root', { message: value });
            }
        }

        if (result.success) {
            form.reset();
            router.push('/my-profile');
        }
    }

    return (
        <div className="max-w-md w-full mx-auto flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center">Create your account</h2>
            <Form {...form}>
                <FormMessage className="text-destructive">{form.formState.errors?.root?.message}</FormMessage>
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
                                        <Input placeholder="Password" {...field} type={passwordVisible ? "text" : "password"} ref={passwordRef} autoComplete="new-password" />
                                        <Button onClick={() => setPasswordVisible(!passwordVisible)} type="button" variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 ">
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
                            <FormItem className="flex flex-row flex-wrap items-center gap-x-3 space-y-0 px-4 py-2">
                                <FormControl>
                                    <Checkbox
                                        className="w-6 h-6"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>
                                    I agree to the <Link className="underline font-bold" href="/terms" target="_blank">terms of service</Link>
                                </FormLabel>
                                <FormMessage className="w-full pt-2" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="offers"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-x-3 px-4 py-2">
                                <FormControl>
                                    <Checkbox
                                        className="w-6 h-6"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>
                                    I want to receive offers and updates via email.
                                </FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={form.formState.isSubmitting} type="submit" className="mt-2 w-full">{form.formState.isSubmitting ? 'Signing up...' : 'Sign up with email'}</Button>
                </form>
            </Form>
            <p className="text-center mt-5">Already have an account? <Link href="/login" className="underline font-bold">Login</Link></p>
            {/* TODO: Add social login */}
            {/* <div className="flex flex-col gap-5">
                <Button type="button" variant="outline" className="w-full">Continue with Google</Button>
                <Button type="button" variant="outline" className="w-full">Continue with Github</Button>
            </div> */}
        </div >
    );
}
