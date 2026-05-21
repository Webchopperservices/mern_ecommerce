import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function AdminSideMenu() {
    const navigate = useNavigate()
    const location = useLocation()
    const logout = () => {
        localStorage.clear()
        navigate('/login')
    }
    const menuItems = [
        {
            name: "Dashboard",
            path: "/home",
            icon: ""
        },
        {
            name: "Add Product",
            path: "/add-product",
            icon: ""
        },
        {
            name: "Products",
            path: "/products",
            icon: ""
        },
        {
            name: "Orders",
            path: "/orders-list",
            icon: ""
        },
        {
            name: "Users",
            path: "/users",
            icon: ""
        }
    ]

    return (
        <div
            className="d-flex flex-column justify-content-between shadow-lg"
            style={{
                width: "270px",
                minHeight: "100vh",
                background: "linear-gradient(180deg, #111827, #1f2937)",
                position: "sticky",
                top: 0
            }}
        >
            <div>
                {/* Logo */}
                <div className="text-center py-4 border-bottom border-secondary">
                    <h2
                        className="fw-bold text-white mb-1"
                    >
                        MyShop
                    </h2>
                </div>
                {/* Admin Profile */}
                <div className="text-center py-4">
                    <div
                        className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                        style={{
                            width: "75px",
                            height: "75px",
                            borderRadius: "50%",
                            background: "#374151",
                            fontSize: "28px",
                            color: "white"
                        }}
                    >
                        👨‍💼
                    </div>
                    <h5 className="text-white mb-1">
                        Admin
                    </h5>
                </div>
                {/* Menu */}
                <ul className="nav flex-column px-3">
                    {
                        menuItems.map((item, index) => (
                            <li
                                key={index}
                                className="nav-item mb-2"
                            >
                                <Link
                                    to={item.path}
                                    className="nav-link d-flex align-items-center"
                                    style={{
                                        background:
                                            location.pathname === item.path
                                                ? "#2563eb"
                                                : "transparent",

                                        color: "white",
                                        padding: "12px 15px",
                                        borderRadius: "12px",
                                        transition: "0.3s",
                                        fontWeight: "500"
                                    }}
                                >
                                    <span className="me-3">
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
            {/* Bottom Section */}
            <div className="p-3">
                <button
                    className="btn btn-danger w-100 py-2 rounded-3 fw-bold"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </div>
    )
}
export default AdminSideMenu