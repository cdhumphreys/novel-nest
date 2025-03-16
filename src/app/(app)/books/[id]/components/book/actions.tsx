'use client';
import { useSession } from "@/hooks/use-session";
import { toggleFavouritesAction } from "@/server/actions/profile";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, HeartOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormDialog } from "../form-dialog";
import { ReviewForm } from "../review-form";

function BookActions({ bookId, isFavourite }: { bookId: number, isFavourite: boolean }) {
    const session = useSession();
    const [showReviewForm, setShowReviewForm] = useState(false);
    const router = useRouter();

    async function handleToggleFavourites() {
        console.log("add to favourites");
        const result = await toggleFavouritesAction(bookId);
        if (result.success) {
            router.refresh();
            toast.success(isFavourite ? "Removed from favourites" : "Added to favourites");
        } else {
            toast.error(result.errors?.root || "Failed to add to favourites", {
                style: {
                    background: "hsl(var(--destructive))",
                    color: "hsl(var(--destructive-foreground))",
                }
            });
        }
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            {session?.user ? (
                <>
                    <Button
                        variant={isFavourite ? "outline" : "default"}
                        size={"lg"}
                        className="sm:flex-1"
                        onClick={handleToggleFavourites}
                    >
                        {isFavourite ? "Remove from favourites" : "Add to favourites"}
                        {isFavourite ? <HeartOffIcon /> : <HeartIcon />}
                    </Button>
                    <Button
                        variant={"outline"}
                        size={"lg"}
                        className="sm:flex-1"
                        onClick={() => setShowReviewForm(true)}
                    >
                        Leave a review
                    </Button>
                </>
            ) : (
                <Button variant={"outline"} size={"lg"} asChild>
                    <Link href="/login">Login to leave a review</Link>
                </Button>
            )}
            <FormDialog show={showReviewForm} setShow={setShowReviewForm} title="Leave a review" description="Leave a review for this book" children={<ReviewForm bookId={bookId} onClose={() => setShowReviewForm(false)} />} />
        </div>
    );
}

export default BookActions;