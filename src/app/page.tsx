import BookList from "@/components/blocks/books-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBooks } from "./api/utils";

export default async function Home() {
    const books = await getBooks()


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
