import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function UserSideMenu() {

    const navigate = useNavigate()

    const auth = JSON.parse(localStorage.getItem('user'))

    const logout = () => {

        localStorage.clear()

        navigate('/login')
    }

    //Only User Access
    if (!auth || auth.role !== "user") {
        return null
    }

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container-fluid">

                <Link className="navbar-brand" to="/">
                    MyShop
                </Link>

                <div>

                    <Link className="btn btn-outline-light mx-2" to="/">
                        Home
                    </Link>

                    <Link className="btn btn-outline-light mx-2" to="/cart">
                        Cart
                    </Link>

                    <Link className="btn btn-outline-light mx-2" to="/orders">
                        Orders
                    </Link>

                    <Link className="btn btn-outline-light mx-2" to="/my-account">
                        Profile
                    </Link>

                    <button
                        className="btn btn-danger mx-2"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>
    )
}

export default UserSideMenu