import type { Book } from "./data";

export async function GET() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN}/books.json`,
            process.env.NODE_ENV != "production" ? { cache: "no-store" } : {}
        );
        const data: Book[] = await res.json();

        return Response.json({ data });
    } catch (error) {
        return Response.json(
            { data: [], error: "Failed to fetch books" },
            { status: 500 }
        );
    }
}
