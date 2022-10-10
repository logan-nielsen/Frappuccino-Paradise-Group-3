import React from 'react';

import { Link } from "react-router-dom"

export default function Nav() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="app">Home</Link>
                </li>
                <li>
                    <Link to="app/account">Account</Link>
                </li>
                <li>
                    <Link to="app/login">Login</Link>
                </li>
                <li>
                    <Link to="app/signup">Signup</Link>
                </li>
            </ul>
        </nav>
    )
}
