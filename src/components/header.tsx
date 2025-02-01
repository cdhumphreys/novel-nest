"use client";

import Link from "next/link";
import { Menu, CircleUser, LibraryBig, BookOpen, LogIn, LogOut } from "lucide-react";

import ThemeToggle from "./theme-toggle";

import type { ButtonVariant } from "./ui/button";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/authentication/utils";

// import Register from "./register-form";
// import { Dialog } from "@/components/ui/dialog";

const loggedIn = getCurrentUser();

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
                    <Menu className="h-6 w-6" />
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
                    <DropdownMenuSeparator />
                    {loggedIn ? (
                        <>
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
                            <DropdownMenuItem>
                                <NavButton
                                    href="/logout"
                                    text="Logout"
                                    icon={LogOut}
                                    className="grow justify-start"
                                    variant="secondary"
                                />
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuItem>
                                <NavButton
                                    href="/login"
                                    text="Login"
                                    icon={LogIn}
                                    className="grow justify-start"
                                    variant="secondary"
                                />
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <NavButton
                                    href="/register"
                                    text="Register"
                                    icon={CircleUser}
                                    className="grow justify-start"
                                    variant="default"
                                />
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-background">
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
                    </div>
                    {/* Spacer */}
                    <div className="hidden lg:flex flex-[1]"></div>
                    <div className="hidden lg:flex items-center gap-5">
                        {loggedIn ? (
                            <>
                                <NavButton
                                    href="/my-library"
                                    text="My Library"
                                    icon={LibraryBig}
                                    className="grow justify-start"
                                    variant="secondary"

                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="grow justify-start"
                                    asChild
                                >
                                    <Link href="/my-profile">
                                        <span className="sr-only">Profile</span>
                                        <CircleUser />
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <NavButton
                                    href="/login"
                                    text="Login"
                                    icon={LogIn}
                                    className="grow justify-start"
                                    variant="secondary"
                                />
                                <NavButton
                                    href="/register"
                                    text="Register"
                                    icon={CircleUser}
                                    className="grow justify-start"
                                    variant="default"
                                />
                            </>
                        )}
                        <ThemeToggle variant="outline" />
                    </div>
                </div>
            </div>
        </header>
    );
}
