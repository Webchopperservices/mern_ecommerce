import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function UpdateProduct() {

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [company, setCompany] = useState("")

    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState("")
    const [oldImage, setOldImage] = useState("")

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getProductDetail()
    }, [])

    const getProductDetail = async () => {

        let result = await fetch(`http://localhost:5000/product/${params.id}`, {
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`
            }
        })

        result = await result.json()

        setName(result.name)
        setPrice(result.price)
        setCategory(result.category)
        setCompany(result.company)

        // old image from database
        setOldImage(result.image)
    }

    const updateProduct = async () => {

        const formData = new FormData()

        formData.append("name", name)
        formData.append("price", price)
        formData.append("category", category)
        formData.append("company", company)

        // append image if selected
        if (image) {
            formData.append("image", image)
        }

        let result = await fetch(`http://localhost:5000/product/${params.id}`, {
            method: 'PUT',
            body: formData,
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`
            }
        })

        result = await result.json()

        console.log(result)

        alert("Product Updated Successfully")

        navigate('/products')
    }

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>

            <h1>Update Product</h1>

            <input
                type='text'
                className="form-control my-2"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder='Product Name'
            />

            <input
                type='text'
                className="form-control my-2"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                placeholder='Product Price'
            />

            <input
                type='text'
                className="form-control my-2"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                placeholder='Product Category'
            />

            <input
                type='text'
                className="form-control my-2"
                onChange={(e) => setCompany(e.target.value)}
                value={company}
                placeholder='Company Name'
            />

            <input
                type='file'
                className="form-control my-2"
                onChange={(e) => {
                    setImage(e.target.files[0])
                    setPreview(URL.createObjectURL(e.target.files[0]))
                }}
            />

            {/* Image Preview */}
            {
                preview ? (
                    <img
                        src={preview}
                        alt="preview"
                        width="120"
                        className="my-2 border rounded"
                    />
                ) : oldImage ? (
                    <img
                        src={`http://localhost:5000/uploads/${oldImage}`}
                        alt="old"
                        width="120"
                        className="my-2 border rounded"
                    />
                ) : null
            }

            <button
                type='button'
                className="btn btn-primary w-100 mt-3"
                onClick={updateProduct}
            >
                Update Product
            </button>

        </div>
    )
}

export default UpdateProduct