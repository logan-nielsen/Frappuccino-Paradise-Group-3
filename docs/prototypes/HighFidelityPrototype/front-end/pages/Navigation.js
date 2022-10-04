import React from 'react';

import { Link } from "react-router-dom"

export default function Nav() {
    return (
        <nav>
            <ul className="nav_list">
                <li>
                    <Link to="">Home</Link>
                </li>
                <li>
                    <Link to="place_order">Place New Order</Link>
                </li>
                <li>
                    <Link to="account">Account</Link>
                </li>
                <li>
                    <Link to="manage_orders">Manage Orders</Link>
                </li>
                <li>
                    <Link to="payroll">Payroll</Link>
                </li>
                <li>
                    <Link to="inventory">Inventory</Link>
                </li>
            </ul>
        </nav>
    )
}
