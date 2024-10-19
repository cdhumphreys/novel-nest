"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpenIcon, CalendarIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header() {
    const [isExpanded, setIsExpanded] = useState(false);


    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    }

    return <header className={`header ${isExpanded ? "is-expanded" : ""}`}>
        <div className="container">
            <div className="header__inner">
                <div className="header__logo">
                    <img src="https://picsum.photos/120/50" alt="Novel Nest logo" />
                </div>
                <div className="header__expanded">
                    <div className="header__expanded-inner">
                        <div className="header-expanded__search">
                            <div className="field-container">
                                <input type="text" placeholder="Search" />
                            </div>
                        </div>
                        <div className="header-expanded__links">
                            <Link href="/books" className="btn btn-secondary">
                                <BookOpenIcon />
                                <span>Books</span>
                            </Link>
                            <Link href="/events" className="btn btn-secondary">
                                <CalendarIcon />
                                <span>Events</span>
                            </Link>
                        </div>
                        <div className="header-expanded__actions">
                            <button className="btn btn-tertiary">Login</button>
                            <button className="btn btn-primary">Signup</button>
                        </div>

                    </div>
                </div>
                <button className="header__toggle" onClick={toggleExpanded}>
                    <span className="header__toggle-icon">
                        {isExpanded ? <XMarkIcon /> : <Bars3Icon />}
                    </span>
                </button>
            </div>
        </div>
    </header>
}