import { StarHalfIcon, StarIcon } from "lucide-react";

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
export default function RatingStars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {rating && getRatingStars(rating)}
            <span>{rating || 'No ratings yet'}</span>
        </div>
    );
}