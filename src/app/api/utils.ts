import { Author, Book } from "./types";

export const getBooks = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/books`);
    const { data: books }: { data: Book[] } = await res.json();
    return books;
}

export const getAuthors = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/authors`);
    const { data: authors }: { data: Author[] } = await res.json();
    return authors;
}

export const getBook = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/books/${id}`);
    const { data: book }: { data: Book } = await res.json();
    return book;
}

export const getAuthor = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/authors/${id}`);
    const { data: author }: { data: Author } = await res.json();
    return author;
}