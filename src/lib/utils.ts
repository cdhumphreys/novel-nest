
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getHumanReadableDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
        Object.setPrototypeOf(this, AuthenticationError.prototype)
    }
}

export class AuthorisationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthorisationError';
        Object.setPrototypeOf(this, AuthorisationError.prototype)
    }
}

