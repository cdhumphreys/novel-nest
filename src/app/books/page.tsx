import BookList from "@/components/blocks/BooksList";
import { getAuthors, getBooks } from "@/app/api/utils";

export default async function BooksPage() {
    const books = await getBooks();
    const authors = await getAuthors();

    const sortedBooks = books.sort((a, b) => {
        return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
    });

    return <BookList title="All Books" books={sortedBooks} authors={authors} />;
}

