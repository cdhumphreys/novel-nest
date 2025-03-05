import * as React from "react"
import { getCurrentSession } from "@/lib/sessions";
import { SessionValidationResult } from "@/data-access/sessions";

export function useSession() {
    const [session, setSession] = React.useState<SessionValidationResult | undefined>(undefined)

    React.useEffect(() => {
        const fetchSession = async () => {
            const session = await getCurrentSession();
            setSession(session);
        }
        fetchSession();
    }, [])

    return session
}
