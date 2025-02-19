import BookList from "@/components/blocks/books-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBooks } from "@/data-access/books";
import { getAuthors } from "@/data-access/authors";
import { type Author } from "@/db/schema";
import { getReviews } from "@/data-access/reviews";

export default async function Home() {
    const books = await getBooks();

    const sortedBooks = books.sort((a, b) => {
        return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
    });

    const authors = await getAuthors();

    const reviews = await getReviews();

    const latestBooks = sortedBooks.slice(0, 3);
    const latestBookAuthors = new Set<Author>();
    latestBooks.forEach((book) => {
        const author = authors.find((author) => author.id === book.authorId);
        if (author) {
            latestBookAuthors.add(author);
        }
    });
    const latestBookReviews = reviews.filter((review) =>
        latestBooks.some((book) => book.id === review.bookId)
    );

    return (
        <div className="container">
            <BookList
                title="New Releases"
                books={latestBooks}
                authors={Array.from(latestBookAuthors)}
                reviews={latestBookReviews}
            >
                <Button variant="link" asChild>
                    <Link href="/books">View All</Link>
                </Button>
            </BookList>
        </div>
    );
}
