"use client"

import type { ButtonVariant } from "./ui/button";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = ({ variant = "ghost" }: { variant?: ButtonVariant }) => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [showToggle, setShowToggle] = useState(false);

    useEffect(() => {
        setShowToggle(true);
    }, []);

    return (
        <>
            {showToggle && (
                <div className="flex justify-center grow">
                    {resolvedTheme === "light" ? (
                        <Button variant={variant} onClick={() => setTheme("dark")}>
                            <span className="sr-only">Dark Mode</span>
                            <Moon className="h-6 w-6" />
                        </Button>)
                        :
                        (<Button variant={variant} onClick={() => setTheme("light")}>
                            <span className="sr-only">Light Mode</span>
                            <Sun className="h-6 w-6 text-yellow-500" />
                        </Button>)
                    }
                </div>
            )}
        </>
    )
}

export default ThemeToggle;