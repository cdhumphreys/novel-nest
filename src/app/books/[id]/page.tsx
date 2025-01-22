import {
    BookDetails,
    BookDescription,
    BookReviews,
    BookAuthor,
} from "@/components/pages/book";
import { getBook } from "@/server/actions/books";
import { getAuthor } from "@/server/actions/authors";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getReviewsByBookId } from "@/server/actions/reviews";

function BookNotFound() {
    return (
        <div className="container pt-10 pb-20 flex flex-col gap-10 lg:grid lg:grid-cols-[400px_1fr] lg:gap-10">
            <div className="lg:col-span-full flex flex-col gap-5 items-start">
                <div className="flex flex-col">
                    <div className="text-2xl font-bold">Book not found</div>
                    <p>The book you are looking for does not exist.</p>
                </div>
                <Button asChild>
                    <Link href="/books">Go to all books</Link>
                </Button>
            </div>
        </div>
    );
}

export default async function BookPage({ params }: { params: { id: string } }) {
    const { data: book, error: bookError } = await getBook(params.id);

    if (!book || !book.authorId) {
        return <BookNotFound />;
    }

    const { data: reviews, error: reviewsError } = await getReviewsByBookId(
        book.id
    );

    const { data: author, error: authorsError } = await getAuthor(
        book.authorId
    );
    const rating =
        reviews.length > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) /
              reviews.length
            : undefined;

    return (
        <div className="container pt-10 pb-20 flex flex-col gap-10 lg:grid lg:grid-cols-[400px_minmax(0,60ch)] lg:gap-10 lg:mx-auto lg:w-fit">
            <div className="lg:sticky lg:top-10">
                <BookDetails
                    book={book}
                    author={author || undefined}
                    rating={rating}
                />
            </div>
            <div className="flex flex-col gap-10">
                <BookDescription book={book} />
                <hr />
                <BookReviews reviews={reviews} />
                <hr />
                {author && <BookAuthor author={author} />}
            </div>
        </div>
    );
}
