import BookList from "@/components/blocks/books-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBooks } from "@/server/actions/books";

export default async function Home() {
    const { data: books, error } = await getBooks();

    const sortedBooks = books.sort((a, b) => {
        return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
    });

    const latestBooks = sortedBooks.slice(0, 3);
    return (
        <main>
            {error && <div>Error: {error}</div>}
            <BookList title="New Releases" books={latestBooks}>
                <Button variant="link" asChild>
                    <Link href="/books">View All</Link>
                </Button>
            </BookList>
        </main>
    );
}
