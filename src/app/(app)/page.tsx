import BookList from "@/components/blocks/books-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBooks } from "@/server/actions/books";
import { getAuthors } from "@/server/actions/authors";
import { Author } from "@/lib/types";
import { getReviews } from "@/server/actions/reviews";

export default async function Home() {
    const { data: books, error } = await getBooks();

    const sortedBooks = books.sort((a, b) => {
        return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
    });

    const { data: authors, error: authorsError } = await getAuthors();

    const { data: reviews, error: reviewsError } = await getReviews();

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
