import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getToken } from '../utils/auth';

function ProductList() {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        getProducts();
    }, [])

    const getProducts = async () => {
        let result = await fetch("http://localhost:5000/products", {
            headers: {
                authorization: `bearer ${getToken()}`
            }
        })
        result = await result.json()
        setProducts(result)
        console.log(products)
    }

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        let result = await fetch(`http://localhost:5000/product/${id}`, {
            method: "DELETE",
            headers: {
                authorization: `bearer ${getToken()}`
            }
        })

        result = await result.json()

        if (result) {
            getProducts();
        }
    }

    const searchHandle = async (event) => {
        let key = event.target.value
        setSearch(key)

        if (key) {
            let result = await fetch(`http://localhost:5000/search/${key}`, {
                headers: {
                    authorization: `bearer ${getToken()}`
                }
            })
            result = await result.json()
            setProducts(result)
        } else {
            getProducts()
        }
    }

    const addToCart = async (productId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token')

        let result = await fetch("http://localhost:5000/add-to-cart", {
            method: "POST",
            body: JSON.stringify({
                userId: user._id,
                productId: productId,
                quantity: 1
            }),
            headers: {
                "Content-Type": "application/json",
                authorization: `bearer ${token}`
            }
        });

        await result.json();
        alert("Added to Cart");
    };

    return (
        <div className="container mt-4">

            <h2 className="mb-4">Product List hello</h2>

            {/*Search */}
            <input
                type='text'
                value={search}
                onChange={searchHandle}
                placeholder='Search product...'
                className="form-control mb-4"
            />

            <div className="row">
                {
                    products.length > 0 ?

                        products.map((item) => (
                            <div className="col-md-3 mb-4" key={item._id}>

                                <div className="card shadow h-100">

                                    <div className="card-body d-flex flex-column">
                                        <img
                                            src={`http://localhost:5000/uploads/${item.image}`}
                                            width="100"
                                        />
                                        <h5 className="card-title">{item.name}</h5>

                                        <p className="mb-1">₹ {item.price}</p>
                                        <p className="mb-1">{item.category}</p>
                                        <p className="mb-3">{item.company}</p>

                                        {/* Buttons */}
                                        <div className="mt-auto">

                                            <button
                                                className="btn btn-primary btn-sm me-2"
                                                onClick={() => addToCart(item._id)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                        :
                        <h4 className="text-center">No Product Found</h4>
                }
            </div>
        </div>
    )
}

export default ProductList