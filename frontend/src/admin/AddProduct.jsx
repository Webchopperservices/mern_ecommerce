import React, { useState } from 'react'

function AddProduct() {

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [company, setCompany] = useState("")
  const [error, setError] = useState(false)
  const [image, setImage] = useState(null);

  const addProduct = async () => {

    if (!name || !price || !category || !company) {
      setError(true)
      return
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("company", company);
    formData.append("userId", user._id);
    formData.append("image", image);

    let result = await fetch("http://localhost:5000/add-product", {
      method: "POST",
      body: formData,
      headers: {
        authorization: `bearer ${token}`
      }
    });

    result = await result.json();

    console.log(result);

    alert("Product Added Successfully");
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h1>Add Product</h1>

      <input type='text' className="form-control my-2" onChange={(e) => setName(e.target.value)} value={name} placeholder='Product Name' />
      {error && !name && <span>Enter Valid Name</span>}

      <input type='text' className="form-control my-2" onChange={(e) => setPrice(e.target.value)} value={price} placeholder='Product Price' />
      {error && !price && <span>Enter Valid Price</span>}

      <input type='text' className="form-control my-2" onChange={(e) => setCategory(e.target.value)} value={category} placeholder='Product Category' />
      {error && !category && <span>Enter Valid category</span>}

      <input type='text' className="form-control my-2" onChange={(e) => setCompany(e.target.value)} value={company} placeholder='Company Name' />
      {error && !company && <span>Enter Valid company</span>}
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <button type='button' className="btn btn-primary w-100" onClick={addProduct}>Add Product</button>
    </div>
  )
}

export default AddProduct