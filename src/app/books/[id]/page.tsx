import { getBook, getAuthors } from "@/app/api/utils";
import RatingStars from "@/components/rating-stars";
import Image from "next/image";

export default async function BookPage({ params }: { params: { id: string } }) {

    const book = await getBook(params.id);
    const authors = await getAuthors();

    const author = authors.find((author) => author.id === book.authorId);

    return (
        <div className="container py-6 lg:py-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:px-10">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col items-center gap-5 lg:items-start lg:flex-row lg:gap-10">
                        {book.coverImage && <Image className="hidden lg:block" src={book.coverImage} alt={book.title} width={200} height={300} />}
                        <div className="flex flex-col items-center gap-2 lg:items-start">
                            {book.coverImage && <Image className="lg:hidden" src={book.coverImage} alt={book.title} width={200} height={300} />}
                            <h1 className="text-2xl font-serif lg:text-4xl font-bold">
                                {book.title}
                            </h1>
                            {author ? <a href={`/authors/${author.id}`} className="text-sm lg:text-base text-gray-500">
                                {author.name}
                            </a> : <p className="text-sm lg:text-base text-gray-500">Unknown Author</p>}
                            {book.rating && <RatingStars rating={book.rating} />}
                            <p className="max-w-prose mt-10 lg:mt-10">{book.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
