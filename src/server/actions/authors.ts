import type { Author } from "@/lib/types";

export async function getAuthors() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/authors.json`);
        const data: Author[] = await res.json();

        return { data, error: null };
    } catch (error) {
        return { data: [], error: "Failed to fetch authors" };
    }
}

export async function getAuthor(id: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/authors.json`);
        const data: Author[] = await res.json();
        const author: Author | undefined = data.find(
            (author: Author) => author.id === id
        );
        return { data: author, error: null };
    } catch (error) {
        return { data: null, error: "Failed to fetch author" };
    }
}
