import React, { useEffect, useState } from 'react'

function Users() {

    const [users, setUsers] = useState([])

    useEffect(() => {
        getUsers()
    }, [])

    const getUsers = async () => {

        const token = localStorage.getItem('token')

        let result = await fetch("http://localhost:5000/users", {
            headers: {
                authorization: `bearer ${token}`
            }
        })

        result = await result.json()

        setUsers(result)

        console.log(result)
    }

    return (
        <div className="container mt-5">

            <h2 className="mb-4">
                Users List
            </h2>

            <table className="table table-bordered table-striped">

                <thead className="table-dark">

                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>

                </thead>

                <tbody>

                    {
                        users.length > 0 ?

                            users.map((user, index) => (

                                <tr key={user._id}>

                                    <td>{index + 1}</td>

                                    <td>{user.name}</td>

                                    <td>{user.email}</td>

                                    <td>{user.role}</td>

                                </tr>
                            ))

                            :

                            <tr>
                                <td colSpan="4" className="text-center">
                                    No Users Found
                                </td>
                            </tr>
                    }

                </tbody>

            </table>

        </div>
    )
}

export default Users