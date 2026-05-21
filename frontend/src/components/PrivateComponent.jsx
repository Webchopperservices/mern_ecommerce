import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateComponent = () => {

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    return (user?.role && token)
        ? <Outlet />
        : <Navigate to="/login" />;
}

export default PrivateComponent;