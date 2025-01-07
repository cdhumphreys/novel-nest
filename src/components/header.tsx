"use client";

import Link from "next/link";

import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bars3Icon, UserCircleIcon } from "@heroicons/react/16/solid";
import { CircleUser, LibraryBig } from "lucide-react";
import { cn } from "@/lib/utils";

const ProfileButton = ({
    text,
    className,
}: {
    text?: string;
    className?: string;
}) => {
    return (
        <Button
            type="button"
            variant="secondary"
            className={cn(className, "[&_svg]:size-5")}
            asChild
        >
            <Link href="/profile" aria-label={text}>
                <CircleUser />
                <span className="lg:hidden">{text}</span>
            </Link>
        </Button>
    );
};

const LibraryButton = ({
    text,
    className,
}: {
    text?: string;
    className?: string;
}) => {
    return (
        <Button
            type="button"
            variant="default"
            className={cn(className, "[&_svg]:size-5")}
            asChild
        >
            <Link href="/my-library" aria-label={text}>
                <LibraryBig />
                <span className="lg:hidden">{text}</span>
            </Link>
        </Button>
    );
};

export default function Header() {
    return (
        <header>
            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center gap-5">
                    <Link
                        href="/"
                        className="text-xl font-bold"
                        aria-label="Home"
                    >
                        NovelNest
                    </Link>
                    <div className="lg:hidden flex">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Bars3Icon className="h-6 w-6" />
                                <span className="sr-only">Open Menu</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <ProfileButton
                                        className="grow justify-start"
                                        text="My Profile"
                                    />
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <LibraryButton
                                        className="grow justify-start"
                                        text="My Library"
                                    />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="hidden lg:flex items-center gap-5">
                        <LibraryButton text="My Library" />
                        <ProfileButton text="Profile" />
                    </div>
                </div>
            </div>
        </header>
    );
}
