import type { Book } from "@/app/api/books/data";
import Image from "next/image";

export default async function BookPage({ params }: { params: { id: string } }) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/books/${params.id}`
    );
    const { data: book }: { data: Book } = await res.json();
    return (
        <div className="container py-6 lg:py-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:w-2/3 lg:mx-auto">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-serif lg:text-4xl font-bold">
                            {book.title}
                        </h1>
                        <p className="text-sm lg:text-base text-gray-500">
                            {book.author}
                        </p>
                    </div>
                    <p className="max-w-prose">{book.description}</p>
                </div>
                {book.coverImage && (
                    <div className="flex">
                        <Image
                            src={book.coverImage}
                            alt={book.title}
                            width={300}
                            height={400}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
