import Avatar from "boring-avatars";
export default function UserSignature({ username, children }: { username: string, children?: React.ReactNode }) {

    return (
        <div className="flex items-center gap-3">
            <Avatar
                name={username}
                size={32}
                variant="beam"
            />
            <div className="flex w-full justify-between items-end gap-5">
                <div className="flex flex-col">
                    <span className="text-lg font-bold font-serif">
                        {username}
                    </span>
                    {children}
                </div>
            </div>
        </div>

    )
}