"use client";


import Link from "next/link";

import BookCard from "./books-list/book-card";


import { SearchX } from "lucide-react";

import type { Book, Author, Review } from "@/lib/types";


export default function BookList({
    title,
    books = [],
    authors = [],
    reviews = [],
    children,
}: {
    title: string;
    books?: Book[];
    authors?: Author[];
    reviews?: Review[];
    children?: React.ReactNode;
}) {
    const booksWithAuthorsAndRatings = books.map((book) => {
        const relevantReviews = reviews.filter(
            (review) => review.bookId === book.id
        );
        return {
            book,
            author: authors.find((author) => author.id === book.authorId),
            rating:
                relevantReviews.length > 0
                    ? relevantReviews.reduce(
                        (acc, review) => acc + review.rating,
                        0
                    ) / relevantReviews.length
                    : undefined,
        };
    });
    return (
        <div className="flex flex-col gap-5 py-8 lg:py-10">
            <div className="pb-6 flex flex-col gap-8">
                <div className="flex justify-between gap-5 items-center">
                    <h2 className="text-2xl font-bold font-serif lg:text-4xl">
                        {title}
                    </h2>
                    {children}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5">
                {booksWithAuthorsAndRatings.length > 0 ? (
                    booksWithAuthorsAndRatings.map(
                        ({ book, author, rating }) => {
                            return (
                                <Link
                                    href={`/books/${book.id}`}
                                    key={book.id}
                                    className="flex"
                                >
                                    <BookCard
                                        book={book}
                                        author={author}
                                        rating={
                                            reviews.length > 0
                                                ? rating
                                                : undefined
                                        }
                                    />
                                </Link>
                            );
                        }
                    )
                ) : (
                    <span className="p-6 text-xl bg-accent text-accent-foreground rounded-lg flex items-center gap-2">
                        <SearchX className="w-8 h-8" />
                        No books found
                    </span>
                )}
            </div>
        </div>
    );
}
