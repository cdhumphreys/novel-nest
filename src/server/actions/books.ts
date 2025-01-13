import type { Book } from "@/lib/types";

export async function getBooks() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/books.json`);
        const data: Book[] = await res.json();

        return { data, error: null };
    } catch (error) {
        return { data: [], error: "Failed to fetch books" };
    }
}

export async function getBook(id: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/books.json`);
        const data: Book[] = await res.json();
        const book: Book | undefined = data.find((book: Book) => book.id === id);
        return { data: book, error: null };
    } catch (error) {
        return { data: null, error: "Failed to fetch book" };
    }

}