'use client'

import { useEffect, useState, useRef } from 'react'

export default function Spotlight({ children, className }: { children: React.ReactNode, className?: string }) {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const spotlightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (spotlightRef.current) {
            // Include in useEffect to update with state changes
            const handleMouseMove = (e: MouseEvent) => {
                if (!spotlightRef.current || prefersReducedMotion) return;
                spotlightRef.current.style.setProperty('--translate-x', `${e.clientX}px`);
                spotlightRef.current.style.setProperty('--translate-y', `${e.clientY}px`);
            };

            document.body.addEventListener('mousemove', handleMouseMove);

            return () => {
                document.body.removeEventListener('mousemove', handleMouseMove);
            }
        }
    }, [prefersReducedMotion]);

    useEffect(() => {
        const userPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(userPrefersReducedMotion.matches);
    }, []);

    return <div ref={spotlightRef} className={`spotlight ${className}`}>
        {children}
    </div>
}