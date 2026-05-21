import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

function UserRoute() {

    const auth = JSON.parse(localStorage.getItem('user'))

    return auth && auth.role === "user"
        ? <Outlet />
        : <Navigate to="/" />
}

export default UserRoute