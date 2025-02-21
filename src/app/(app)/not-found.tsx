import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="container text-center flex flex-col gap-5 justify-center items-center min-h-screen">
            <div className="flex flex-col gap-2 items-center">
                <h2 className="text-2xl font-bold">An error occurred</h2>
                <p className="text-lg">The page you are looking for does not exist</p>
            </div>
            <Link href="/" className="text-blue-500 hover:text-blue-600 hover:underline">Go back to the home page</Link>
        </div>
    )
}