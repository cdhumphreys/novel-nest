import RegisterForm from "@/components/register-form";

export default function RegisterPage() {
    return (
        <div className="container mx-auto">
            <div className="flex flex-col items-center justify-start pt-10 md:pt-20">
                <RegisterForm />
            </div>
        </div>
    );
}
