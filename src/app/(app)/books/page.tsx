import BookList from "@/components/blocks/books-list";
import { getBooks } from "@/data-access/books";
import { getAuthors } from "@/data-access/authors";
import { getReviews } from "@/data-access/reviews";

export default async function BooksPage() {
    const books = await getBooks();
    const authors = await getAuthors();

    const sortedBooks = books.sort((a, b) => {
        return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
    });

    const reviews = await getReviews();


    return (
        <div className="container">
            <BookList
                title="All Books"
                books={sortedBooks}
                authors={authors}
                reviews={reviews}
            />
        </div>
    );
}
