import React, { useEffect, useState } from 'react'

function Home() {

    const [dashboard, setDashboard] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        revenue: 0
    })

    const [orders, setOrders] = useState([])

    useEffect(() => {
        getDashboard()
        getOrders()
    }, [])

    // ================= DASHBOARD =================
    const getDashboard = async () => {
        const token = localStorage.getItem('token')

        let result = await fetch("http://localhost:5000/dashboard", {
            headers: {
                authorization: `bearer ${token}`
            }
        })

        result = await result.json()
        setDashboard(result)
        console.log(result)
    }

    // ================= ORDERS =================
    const getOrders = async () => {
        const token = localStorage.getItem('token')

        let result = await fetch("http://localhost:5000/orders", {
            headers: {
                authorization: `bearer ${token}`
            }
        })

        result = await result.json()
        setOrders(result)
        console.log(result)
    }

    return (
        <div className="container-fluid" style={{ background: "#f4f6f9", minHeight: "100vh", padding: "25px" }}>

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold">Admin Dashboard</h2>
                    <p className="text-muted">Welcome Back Admin 👋</p>
                </div>

                <button className="btn btn-dark">
                    Download Report
                </button>
            </div>

            {/* ================= CARDS ================= */}
            <div className="row g-4">

                <div className="col-lg-3 col-md-6">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body d-flex justify-content-between">
                            <div>
                                <p className="text-muted">Total Products</p>
                                <h2>{dashboard.totalProducts}</h2>
                            </div>
                            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center"
                                style={{ width: 60, height: 60 }}>
                                📦
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body d-flex justify-content-between">
                            <div>
                                <p className="text-muted">Total Orders</p>
                                <h2>{dashboard.totalOrders}</h2>
                            </div>
                            <div className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center"
                                style={{ width: 60, height: 60 }}>
                                🛒
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body d-flex justify-content-between">
                            <div>
                                <p className="text-muted">Total Users</p>
                                <h2>{dashboard.totalUsers}</h2>
                            </div>
                            <div className="bg-danger text-white rounded-circle d-flex justify-content-center align-items-center"
                                style={{ width: 60, height: 60 }}>
                                👤
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body d-flex justify-content-between">
                            <div>
                                <p className="text-muted">Revenue</p>
                                <h2>₹{dashboard.revenue}</h2>
                            </div>
                            <div className="bg-warning text-white rounded-circle d-flex justify-content-center align-items-center"
                                style={{ width: 60, height: 60 }}>
                                💰
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ================= RECENT ORDERS ================= */}
            <div className="card mt-5 shadow-sm border-0 rounded-4">

                <div className="card-header bg-white border-0">
                    <h5 className="fw-bold">Recent Orders</h5>
                </div>

                <div className="card-body">

                    {
                        orders.length > 0 ?

                            <div className="table-responsive">
                                <table className="table align-middle">

                                    <thead>
                                        <tr className="text-muted">
                                            <th>#</th>
                                            <th>Customer</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            orders.map((item, index) => (
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.userId?.name || "N/A"}</td>
                                                    <td>₹{item.totalAmount}</td>
                                                    <td>
                                                        <span className={`badge 
                                                            ${item.status === "Delivered"
                                                                ? "bg-success"
                                                                : item.status === "Pending"
                                                                    ? "bg-warning text-dark"
                                                                    : "bg-info"
                                                            }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>

                                </table>
                            </div>

                            :

                            <h5 className="text-muted">No Orders Found</h5>
                    }

                </div>
            </div>

        </div>
    )
}

export default Home