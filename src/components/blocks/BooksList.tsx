import Image from "next/image";
import Link from "next/link";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { EyeIcon, SearchX, StarHalfIcon, StarIcon } from "lucide-react";
import { Button } from "../ui/button";

import type { Book } from "@/app/api/books/data";
import { getHumanReadableDate } from "@/lib/utils";

const TooltipCoverImage = ({ book }: { book: Book }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">
                        <EyeIcon className="w-4 h-4" />
                        <div className="sr-only">See cover</div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <Image
                        src={book.coverImage!}
                        width={200}
                        height={300}
                        alt={book.title}
                    />
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

function getRatingStars(rating: number) {
    return (
        <>
            {[...Array(Math.floor(rating))].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 fill-current" />
            ))}
            {rating % 1 >= 0 && (
                <StarHalfIcon className="w-4 h-4 fill-current" />
            )}
            {[...Array(5 - Math.ceil(rating))].map((_, i) => (
                <StarIcon
                    key={i}
                    className="w-4 h-4 text-muted-foreground/25"
                />
            ))}
        </>
    );
}

export default async function BookList({
    title,
    books = [],
    children,
}: {
    title: string;
    books?: Book[];
    children?: React.ReactNode;
}) {
    return (
        <div className="container py-6 flex flex-col gap-8">
            <div className="flex justify-between gap-5 items-center">
                <h2 className="text-2xl font-bold font-serif lg:text-4xl">
                    {title}
                </h2>
                {children}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5">
                {books.length > 0 ? (
                    books.map((book) => {
                        return (
                            <Link
                                href={`/books/${book.id}`}
                                key={book.id}
                                className="flex"
                            >
                                <Card key={book.id} className="flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-center gap-2">
                                            <div className="flex flex-col gap-2">
                                                <CardTitle>
                                                    <span className="font-serif">
                                                        {book.title}
                                                    </span>
                                                </CardTitle>
                                                <CardDescription>
                                                    {book.author}
                                                </CardDescription>
                                            </div>
                                            {book.coverImage && (
                                                <TooltipCoverImage
                                                    book={book}
                                                />
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {getRatingStars(book.rating)}
                                            <span>{book.rating}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{book.description}</p>
                                    </CardContent>
                                    <CardFooter className="mt-auto">
                                        <div className="grow flex flex-col gap-6">
                                            <div className="flex justify-end">
                                                <p className="text-xs text-muted-foreground">
                                                    Added on:{" "}
                                                    {getHumanReadableDate(
                                                        book.dateAdded
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        );
                    })
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
