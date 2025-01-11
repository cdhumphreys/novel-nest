import BookList from "@/components/blocks/BooksList";
import type { Book } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/books`);
    const { data: books }: { data: Book[] } = await res.json();


    const sortedBooks = books.sort((a, b) => {
        return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
    });

    const latestBooks = sortedBooks.slice(0, 3);
    return (
        <main>
            <BookList title="New Releases" books={latestBooks}>
                <Button variant="link" asChild>
                    <Link href="/books">View All</Link>
                </Button>
            </BookList>
        </main>
    );
}
