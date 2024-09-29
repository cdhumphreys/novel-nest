'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"

import './header.scss';

export default function DashboardHeader() {
    const currentPathName = usePathname();
    console.log(currentPathName);

    const paths = [
        { label: 'Dashboard', url: "/dashboard" },
        { label: 'Library', url: "/dashboard/library" },
        { label: 'Account', url: "/dashboard/account" },
    ];
    return <header className="dashboard-header container">
        <div className="dashboard-header__inner">
            <div className="dashboard-header__logo">
                <img src="https://picsum.photos/40/35" alt="" />
            </div>
            <nav className="dashboard-header-nav">
                <div className="dashboard-header-nav__links">
                    {paths.map((path) => (
                        <Link key={path.label} href={`${path.url}`} className={`nav-link ${currentPathName === path.url ? 'is-active' : ''}`}>{path.label}</Link>
                    ))}
                </div>
            </nav>
        </div>
    </header>
}