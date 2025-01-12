"use client"

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import { Book, Author } from "@/app/api/types";

import RatingStars from "@/components/rating-stars";
import { Button } from "@/components/ui/button";

function BookActions({ className }: { className?: string }) {
    return (
        <div className={twMerge(`flex gap-2`, className || '')}>
            <Button variant={"default"} size={"lg"}>
                Add to wishlist
            </Button>
            <Button variant={"outline"} size={"lg"}>
                Leave a review
            </Button>
        </div>
    )
}

function BookGenres({ genres, className }: { genres: string[], className?: string }) {
    return (
        <div className={twMerge("flex flex-wrap gap-2", className || '')}>
            {genres.map((genre) => (
                <Button asChild variant={"outline"} key={genre} size={"sm"}>
                    <Link href={`/books?genre=${genre}`}>
                        {genre}
                    </Link>
                </Button>
            ))}
        </div>
    )
}

function BookDetails({ book, author }: { book: Book, author?: Author }) {
    const bookDetailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const header = document.querySelector('header');
        const headerHeight = header?.clientHeight;
        if (bookDetailsRef.current) {
            bookDetailsRef.current.style.setProperty('--header-height', `${headerHeight}px`);
        }
    }, [book]);


    return (
        <div className="flex flex-col items-center gap-10 lg:sticky lg:top-[calc(var(--header-height)+10px)]" ref={bookDetailsRef}>
            <div className="flex flex-col items-center gap-5 lg:items-start max-w-sm lg:max-w-none">
                <div className="flex flex-col gap-2 items-center lg:items-start">
                    <div className="flex flex-col gap-2 items-center px-6 py-4 rounded-tl-lg rounded-br-lg rounded-tr-3xl rounded-bl-3xl bg-secondary text-secondary-foreground w-full">
                        <div className="flex flex-col items-center text-center">
                            <h1 className="text-2xl font-serif lg:text-4xl font-bold">
                                {book.title}
                            </h1>
                            {author ? <Link href={`/authors/${author.id}`} className="text-sm lg:text-base text-gray-500 hover:underline">
                                {author.name}
                            </Link> : <p className="text-sm lg:text-base text-gray-500">Unknown Author</p>}
                        </div>
                        {book.rating && <RatingStars rating={book.rating} size="sm" />}
                    </div>
                    {book.genres && <BookGenres genres={book.genres} className="justify-center" />}
                </div>
            </div>
            {book.coverImage && <Image src={book.coverImage} alt={book.title} width={200} height={300} className="rounded-lg" />}
            <BookActions />
        </div>
    )
}

function BookDescription({ book }: { book: Book }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-serif font-bold">Publisher Description</h2>
            <div className="text-lg text-gray-500">{book.description}</div>
        </div>
    )
}

function BookReviews({ book }: { book: Book }) {
    return (
        <div className="flex justify-between gap-4">
            <h2 className="text-2xl font-serif font-bold">Reviews</h2>
            {book.rating ? <RatingStars rating={book.rating} size="md" /> : <div className="text-lg text-gray-500">No reviews yet</div>}
        </div>
    )
}

function BookAuthor({ author }: { author: Author }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-serif font-bold">About {author.name}</h2>
            {author.bio && <div className="text-lg text-gray-500">{author.bio}</div>}
        </div>
    )
}


export {
    BookDetails,
    BookDescription,
    BookReviews,
    BookAuthor
}