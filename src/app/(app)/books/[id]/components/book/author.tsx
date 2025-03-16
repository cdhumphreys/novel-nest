import { Button } from "@/components/ui/button";
import { Author } from "@/db/schema";
import Link from "next/link";

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

export default BookAuthor;