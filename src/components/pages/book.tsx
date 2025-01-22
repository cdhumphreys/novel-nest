"use client";

import Link from "next/link";
import Image from "next/image";

import { Book, Author, Review } from "@/lib/types";

import RatingStars from "@/components/rating-stars";
import { Button } from "@/components/ui/button";
import StickyBlock from "../sticky-block";
import { getHumanReadableDate } from "@/lib/utils";

import { ImageOff, StarIcon } from "lucide-react";

import Avatar from "boring-avatars";

function BookActions() {
    return (
        <div className="flex gap-2">
            <Button variant={"default"} size={"lg"}>
                Add to wishlist
            </Button>
            <Button variant={"outline"} size={"lg"}>
                Leave a review
            </Button>
        </div>
    );
}

function BookHeader({
    title,
    author,
    children,
}: {
    title: string;
    author?: Author;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2 items-center px-6 py-4 rounded-tl-lg rounded-br-lg rounded-tr-3xl rounded-bl-3xl bg-secondary text-secondary-foreground w-full">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-serif lg:text-4xl font-bold">
                    {title}
                </h1>
                {author ? (
                    <Link
                        href={`/authors/${author.id}`}
                        className="text-sm lg:text-base text-foreground/50 hover:underline"
                    >
                        {author.name}
                    </Link>
                ) : (
                    <p className="text-sm lg:text-base text-gray-500">
                        Unknown Author
                    </p>
                )}
            </div>
            {children}
        </div>
    );
}

function BookDetails({
    book,
    author,
    rating,
}: {
    book: Book;
    author?: Author;
    rating?: number;
}) {
    return (
        <StickyBlock
            stickyMode="desktop"
            className="flex flex-col items-center gap-10"
        >
            <div className="flex flex-col gap-2 items-center lg:items-start">
                <BookHeader title={book.title} author={author}>
                    {rating && (
                        <span className="flex items-center gap-1 text-xs">
                            <StarIcon
                                className={`w-3 h-3 text-transparent fill-`}
                            />
                            {rating.toFixed(1)}
                        </span>
                    )}
                </BookHeader>
            </div>
            {book.coverImage ? (
                <Image
                    src={book.coverImage}
                    alt={book.title}
                    width={200}
                    height={300}
                    className="rounded-lg"
                />
            ) : (
                <div className="relative rounded-lg bg-secondary flex items-center justify-center aspect-[2/3] w-[200px]">
                    <ImageOff
                        size={80}
                        className="text-gray-500/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                    <p className="text-lg font-bold text-gray-500 text-center">
                        No cover image available
                    </p>
                </div>
            )}
            <BookActions />
        </StickyBlock>
    );
}

function BookDescription({ book }: { book: Book }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-serif">Publisher Description</h2>
            <div className="text-foreground">{book.description}</div>
        </div>
    );
}

function BookReviews({ reviews }: { reviews: Review[] }) {
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) /
              reviews.length
            : 0;
    return (
        <div className="flex flex-col gap-5">
            <div className="flex justify-between gap-4">
                <h2 className="text-lg font-serif">
                    {reviews.length} Review
                    {reviews.length > 1 || reviews.length === 0 ? "s" : ""}
                </h2>
                {reviews.length > 0 ? (
                    <span className="flex items-center gap-2 text-foreground/50">
                        <RatingStars rating={averageRating} size="md" />
                        {averageRating.toFixed(1)}{" "}
                    </span>
                ) : (
                    <div className="text-lg text-gray-500">No reviews yet</div>
                )}
            </div>
            <div className="flex flex-col gap-5">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="last:border-b-0 border-b border-primary/10 pb-5 last:pb-0"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        name={review.userId}
                                        size={32}
                                        variant="beam"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold font-serif">
                                            {review.userId}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {getHumanReadableDate(
                                                review.datePosted
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-secondary p-4 flex flex-col gap-2">
                                    <RatingStars
                                        rating={review.rating}
                                        size="sm"
                                    />
                                    <div className="text-secondary-foreground">
                                        <p>{review.comment}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-lg text-gray-500">No reviews yet</div>
                )}
            </div>
        </div>
    );
}

function BookAuthor({ author }: { author: Author }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-serif">About {author.name}</h2>
            {author.bio ? (
                <div className="text-foreground">{author.bio}</div>
            ) : (
                <div className="text-foreground/50">No bio available</div>
            )}
            <div className="flex justify-start mt-6">
                <Button asChild variant={"outline"} size={"lg"}>
                    <Link href={`/authors/${author.id}`}>View profile</Link>
                </Button>
            </div>
        </div>
    );
}

export { BookDetails, BookDescription, BookReviews, BookAuthor };
