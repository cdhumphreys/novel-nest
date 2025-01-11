import { Book, Author } from "@/app/api/types";
import { getBook, getAuthors } from "@/app/api/utils";
import RatingStars from "@/components/rating-stars";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import { twMerge } from "tailwind-merge";

function BookActions({ className }: { className?: string }) {
    return (
        <div className={twMerge(`flex flex-col gap-2`, className || '')}>
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
                <Button asChild variant={"secondary"}>
                    <Link href={`/books?genre=${genre}`} key={genre} >
                        {genre}
                    </Link>
                </Button>
            ))}
        </div>
    )
}

function BookDetails({ book, author }: { book: Book, author?: Author }) {
    return (
        <div className="flex flex-col items-center gap-5 lg:items-start lg:flex-row lg:gap-10 lg:px-10 py-10">
            <div className="flex-col sticky top-5 hidden lg:flex gap-10">
                {book.coverImage && <Image src={book.coverImage} alt={book.title} width={200} height={300} />}
                <BookActions />
            </div>
            <div className="flex flex-col items-center gap-5 lg:items-start">
                {book.coverImage && <Image className="lg:hidden" src={book.coverImage} alt={book.title} width={200} height={300} />}
                <div className="flex flex-col gap-4 items-center lg:items-start">
                    <h1 className="text-2xl font-serif lg:text-4xl font-bold lg:pt-5">
                        {book.title}
                    </h1>
                    {book.genres && <BookGenres genres={book.genres} className="justify-center lg:justify-start" />}
                    {author ? <a href={`/authors/${author.id}`} className="text-sm lg:text-base text-gray-500 hover:underline">
                        {author.name}
                    </a> : <p className="text-sm lg:text-base text-gray-500">Unknown Author</p>}
                    {book.rating && <RatingStars rating={book.rating} size="md" />}
                </div>
                <BookActions className="lg:hidden mt-5" />
                <div className="max-w-prose mt-10 lg:mt-10">
                    <p>
                        {book.description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default async function BookPage({ params }: { params: { id: string } }) {

    const book = await getBook(params.id);
    const authors = await getAuthors();

    const author = authors.find((author) => author.id === book.authorId);

    return (
        <div className="container lg:py-12">
            <BookDetails book={book} author={author} />
        </div>
    );
}
