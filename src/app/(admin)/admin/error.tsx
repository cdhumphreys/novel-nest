'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.log(error.name)
    }, [error])

    return <div className="flex flex-col gap-5 items-center justify-center min-h-screen">
        <div className="flex flex-col gap-2 items-center">
            <h2 className="text-2xl font-bold">An error occurred</h2>
            <p className="text-lg">{error.message}</p>
        </div>
        <a href="/" className="text-blue-500 hover:text-blue-600 hover:underline">Go back to the home page</a>
    </div>

}
