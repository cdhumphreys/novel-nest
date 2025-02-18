import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { deleteSessionCookie } from "@/lib/sessions";
import { validateSessionToken, invalidateSession } from "@/server/sessions";

export async function GET(request: Request) {
    const token = cookies().get("session")?.value ?? null;
    if (token === null) {
        return redirect("/login");
    }
    const { session, user } = await validateSessionToken(token);
    if (session === null || user === null) {
        return redirect("/login");
    }

    await invalidateSession(session.id);

    await deleteSessionCookie();
    return redirect("/login");
}
