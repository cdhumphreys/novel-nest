import SignUpForm from "./components/sign-up-form";

export default function SignUpPage() {
    return (
        <div className="container mx-auto">
            <div className="flex flex-col items-center justify-start pt-10 md:pt-20">
                <SignUpForm />
            </div>
        </div>
    );
}
