import { Book } from "@/db/schema";

function BookDescription({ book }: { book: Book }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-serif">Publisher Description</h2>
            <div className="text-foreground">{book.description}</div>
        </div>
    );
}

export default BookDescription;