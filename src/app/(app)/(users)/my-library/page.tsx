import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/sessions";

export default async function MyLibraryPage() {
    const { user } = await getCurrentUser();
    if (!user) {
        return redirect('/login');
    }
    return <div>My Library</div>;
}
