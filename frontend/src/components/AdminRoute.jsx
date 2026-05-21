import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

function AdminRoute() {

    const auth = JSON.parse(localStorage.getItem('user'))

    return auth && auth.role === "admin"
        ? <Outlet />
        : <Navigate to="/" />
}

export default AdminRoute