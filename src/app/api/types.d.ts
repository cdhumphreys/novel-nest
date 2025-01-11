export type Book = {
    id: string;
    title: string;
    authorId?: string;
    description?: string;
    rating?: number;
    coverImage?: string;
    dateAdded: string;
    datePublished?: string;
    pages?: number;
    language?: string;
    publisher?: string;
    isbn?: string;
    genres?: string[];
};

export type Author = {
    id: string;
    name: string;
    bio?: string;
    books: string[];
    image?: string;
    dateAdded: string;
    birthDate?: string;
    deathDate?: string;
};
