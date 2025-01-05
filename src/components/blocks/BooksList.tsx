import Image from "next/image";
import Link from "next/link";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { EyeIcon, SearchX, StarHalfIcon, StarIcon } from "lucide-react";
import { Button } from "../ui/button";

interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    rating: number;
    coverImage?: string;

}

const books: Book[] = [
    {
        id: 1,
        title: "The Midnight Library",
        author: "Matt Haig",
        description: "Between life and death there is a library, and within that library, the shelves go on forever.",
        rating: 4.2
    },
    {
        id: 2,
        title: "Project Hail Mary",
        author: "Andy Weir",
        description: "A lone astronaut must save humanity from a catastrophic extinction event.",
        rating: 4.8
    },
    {
        id: 3,
        title: "Tomorrow, and Tomorrow, and Tomorrow",
        author: "Gabrielle Zevin",
        description: "A story about friendship, art, love, and video games spanning thirty years.",
        rating: 3.5
    },
    {
        id: 4,
        title: "Lessons in Chemistry",
        author: "Bonnie Garmus",
        description: "A chemist becomes a cooking show host in the 1960s and teaches women to challenge the status quo.",
        rating: 4.6
    },
    {
        id: 5,
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        description: "A reclusive Hollywood icon reveals her life story to an unknown journalist, exploring fame, ambition, and forbidden love.",
        rating: 4.5,
        coverImage: "https://picsum.photos/200/300?random=2"
    },
    {
        id: 6,
        title: "Sea of Tranquility",
        author: "Emily St. John Mandel",
        description: "A time travel narrative connecting characters across centuries, from the Canadian wilderness to lunar colonies.",
        rating: 3.8
    },
    {
        id: 7,
        title: "Cloud Cuckoo Land",
        author: "Anthony Doerr",
        description: "An ambitious novel weaving together multiple storylines across centuries, connected by an ancient text.",
        rating: 4.3
    },
    {
        id: 8,
        title: "The Diamond Eye",
        author: "Kate Quinn",
        description: "Based on a true story of a librarian who becomes one of the most successful snipers in World War II.",
        rating: 2.9,
        coverImage: "https://picsum.photos/200/300"
    }
];

const TooltipCoverImage = ({ book }: { book: Book }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">
                        <EyeIcon className="w-4 h-4" />
                        <div className="sr-only">See cover</div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <Image src={book.coverImage!} width={200} height={300} alt={book.title} />
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
// const books: Book[] = [];
export default function BookList() {
    return (
        <div className="container py-6 flex flex-col gap-8">
            <h2 className="text-2xl font-bold font-serif lg:text-4xl">Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5">
                {books.length > 0 ? books.map((book) => {
                    return (
                        <Card key={book.id}>
                            <CardHeader>
                                <CardTitle className="flex justify-between gap-5">
                                    <span className="font-serif">{book.title}</span>
                                    {book.coverImage && <TooltipCoverImage book={book} />}
                                </CardTitle>
                                <CardDescription>{book.author}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{book.description}</p>
                            </CardContent>
                            <CardFooter>
                                <div className="flex flex-col items-center gap-1">
                                    <p>Average rating: </p>
                                    <div className="flex items-center gap-1">
                                        {[...Array(Math.floor(book.rating))].map((_, i) => (
                                            <StarIcon key={i} className="w-4 h-4 fill-current" />
                                        ))}
                                        {book.rating % 1 >= 0 && (
                                            <StarHalfIcon className="w-4 h-4 fill-current" />
                                        )}
                                        {[...Array(5 - Math.ceil(book.rating))].map((_, i) => (
                                            <StarIcon key={i} className="w-4 h-4 text-muted-foreground/25" />
                                        ))}
                                        <span>{book.rating}</span>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    )
                }) : (<span className="p-6 text-xl bg-accent text-accent-foreground rounded-lg flex items-center gap-2"><SearchX className="w-8 h-8" /> No books found </span>)}
            </div>
        </div>
    )
};