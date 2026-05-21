import React, { useEffect, useState } from 'react'

function MyAccount() {
    const [user,setUser]=useState([])
    useEffect(() => {
            getUser()
        }, [])
    
    const getUser = async () => {

        const user = JSON.parse(localStorage.getItem('user'))
        const token = localStorage.getItem('token')

        let result = await fetch(`http://localhost:5000/users/${user._id}`, {
            headers: {
                authorization: `bearer ${token}`
            }
        })

        result = await result.json()

        setUser(result)

        console.log(result)
    }
  return (
    <div className="container mt-5">

            <div className="card shadow border-0 p-4">

                <h2 className="mb-4">
                    My Account
                </h2>

                <div className="row">

                    <div className="col-md-6 mb-3">

                        <label className="fw-bold">
                            Name
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={user.name || ""}
                            readOnly
                        />

                    </div>

                    <div className="col-md-6 mb-3">

                        <label className="fw-bold">
                            Email
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={user.email || ""}
                            readOnly
                        />

                    </div>

                    <div className="col-md-6 mb-3">

                        <label className="fw-bold">
                            Role
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={user.role || ""}
                            readOnly
                        />

                    </div>

                    <div className="col-md-6 mb-3">

                        <label className="fw-bold">
                            User ID
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={user._id || ""}
                            readOnly
                        />

                    </div>

                </div>

            </div>

        </div>
  )
}

export default MyAccount
