import type { Book } from "../data";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/books.json`);
        const data: Book[] = await res.json();
        const book: Book | undefined = data.find(
            (book: Book) => book.id === params.id
        );
        return Response.json({ data: book });
    } catch (error) {
        return Response.json(
            { data: [], error: "Failed to fetch book" },
            { status: 500 }
        );
    }
}
