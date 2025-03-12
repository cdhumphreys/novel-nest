import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export function FormDialog({ show, setShow, title, description, children }: { show: boolean, setShow: (show: boolean) => void, title: string, description: string, children: React.ReactNode }) {
    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}