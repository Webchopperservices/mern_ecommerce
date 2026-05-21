import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../utils/auth'

function Products() {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState("")
    useEffect(() => {
        getProducts()
    }, [])
    const getProducts = async () => {
        let result = await fetch("http://localhost:5000/products", {
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
        result = await result.json()
        setProducts(result)
    }
    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product ?")) return
        let result = await fetch(`http://localhost:5000/product/${id}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        })
        result = await result.json()
        if (result) {
            getProducts()
        }
    }
    const searchHandle = async (event) => {
        let key = event.target.value
        setSearch(key)
        if (key) {
            let result = await fetch(`http://localhost:5000/search/${key}`, {
                headers: {
                    authorization: `Bearer ${getToken()}`
                }
            })
            result = await result.json()
            setProducts(result)
        } else {
            getProducts()
        }
    }

    return (

        <div
            className="container-fluid p-4"
            style={{
                background: "#f1f5f9",
                minHeight: "100vh"
            }}
        >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold">
                        Product Management
                    </h2>
                    <p className="text-muted mb-0">
                        Manage all products here
                    </p>
                </div>
                <Link
                    to="/add-product"
                    className="btn btn-primary px-4"
                >
                    + Add Product
                </Link>
            </div>
            {/* Search */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <input
                        type="text"
                        value={search}
                        onChange={searchHandle}
                        placeholder="Search Product..."
                        className="form-control"
                    />
                </div>
            </div>
            {/* Product Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Image</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Company</th>
                                    <th width="180">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Array.isArray(products) &&
                                        products.length > 0 ?
                                        products.map((item, index) => (
                                            <tr key={item._id}>
                                                <td>
                                                    {index + 1}
                                                </td>
                                                <td>
                                                    <img
                                                        src={`http://localhost:5000/uploads/${item.image}`}
                                                        alt={item.name}
                                                        width="60"
                                                        height="60"
                                                        style={{
                                                            objectFit: "cover",
                                                            borderRadius: "10px"
                                                        }}
                                                    />
                                                </td>
                                                <td className="fw-semibold">
                                                    {item.name}
                                                </td>
                                                <td className="text-success fw-bold">
                                                    ₹ {item.price}
                                                </td>
                                                <td>
                                                    {item.category}
                                                </td>
                                                <td>
                                                    {item.company}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Link
                                                            to={"/update/" + item._id}
                                                            className="btn btn-warning btn-sm me-2"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => deleteProduct(item._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center py-4"
                                            >
                                                No Products Found
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products