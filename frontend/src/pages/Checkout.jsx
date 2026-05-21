import React, { useEffect, useState } from 'react'

function Checkout() {

    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCartItems();
    }, []);

    const getCartItems = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token')

        let result = await fetch(`http://localhost:5000/cart/${user._id}`, {
            headers: {
                authorization: `bearer ${token}`
            }
        });

        result = await result.json();
        setCartItems(result);

        let sum = 0;
        result.forEach(item => {
            sum += item.productDetails?.price * item.quantity;
        });
        setTotal(sum);
    };

    const placeOrder = async () => {
        if (!address) {
            alert("Enter address");
            return;
        }

        setLoading(true);

        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token')

        let result = await fetch("http://localhost:5000/place-order", {
            method: "POST",
            body: JSON.stringify({
                userId: user._id,
                products: cartItems,
                totalAmount: total,
                address
            }),
            headers: {
                "Content-Type": "application/json",
                authorization: `bearer ${token}`
            }
        });

        await result.json();

        setLoading(false);
        alert("Order Placed Successfully");
        window.location.href = "/orders";
    };

    return (
        <div className="container mt-5">

            <h2 className="mb-4">Checkout</h2>

            <div className="row">

                {/* LEFT SIDE - ADDRESS */}
                <div className="col-md-7">

                    <div className="card shadow p-4 mb-4">

                        <h4 className="mb-3">Delivery Address</h4>

                        <textarea
                            className="form-control"
                            rows="5"
                            placeholder="Enter full delivery address..."
                            onChange={(e) => setAddress(e.target.value)}
                        />

                    </div>

                    {/* Optional: Payment Info */}
                    <div className="card shadow p-4">
                        <h5>Payment Method</h5>
                        <p className="text-muted">Cash on Delivery (COD)</p>
                    </div>

                </div>

                {/* RIGHT SIDE - SUMMARY */}
                <div className="col-md-5">

                    <div className="card shadow p-4">

                        <h4 className="mb-3">Order Summary</h4>

                        {
                            cartItems.map(item => (
                                <div key={item._id} className="d-flex justify-content-between mb-2">
                                    <span>{item.productDetails?.name} x {item.quantity}</span>
                                    <span>₹ {item.productDetails?.price * item.quantity}</span>
                                </div>
                            ))
                        }

                        <hr />

                        <div className="d-flex justify-content-between mb-3">
                            <strong>Total</strong>
                            <strong>₹ {total}</strong>
                        </div>

                        <button
                            className="btn btn-success w-100"
                            onClick={placeOrder}
                            disabled={loading}
                        >
                            {loading ? "Placing Order..." : "Place Order"}
                        </button>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default Checkout;