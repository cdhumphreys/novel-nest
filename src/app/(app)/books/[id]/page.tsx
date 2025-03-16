import {
    BookDetails,
    BookDescription,
    BookReviews,
    BookAuthor,
    BookActions,
} from "./components/book";
import { getBookById } from "@/data-access/books";
import { getAuthorById } from "@/data-access/authors";
import { getReviewsByBookIdWithCommentsAndProfiles } from "@/data-access/reviews";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { getCurrentProfile } from "@/lib/sessions";
import { getFavouritesByProfileId } from "@/data-access/profiles";
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
    const book = await getBookById(Number(params.id));

    if (!book || !book.authorId) {
        return <BookNotFound />;
    }

    const reviews = await getReviewsByBookIdWithCommentsAndProfiles(book.id);
    const author = await getAuthorById(book.authorId);

    let isFavourite = false;

    const profile = await getCurrentProfile();
    if (profile) {
        const favourites = await getFavouritesByProfileId(profile?.id);
        isFavourite = favourites.some((favourite) => favourite.id === book.id);

    }


    const rating =
        reviews.length > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviews.length
            : undefined;

    return (
        <div className="container pt-10 pb-20">
            <div className="max-w-96 lg:max-w-none mx-auto flex flex-col gap-10 lg:grid lg:grid-cols-[400px_minmax(0,60ch)] lg:gap-10 lg:w-fit">
                <div className="lg:sticky lg:top-10">
                    <BookDetails
                        book={book}
                        author={author}
                        rating={rating}
                    >
                        <BookActions bookId={book.id} isFavourite={isFavourite} />
                    </BookDetails>
                </div>
                <div className="flex flex-col gap-10">
                    <BookDescription book={book} />
                    <hr />
                    <BookReviews reviews={reviews} />
                    <hr />
                    {author && <BookAuthor author={author} />}
                </div>
            </div>
        </div>
    );
}
