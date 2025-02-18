import { checkAuthorisedUser } from "@/lib/sessions";

export default async function AdminPage() {
    const user = await checkAuthorisedUser();

    return <div>Admin</div>;
}