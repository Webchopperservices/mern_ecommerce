import React, { useEffect, useState } from 'react'

function Cart() {

    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        getCartItems();
    }, []);

    const getCartItems = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        let result = await fetch(`http://localhost:5000/cart/${user._id}`, {
            headers: {
                authorization: `bearer ${token}`
            }
        });

        result = await result.json();
        setCartItems(result);
        calculateTotal(result);
    };

    const calculateTotal = (items) => {
        let sum = 0;
        items.forEach(item => {
            if (item.productDetails) {
                sum += item.productDetails.price * item.quantity;
            }
        });
        setTotal(sum);
    };

    const removeItem = async (id) => {
        const token = localStorage.getItem('token')

        await fetch(`http://localhost:5000/cart/${id}`, {
            method: "DELETE",
            headers: {
                authorization: `bearer ${token}`
            }
        });

        getCartItems();
    };

    const updateQuantity = async (id, qty) => {
        if (qty < 1) return;

        const token = localStorage.getItem('token')

        await fetch(`http://localhost:5000/cart/${id}`, {
            method: "PUT",
            body: JSON.stringify({ quantity: qty }),
            headers: {
                "Content-Type": "application/json",
                authorization: `bearer ${token}`
            }
        });

        getCartItems();
    };

    return (
        <div className="container mt-4">

            <h2 className="mb-4">My Cart</h2>

            {
                cartItems.length > 0 ?
                    <div className="row">

                        {/* LEFT SIDE (Products) */}
                        <div className="col-md-8">

                            {
                                cartItems.map((item) => (
                                    <div key={item._id} className="card mb-3 shadow-sm p-3">

                                        <div className="d-flex justify-content-between align-items-center">

                                            {/* Product Info */}
                                            <div>
                                                <h5 className="fw-bold">
                                                    {item.productDetails?.name}
                                                </h5>
                                                <p className="mb-1">
                                                    ₹ {item.productDetails?.price}
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="d-flex align-items-center">

                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                >
                                                    -
                                                </button>

                                                <span className="mx-3 fw-bold">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                >
                                                    +
                                                </button>

                                            </div>

                                            {/* Subtotal */}
                                            <div>
                                                <h6 className="text-success">
                                                    ₹ {item.productDetails?.price * item.quantity}
                                                </h6>
                                            </div>

                                            {/* Remove */}
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => removeItem(item._id)}
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>
                                ))
                            }

                        </div>

                        {/* RIGHT SIDE (Summary) */}
                        <div className="col-md-4">

                            <div className="card shadow p-4">

                                <h4 className="mb-3">Price Details</h4>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Total Items</span>
                                    <span>{cartItems.length}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span>Total Amount</span>
                                    <strong>₹ {total}</strong>
                                </div>

                                <hr />

                                <button
                                    className="btn btn-success w-100"
                                    onClick={() => window.location.href = "/checkout"}
                                >
                                    Proceed to Checkout
                                </button>

                            </div>

                        </div>

                    </div>

                    :

                    <div className="text-center mt-5">
                        <h3>Cart Empty</h3>
                        <p>Add products to your cart</p>
                    </div>
            }

        </div>
    )
}

export default Cart;