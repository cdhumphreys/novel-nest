import type { Author } from "@/app/api/types";

export async function GET() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN}/authors.json`,
            process.env.NODE_ENV != "production" ? { cache: "no-store" } : {}
        );
        const data: Author[] = await res.json();

        return Response.json({ data });
    } catch (error) {
        return Response.json(
            { data: [], error: "Failed to fetch authors" },
            { status: 500 }
        );
    }
}
