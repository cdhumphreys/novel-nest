"use client";

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
import { useEffect, useRef, useState } from "react";

const TooltipCoverImage = ({ book }: { book: Book }) => {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}>
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

function BookCard({ book }: { book: Book }) {
    const [isHovered, setIsHovered] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const cardWrapperRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);


    function handleMouseEnter() {
        setIsHovered(true);
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
    }

    function handleMouseLeave() {
        setIsHovered(false);
        if (cardRef.current) {
            cardRef.current.style.transition = '';

            cardRef.current.style.setProperty('--rotation-x', `0deg`);
            cardRef.current.style.setProperty('--rotation-y', `0deg`);

            cardRef.current.style.setProperty('--shadow-x', `0px`);
            cardRef.current.style.setProperty('--shadow-y', `0px`);
        }
    }

    useEffect(() => {
        if (cardWrapperRef.current) {
            const wrapperRef = cardWrapperRef.current;

            // Include in useEffect to update with state changes
            const handleMouseMove = (e: MouseEvent) => {
                if (!cardRef.current || !isHovered || prefersReducedMotion) return;

                // Constants
                const MAX_ROTATION_X = 10;
                const MAX_ROTATION_Y = 10;
                const MAX_SHADOW_X = 10;
                const MAX_SHADOW_Y = 10;

                const rect = wrapperRef.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;


                const ratioX = x / rect.width * 2;
                const ratioY = y / rect.height * 2;

                const rotationX = Math.min(Math.max(ratioY * MAX_ROTATION_X, -MAX_ROTATION_X), MAX_ROTATION_X);
                const rotationY = Math.min(Math.max(ratioX * MAX_ROTATION_Y, -MAX_ROTATION_Y), MAX_ROTATION_Y);

                const shadowX = (ratioX * MAX_SHADOW_X);
                const shadowY = (ratioY * MAX_SHADOW_Y);

                // Rotate the card in opposite direction of mouse movement
                cardRef.current.style.setProperty('--rotation-x', `${-rotationX}deg`);
                cardRef.current.style.setProperty('--rotation-y', `${rotationY}deg`);

                // Add shadow to the card in opposite direction of mouse movement
                cardRef.current.style.setProperty('--shadow-x', `${shadowX}px`);
                cardRef.current.style.setProperty('--shadow-y', `${shadowY}px`);
            };

            wrapperRef.addEventListener('mouseenter', handleMouseEnter);
            wrapperRef.addEventListener('mouseleave', handleMouseLeave);
            wrapperRef.addEventListener('mousemove', handleMouseMove);

            return () => {
                wrapperRef.removeEventListener('mouseenter', handleMouseEnter);
                wrapperRef.removeEventListener('mouseleave', handleMouseLeave);
                wrapperRef.removeEventListener('mousemove', handleMouseMove);
            }
        }
    }, [isHovered, prefersReducedMotion]);

    useEffect(() => {
        const userPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(userPrefersReducedMotion.matches);
    }, []);

    return (
        <div ref={cardWrapperRef} className="book-list-card-wrapper w-full flex hover:z-10">
            <Card ref={cardRef} key={book.id} className="book-list-card w-full flex flex-col hover:border-slate-300">
                <CardHeader>
                    <div className="flex justify-between items-center gap-2">
                        <div className="flex flex-col gap-2">
                            <CardTitle>
                                <span className="font-serif">
                                    {book.title}
                                </span>
                            </CardTitle>
                            <CardDescription>
                                {book.author || 'Unknown author'}
                            </CardDescription>
                        </div>
                        {book.coverImage && (
                            <TooltipCoverImage
                                book={book}
                            />
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {book.rating && getRatingStars(book.rating)}
                        <span>{book.rating || 'No ratings yet'}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{book.description || 'No description available'}</p>
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
        </div>
    );
}

export default function BookList({
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
                                <BookCard book={book} />
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
