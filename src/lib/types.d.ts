export type Book = {
    id: string;
    title: string;
    authorId?: string;
    description?: string;
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
    image?: string;
    dateAdded: string;
    birthDate?: string;
    deathDate?: string;
};

export type Review = {
    id: string;
    bookId: string;
    userId: string;
    rating: number;
    comment: string;
    datePosted: string;
};