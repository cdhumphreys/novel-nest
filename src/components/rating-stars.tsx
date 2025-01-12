import { StarHalfIcon, StarIcon } from "lucide-react";

function getRatingStars(rating: number) {
    return (
        <>

        </>
    );
}
export default function RatingStars({ rating, size = 'sm' }: { rating: number, size?: 'sm' | 'md' }) {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

    const textSizeClass = size === 'sm' ? 'text-base' : 'text-lg';
    return (
        <div className="flex items-center gap-1">
            {rating && (
                <>
                    {[...Array(Math.floor(rating))].map((_, i) => (
                        <StarIcon key={i} className={`${sizeClass} text-transparent fill-yellow-500`} />
                    ))}
                    {[...Array(5 - Math.floor(rating))].map((_, i) => (
                        <StarIcon
                            key={i}
                            className={`${sizeClass} fill-black text-muted-foreground/25`}
                        />
                    ))}
                </>
            )}
            <span className={textSizeClass}>{rating || 'No ratings yet'}</span>
        </div>
    );
}