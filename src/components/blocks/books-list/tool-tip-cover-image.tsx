import Image from "next/image";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../../ui/button";
import { EyeIcon } from "lucide-react";

import type { Book } from "@/lib/types";

export default function TooltipCoverImage({ book }: { book: Book }) {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger
                    asChild
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <Button variant="outline">
                        <EyeIcon className="w-4 h-4" />
                        <div className="sr-only">See cover</div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <Image
                        src={book.coverImage!}
                        width={200}
                        height={300}
                        alt={book.title}
                    />
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};