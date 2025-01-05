"use client";

import Link from "next/link";

import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bars3Icon } from "@heroicons/react/16/solid";

export default function Header() {
    return (
        <header>
            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center gap-5">
                    <div className="text-xl font-bold">NovelNest</div>
                    <div className="lg:hidden flex">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Bars3Icon className="h-6 w-6" />
                                <span className="sr-only">Open Menu</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem><Button className="grow">Primary CTA</Button></DropdownMenuItem>
                                <DropdownMenuItem><Button className="grow" type="button" variant={"secondary"}>Secondary CTA</Button></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="hidden lg:flex items-center gap-5">
                        <Button>Primary CTA</Button>
                        <Button type="button" variant={"secondary"}>Secondary CTA</Button>
                    </div>
                </div>
            </div>
        </header>
    );
}