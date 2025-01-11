import type { Author } from "@/app/api/types";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/authors.json`, process.env.NODE_ENV != "production" ? { cache: "no-store" } : {});
        const data: Author[] = await res.json();
        const author: Author | undefined = data.find(
            (author: Author) => author.id === params.id
        );
        return Response.json({ data: author });
    } catch (error) {
        return Response.json(
            { data: [], error: "Failed to fetch author" },
            { status: 500 }
        );
    }
}
