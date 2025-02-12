import LoginForm from "@/components/login-form";

export default function LoginPage() {
    return (
        <div className="container mx-auto">
            <div className="flex flex-col items-center justify-start pt-10 md:pt-20">
                <LoginForm />
            </div>
        </div>
    );
}
