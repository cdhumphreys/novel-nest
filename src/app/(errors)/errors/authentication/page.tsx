import Link from 'next/link'

export default function AuthenticationErrorPage() {
    return <div className="container text-center flex flex-col gap-5 justify-center items-center min-h-screen">
        <div className="flex flex-col gap-2 items-center">
            <h2 className="text-2xl font-bold">An error occurred</h2>
            <p className="text-lg">You must be logged in to access this page</p>
        </div>
        <div className="text-center">
            <span>You can </span>
            <Link href="/login" className="text-blue-500 hover:text-blue-600 underline">login</Link>
            <span> or </span>
            <Link href="/register" className="text-blue-500 hover:text-blue-600 underline">register</Link>
        </div>
    </div>
}