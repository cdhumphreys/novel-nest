import BookList from "@/components/blocks/books-list";
import { getBooks } from "@/server/actions/books";
import { getAuthors } from "@/server/actions/authors";
import { getReviews } from "@/server/actions/reviews";

export default async function BooksPage() {
    const { data: books, error: booksError } = await getBooks();
    const { data: authors, error: authorsError } = await getAuthors();

    const sortedBooks = books.sort((a, b) => {
        return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
    });

    const { data: reviews, error: reviewsError } = await getReviews();

    if (booksError || authorsError) {
        return <div>Error: {booksError || authorsError}</div>;
    }

    return <BookList title="All Books" books={sortedBooks} authors={authors} reviews={reviews} />;
}


