'use client';

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

interface SignOutProps {
    onClick: () => Promise<void>;
}

export function SignOut({ onClick }: SignOutProps) {
    return (
        <Button variant="ghost" size="icon" onClick={() => onClick()}>
            <LogOut className="h-5 w-5" />
            <span className="lg:sr-only">Sign out</span>
        </Button>
    );
}