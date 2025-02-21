import { checkAuthorisedUser } from "@/lib/sessions";
import { redirect } from "next/navigation";
export default async function AdminPage() {
    const { user, error } = await checkAuthorisedUser();

    if (error?.error === "AuthorisationError") {
        return redirect('/errors/authorisation');
    }

    if (!user) {
        return redirect('/login');
    }

    return <div>Admin</div>;
}