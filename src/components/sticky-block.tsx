import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";



export default function StickyBlock({ children, stickyMode, className }: { children: React.ReactNode, stickyMode: "both" | "mobile" | "desktop" | undefined, className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const header = document.querySelector('header');
        const headerHeight = header?.clientHeight;
        if (ref.current) {
            ref.current.style.setProperty('--header-height', `${headerHeight}px`);
        }
    }, []);
    const stickyMobileOnly = "sticky top-[calc(var(--header-height)+10px)] lg:static top-auto";
    const stickyDesktopOnly = "lg:sticky lg:top-[calc(var(--header-height)+10px)]";
    const stickyBoth = "sticky top-[calc(var(--header-height)+10px)]";

    return (<div className={twMerge(`${stickyMode === "mobile" ? stickyMobileOnly : stickyMode === "desktop" ? stickyDesktopOnly : stickyBoth}`, className)} ref={ref}>
        {children}
    </div>)
}