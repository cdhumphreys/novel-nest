import BookList from "@/components/blocks/BooksList";
import type { Book } from "@/app/api/types";

export default async function BooksPage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/books`);
    const { data: books }: { data: Book[] } = await res.json();


    const sortedBooks = books.sort((a, b) => {
        return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
    });

    return <BookList title="All Books" books={sortedBooks} />;
}

