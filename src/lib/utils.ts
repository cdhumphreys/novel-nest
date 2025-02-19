
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getHumanReadableDate(date: Date) {
    return date.toLocaleDateString("en-GB", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}
