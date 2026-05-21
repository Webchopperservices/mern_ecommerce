import React, { useEffect, useState } from 'react'

function OrderList() {

    const [orders, setOrders] = useState([])

    useEffect(() => {
        getOrders()
    }, [])

    const getOrders = async () => {

        const token = localStorage.getItem('token')

        let result = await fetch("http://localhost:5000/orders", {
            headers: {
                authorization: `bearer ${token}`
            }
        })

        result = await result.json()

        setOrders(result)
    }

    // UPDATE STATUS
    const updateStatus = async (id, status) => {

        const token = localStorage.getItem('token')

        let result = await fetch(`http://localhost:5000/order-status/${id}`, {
            method: "PUT",
            body: JSON.stringify({ status }),
            headers: {
                "Content-Type": "application/json",
                authorization: `bearer ${token}`
            }
        })

        result = await result.json()

        getOrders()
    }

    // TRACKING UI
    const renderTracking = (status) => {

        const steps = [
            "Pending",
            "Confirmed",
            "Shipped",
            "Out For Delivery",
            "Delivered"
        ]

        const currentStep = steps.indexOf(status)

        return (
            <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">

                {
                    steps.map((step, index) => (

                        <div
                            key={index}
                            className="text-center mb-2"
                            style={{ width: "18%" }}
                        >

                            <div
                                style={{
                                    width: "45px",
                                    height: "45px",
                                    borderRadius: "50%",
                                    background:
                                        status === "Cancelled"
                                            ? "#dc3545"
                                            : index <= currentStep
                                                ? "#198754"
                                                : "#dee2e6",
                                    color: "#fff",
                                    lineHeight: "45px",
                                    margin: "auto",
                                    fontWeight: "bold",
                                    fontSize: "18px"
                                }}
                            >
                                {index + 1}
                            </div>

                            <small
                                className={
                                    index <= currentStep
                                        ? "text-success fw-bold"
                                        : "text-muted"
                                }
                            >
                                {step}
                            </small>

                        </div>
                    ))
                }

            </div>
        )
    }

    return (

        <div className="container py-4">

            <h2 className="mb-4 fw-bold text-primary">
                Admin Order List
            </h2>

            {
                orders.length > 0 ?

                    orders.map((item, index) => (

                        <div
                            className="card border-0 shadow-lg mb-4 rounded-4"
                            key={item._id}
                        >

                            <div className="card-body p-4">

                                {/* TOP SECTION */}
                                <div className="row">

                                    <div className="col-md-3">

                                        <h5 className="fw-bold">
                                            Order #{index + 1}
                                        </h5>

                                        <p className="mb-1">
                                            <b>Name:</b> {item.userId?.name}
                                        </p>

                                        <p className="mb-1">
                                            <b>Email:</b> {item.userId?.email}
                                        </p>

                                        <p className="mb-1">
                                            <b>Date:</b>{" "}
                                            {
                                                new Date(item.createdAt)
                                                    .toLocaleDateString()
                                            }
                                        </p>

                                    </div>

                                    <div className="col-md-3">

                                        <p className="fw-bold mb-1">
                                            Delivery Address
                                        </p>

                                        <p className="text-muted">
                                            {item.address}
                                        </p>

                                    </div>

                                    <div className="col-md-2">

                                        <p className="fw-bold mb-1">
                                            Total Amount
                                        </p>

                                        <h4 className="text-success">
                                            ₹ {item.totalAmount}
                                        </h4>

                                    </div>

                                    <div className="col-md-2">

                                        <p className="fw-bold mb-1">
                                            Update Status
                                        </p>

                                        <select
                                            className="form-select"
                                            value={item.status}
                                            onChange={(e) =>
                                                updateStatus(
                                                    item._id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option>Pending</option>
                                            <option>Confirmed</option>
                                            <option>Shipped</option>
                                            <option>Out For Delivery</option>
                                            <option>Delivered</option>
                                            <option>Cancelled</option>
                                        </select>

                                    </div>

                                    <div className="col-md-2 text-center">

                                        {
                                            item.products &&
                                            item.products.length > 0 &&

                                            <img
                                                src={`http://localhost:5000/uploads/${item.products[0].image}`}
                                                alt=""
                                                width="90"
                                                height="90"
                                                style={{
                                                    objectFit: "cover",
                                                    borderRadius: "12px"
                                                }}
                                            />
                                        }

                                    </div>

                                </div>

                                <hr />

                                {/* PRODUCT LIST */}
                                <h5 className="fw-bold mb-3">
                                    Ordered Products
                                </h5>

                                {
                                    item.products &&
                                    item.products.map((product, pIndex) => (

                                        <div
                                            key={pIndex}
                                            className="d-flex align-items-center justify-content-between border rounded-3 p-3 mb-2"
                                        >

                                            <div className="d-flex align-items-center">

                                                <img
                                                    src={`http://localhost:5000/uploads/${product.image}`}
                                                    alt=""
                                                    width="70"
                                                    height="70"
                                                    style={{
                                                        objectFit: "cover",
                                                        borderRadius: "10px"
                                                    }}
                                                />

                                                <div className="ms-3">

                                                    <h6 className="mb-1">
                                                        {product.name}
                                                    </h6>

                                                    <p className="mb-0 text-muted">
                                                        ₹ {product.price}
                                                    </p>

                                                </div>

                                            </div>

                                            <div>
                                                <span className="badge bg-primary fs-6">
                                                    Qty : {product.quantity || 1}
                                                </span>
                                            </div>

                                        </div>

                                    ))
                                }

                                {/* TRACKING */}
                                {
                                    item.status === "Cancelled"
                                        ?
                                        <div className="alert alert-danger mt-4">
                                            This order has been cancelled.
                                        </div>
                                        :
                                        renderTracking(item.status)
                                }

                            </div>

                        </div>

                    ))

                    :

                    <div className="alert alert-warning">
                        No Orders Found
                    </div>
            }

        </div>
    )
}

export default OrderList