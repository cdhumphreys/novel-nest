import { getCurrentUser } from "@/lib/sessions";
import { getProfileByUserId } from "@/lib/profiles";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) {
        return redirect("/login");
    }
    const profile = await getProfileByUserId(user.id);
    return <div className="container mx-auto pt-10 md:pt-20">
        <h1 className="text-2xl">Welcome, <span className="font-bold">{profile?.username}</span></h1>
    </div>;
}
