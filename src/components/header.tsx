"use client";

import Link from "next/link";
import type { ButtonVariant } from "./ui/button";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { CircleUser, LibraryBig, BookOpen, BookUser, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import ThemeToggle from "./ThemeToggle";


const NavButton = ({
    text,
    href,
    icon: Icon,
    className,
    variant,
}: {
    text?: string;
    href: string;
    variant?: ButtonVariant;
    icon: React.ElementType;
    className?: string;
}) => {
    return (
        <Button
            type="button"
            variant={variant}
            className={cn(className, "[&_svg]:size-5")}
            asChild
        >
            <Link href={href}>
                <Icon />
                {text && <span>{text}</span>}
            </Link>
        </Button>
    );
};


const MobileMenu = () => {
    return (
        <div className="lg:hidden flex">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Bars3Icon className="h-6 w-6" />
                    <span className="sr-only">Open Menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent collisionPadding={10}>
                    <DropdownMenuItem>
                        <NavButton
                            href="/books"
                            text="Books"
                            icon={BookOpen}
                            variant="link"
                            className="grow justify-start"
                        />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <NavButton
                            href="/authors"
                            text="Authors"
                            icon={BookUser}
                            variant="link"
                            className="grow justify-start"
                        />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <NavButton
                            href="/my-profile"
                            text="My Profile"
                            icon={CircleUser}
                            className="grow justify-start"
                            variant="secondary"
                        />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <NavButton
                            href="/my-library"
                            text="My Library"
                            icon={LibraryBig}
                            className="grow justify-start"
                            variant="secondary"
                        />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
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
                    <div className="flex items-center gap-5 lg:hidden">
                        <ThemeToggle variant="outline" />
                        <MobileMenu />
                    </div>
                    {/* Spacer */}
                    <div className="hidden lg:flex flex-[2]"></div>
                    <div className="hidden lg:flex gap-4">
                        <NavButton
                            href="/books"
                            text="Books"
                            icon={BookOpen}
                            variant="link"
                            className="w-full justify-start"
                        />
                        <NavButton
                            href="/authors"
                            text="Authors"
                            icon={BookUser}
                            className="w-full justify-start"
                            variant="link"
                        />
                    </div>
                    {/* Spacer */}
                    <div className="hidden lg:flex flex-[1]"></div>
                    <div className="hidden lg:flex items-center gap-5">
                        <NavButton
                            href="/my-library"
                            text="My Library"
                            icon={LibraryBig}
                            className="grow justify-start"
                            variant="secondary"

                        />
                        <NavButton
                            href="/my-profile"
                            text="My Profile"
                            icon={CircleUser}
                            className="grow justify-start"
                            variant="secondary"

                        />
                        <ThemeToggle variant="outline" />
                    </div>
                </div>
            </div>
        </header>
    );
}
