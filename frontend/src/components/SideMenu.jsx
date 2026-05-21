import React from 'react'
import { useLocation } from 'react-router-dom'

import AdminSideMenu from './AdminSideMenu'
import UserSideMenu from './UserSideMenu'

function SideMenu() {

    const location = useLocation()

    const auth = JSON.parse(localStorage.getItem('user') || '{}')

    // Hide menu on login/signup page
    if (
        location.pathname === "/login" ||
        location.pathname === "/signup"
    ) {
        return null
    }

    // If no user logged in
    if (!auth?.role) {
        return null
    }

    return (
        <>
            {
                auth.role === "admin"
                    ?
                    <AdminSideMenu />
                    :
                    <UserSideMenu />
            }
        </>
    )
}

export default SideMenu