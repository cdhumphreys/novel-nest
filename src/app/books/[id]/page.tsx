import {
    BookDetails,
    BookDescription,
    BookReviews,
    BookAuthor
} from "@/components/pages/book";
import { getBook, getAuthors } from "@/app/api/utils";



export default async function BookPage({ params }: { params: { id: string } }) {

    const book = await getBook(params.id);
    const authors = await getAuthors();

    const author = authors.find((author) => author.id === book.authorId);


    return (
        <div className="container pt-10 pb-20 flex flex-col gap-10 lg:grid lg:grid-cols-[400px_1fr] lg:gap-10">
            <div className="lg:sticky lg:top-10">
                <BookDetails book={book} author={author} />
            </div>
            <div className="flex flex-col gap-10 max-w-[60ch] mx-auto lg:max-0 lg:max-w-none">
                <BookDescription book={book} />
                <hr />
                <BookReviews book={book} />
                <hr />
                {author && <BookAuthor author={author} />}

            </div>
        </div>
    );
}

