import React, { useEffect, useState } from 'react'

function Orders() {

    const [orders, setOrders] = useState([])

    const [cancelReason, setCancelReason] = useState("")
    const [selectedOrder, setSelectedOrder] = useState("")

    useEffect(() => {
        getOrders()
    }, [])

    const getOrders = async () => {

        const user = JSON.parse(localStorage.getItem('user'))
        const token = localStorage.getItem('token')

        let result = await fetch(`http://localhost:5000/orders/${user._id}`, {
            headers: {
                authorization: `bearer ${token}`
            }
        })

        result = await result.json()

        setOrders(result)

        console.log(result)
    }

    // cancel order
    const cancelOrder = async (id) => {

        if (!cancelReason) {
            alert("Please enter cancel reason")
            return
        }

        const token = localStorage.getItem('token')

        let result = await fetch(`http://localhost:5000/cancel-order/${id}`, {

            method: "PUT",

            body: JSON.stringify({
                cancelReason
            }),

            headers: {
                "Content-Type": "application/json",
                authorization: `bearer ${token}`
            }
        })

        result = await result.json()

        alert(result.result)

        setCancelReason("")
        setSelectedOrder("")

        getOrders()
    }

    // tracking steps
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
                            className="text-center"
                            style={{ width: "18%" }}
                        >

                            <div
                                style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "50%",
                                    background:
                                        index <= currentStep
                                            ? "#198754"
                                            : "#dee2e6",
                                    color:
                                        index <= currentStep
                                            ? "#fff"
                                            : "#000",
                                    lineHeight: "38px",
                                    margin: "auto",
                                    fontWeight: "bold"
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

        <div className="container py-5">

            <div className="text-center mb-5">

                <h2 className="fw-bold">
                    My Orders
                </h2>

                <p className="text-muted">
                    Track your recent orders and delivery status
                </p>

            </div>


            {
                orders.length > 0 ?

                    orders.map((order, index) => (

                        <div
                            key={order._id}
                            className="card border-0 shadow-lg rounded-4 mb-5 overflow-hidden"
                        >

                            {/* Header */}
                            <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">

                                <div>

                                    <h5 className="mb-1">
                                        Order #{index + 1}
                                    </h5>

                                    <small>
                                        {new Date(order.createdAt).toLocaleString()}
                                    </small>

                                </div>

                                <div>

                                    <span
                                        className={`badge px-3 py-2 fs-6
                                        
                                        ${order.status === "Delivered"
                                                ? "bg-success"

                                                : order.status === "Shipped"
                                                    ? "bg-primary"

                                                    : order.status === "Out For Delivery"
                                                        ? "bg-info text-dark"

                                                        : order.status === "Cancelled"
                                                            ? "bg-danger"

                                                            : "bg-warning text-dark"
                                            }`}
                                    >

                                        {order.status}

                                    </span>

                                </div>

                            </div>



                            {/* Body */}
                            <div className="card-body p-4">

                                {/* Address & Total */}
                                <div className="row mb-4">

                                    <div className="col-md-8">

                                        <h6 className="fw-bold mb-2">
                                            Delivery Address
                                        </h6>

                                        <p className="text-muted mb-0">
                                            {order.address}
                                        </p>

                                    </div>

                                    <div className="col-md-4 text-md-end mt-3 mt-md-0">

                                        <h6 className="fw-bold">
                                            Total Amount
                                        </h6>

                                        <h4 className="text-success fw-bold">
                                            ₹ {order.totalAmount}
                                        </h4>

                                    </div>

                                </div>



                                {/* Products */}
                                <div className="mt-4">

                                    <h5 className="fw-bold mb-3">
                                        Ordered Products
                                    </h5>

                                    {
                                        order.products?.map((item, index) => (

                                            <div
                                                key={index}
                                                className="d-flex justify-content-between align-items-center border rounded-3 p-3 mb-3"
                                            >

                                                <div className="d-flex align-items-center">

                                                    {
                                                        item.productDetails?.image &&

                                                        <img
                                                            src={`http://localhost:5000/uploads/${item.productDetails.image}`}
                                                            alt=""
                                                            width="70"
                                                            height="70"
                                                            className="rounded-3 border me-3"
                                                            style={{
                                                                objectFit: "cover"
                                                            }}
                                                        />
                                                    }

                                                    <div>

                                                        <h6 className="mb-1 fw-bold">
                                                            {item.productDetails?.name}
                                                        </h6>

                                                        <small className="text-muted">
                                                            Quantity: {item.quantity}
                                                        </small>

                                                    </div>

                                                </div>

                                                <div>

                                                    <h6 className="fw-bold text-success">
                                                        ₹ {
                                                            item.productDetails?.price *
                                                            item.quantity
                                                        }
                                                    </h6>

                                                </div>

                                            </div>
                                        ))
                                    }

                                </div>



                                {/* Cancel Order */}
                                {
                                    order.status !== "Delivered" &&
                                    order.status !== "Cancelled" &&

                                    <div className="mt-4">

                                        {
                                            selectedOrder === order._id ?

                                                <div>

                                                    <textarea
                                                        className="form-control"
                                                        placeholder="Enter cancel reason..."
                                                        value={cancelReason}
                                                        onChange={(e) => setCancelReason(e.target.value)}
                                                    />

                                                    <button
                                                        className="btn btn-danger mt-2"
                                                        onClick={() => cancelOrder(order._id)}
                                                    >
                                                        Confirm Cancel
                                                    </button>

                                                </div>

                                                :

                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() => setSelectedOrder(order._id)}
                                                >
                                                    Cancel Order
                                                </button>
                                        }

                                    </div>
                                }



                                {/* Tracking */}
                                <div className="mt-5">

                                    <h5 className="fw-bold mb-4">
                                        Order Tracking
                                    </h5>

                                    {
                                        order.status !== "Cancelled" &&
                                        renderTracking(order.status)
                                    }

                                </div>



                                {/* Cancel Reason */}
                                {
                                    order.status === "Cancelled" &&

                                    <div className="alert alert-danger mt-4">

                                        <h6 className="fw-bold">
                                            Cancel Reason
                                        </h6>

                                        <p className="mb-0">
                                            {order.cancelReason}
                                        </p>

                                    </div>
                                }

                            </div>

                        </div>
                    ))

                    :

                    <div className="text-center py-5">

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                            alt=""
                            width="120"
                            className="mb-4"
                        />

                        <h3>No Orders Found</h3>

                        <p className="text-muted">
                            Start shopping to place your first order
                        </p>

                    </div>
            }

        </div>
    )
}

export default Orders