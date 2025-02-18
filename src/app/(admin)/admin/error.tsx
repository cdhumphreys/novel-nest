'use client' // Error components must be Client Components

import { AuthenticationError, AuthorisationError } from '@/lib/utils'
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
        console.error(error, error.name)
    }, [error])

    if (error instanceof AuthenticationError) {
        return (<div>
            <h2>You must be logged in to access this page!</h2>
        </div>)
    }

    if (error instanceof AuthorisationError) {
        return (<div>
            <h2>You must be an admin to access this page!</h2>
        </div>)
    }

}