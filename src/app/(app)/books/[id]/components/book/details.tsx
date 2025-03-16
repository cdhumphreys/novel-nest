'use client';

import StickyBlock from "@/components/sticky-block";
import { Author, Book } from "@/db/schema";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import Link from "next/link";

function BookDetails({
    book,
    author,
    rating,
    children,
}: {
    book: Book;
    author?: Author;
    rating?: number;
    children?: React.ReactNode;
}) {
    return (
        <StickyBlock
            stickyMode="desktop"
            className="flex flex-col items-center gap-10"
        >
            <BookHeader title={book.title} author={author}>
                {rating && (
                    <span className="bg-secondary flex items-center gap-1 text-xs px-2 py-1 rounded-full">
                        <StarIcon
                            className={`w-3 h-3 text-transparent fill-primary`}
                        />
                        {rating.toFixed(1)}
                    </span>
                )}
            </BookHeader>

            {book.coverImageUrl ? (
                <Image
                    src={book.coverImageUrl}
                    alt={book.title}
                    width={200}
                    height={300}
                    className="rounded-lg mx-auto"
                    priority
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
            {children}
        </StickyBlock>
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
        <div className="flex flex-col gap-1 items-start w-full">
            {children}
            <h1 className="text-2xl font-serif lg:text-4xl">{title}</h1>
            {author ? (
                <Link
                    href={`/authors/${author.id}`}
                    className="text-xs lg:text-base text-foreground/50 hover:underline"
                >
                    {author.name}
                </Link>
            ) : (
                <p className="text-xs lg:text-base text-gray-500">
                    Unknown Author
                </p>
            )}
        </div>
    );
}

export default BookDetails;