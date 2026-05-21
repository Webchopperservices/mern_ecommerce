const express = require("express")
const cors = require("cors")
require('./db/config')
const User = require('./db/User')
const Product = require('./db/Product')
const Cart = require('./db/Cart');
const Order = require('./db/Order');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const upload = require('./middleware/upload');
const Jwt = require('jsonwebtoken')
const jwtKey = 'e-com'
const app = express()
app.use(express.json())
app.use(cors())


//register
app.post("/register", async (req, resp) => {

    let existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
        return resp.send({ result: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    });

    let result = await user.save();
    result = result.toObject();
    delete result.password;

    Jwt.sign({ result }, jwtKey, { expiresIn: "7d" }, (err, token) => {
        resp.send({ result, auth: token });
    });
});

//login
app.post("/login", async (req, resp) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (isMatch) {
                let userData = user.toObject();
                delete userData.password;
                // TOKEN FIX
                Jwt.sign(
                    { userId: user._id, role: user.role },
                    jwtKey,
                    { expiresIn: "7d" },
                    (err, token) => {
                        if (err) {
                            return resp.send({ result: "Token error" });
                        }
                        resp.send({ user: userData, auth: token });
                    }
                );
            } else {
                resp.send({ result: "Invalid Password" });
            }
        } else {
            resp.send({ result: "User not found" });
        }
    } else {
        resp.send({ result: "Enter email & password" });
    }
});

// get users
app.get("/users", verifyToken, async (req, resp) => {

    try {

        let users = await User.find().select("-password")

        resp.send(users)

    } catch (error) {

        console.log(error)

        resp.status(500).send({
            result: "Error fetching users"
        })
    }
})

// get single user
app.get("/users/:id", verifyToken, async (req, resp) => {

    try {

        let user = await User.findById(req.params.id)
            .select("-password")

        if (user) {
            resp.send(user)
        } else {
            resp.status(404).send({
                result: "User not found"
            })
        }

    } catch (error) {

        console.log(error)

        resp.status(500).send({
            result: "Error fetching user"
        })
    }
})

//Storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
app.use('/uploads', express.static('uploads'));

//add product
app.post("/add-product", verifyToken, upload.single('image'), async (req, resp) => {

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        company: req.body.company,
        userId: req.body.userId,
        image: req.file ? req.file.filename : ""
    });

    const result = await product.save();

    resp.send(result);
});

//product fetch
app.get("/products", verifyToken, async (req, resp) => {

    try {

        let products = await Product.find();

        resp.send(products);

    } catch (error) {

        resp.status(500).send({
            result: "Something went wrong"
        })

    }

})

//product delete
app.delete("/product/:id", verifyToken, async (req, resp) => {
    const result = await Product.deleteOne({ _id: req.params.id })
    resp.send(result);
})

//product get and update
app.get("/product/:id", verifyToken, async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result)
    }
    else {
        resp.send("No record found")
    }
})

app.put("/product/:id", verifyToken, upload.single('image'), async (req, resp) => {
    let updateData = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        company: req.body.company
    }
    // if new image uploaded
    if (req.file) {
        updateData.image = req.file.filename
    }
    let result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: updateData
        }
    )
    resp.send(result)
})

//product search
app.get("/search/:key", verifyToken, async (req, resp) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { price: { $regex: req.params.key } },
            { category: { $regex: req.params.key } },
            { company: { $regex: req.params.key } }
        ]
    })
    resp.send(result)
})

// order list for admin
app.get("/orders", verifyToken, async (req, resp) => {

    try {

        let orders = await Order.find()

            .populate({
                path: "userId",
                model: "User",
                select: "name email"
            })

            .sort({ createdAt: -1 })

        resp.send(orders)

    } catch (error) {

        console.log(error)

        resp.status(500).send({
            result: "Error fetching orders"
        })
    }
})

// update order status
app.put("/order-status/:id", verifyToken, async (req, resp) => {

    try {

        let result = await Order.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    status: req.body.status
                }
            }
        )

        resp.send(result)

    } catch (error) {

        console.log(error)

        resp.status(500).send({
            result: "Error Updating Status"
        })
    }
})


//function to veriyfytoken
function verifyToken(req, resp, next) {
    let token = req.headers['authorization'];

    if (token) {
        token = token.split(' ')[1];

        Jwt.verify(token, jwtKey, (err, decoded) => {
            if (err) {
                resp.send({ result: "Invalid Token" });
            } else {
                req.userId = decoded.userId; 
                req.role = decoded.role;     
                next();
            }
        });
    } else {
        resp.send({ result: "Token Required" });
    }
}

//add to cart
app.post("/add-to-cart", verifyToken, async (req, resp) => {
    let cart = new Cart(req.body);
    let result = await cart.save();
    resp.send(result);
});

//get cart
app.get("/cart/:userId", verifyToken, async (req, resp) => {
    let cartData = await Cart.find({ userId: req.params.userId });

    let productIds = cartData.map(item => item.productId);

    let products = await Product.find({ _id: { $in: productIds } });

    let cartWithProducts = cartData.map(cartItem => {
        let product = products.find(p => p._id.toString() === cartItem.productId);

        return {
            ...cartItem.toObject(),
            productDetails: product
        };
    });

    resp.send(cartWithProducts);
});

//remove cart
app.delete("/cart/:id", verifyToken, async (req, resp) => {
    let result = await Cart.deleteOne({ _id: req.params.id });
    resp.send(result);
});

//order
app.post("/place-order", verifyToken, async (req, resp) => {

    try {

        const orderData = {

            userId: req.body.userId,

            name: req.body.name,

            mobile: req.body.mobile,

            address: req.body.address,

            totalAmount: req.body.totalAmount,

            products: req.body.products,

            status: "Pending"
        }

        let order = new Order(orderData)

        let result = await order.save()

        // clear cart
        await Cart.deleteMany({
            userId: req.body.userId
        })

        resp.send(result)

    } catch (error) {

        console.log(error)

        resp.status(500).send({
            result: "Order Failed"
        })
    }
})

//get order
app.get("/orders/:userId", verifyToken, async (req, resp) => {

    try {

        let orders = await Order.find({
            userId: req.params.userId.toString()
        });

        // all product ids
        let productIds = [];

        orders.forEach(order => {
            order.products.forEach(item => {
                productIds.push(item.productId);
            });
        });

        // get products
        let products = await Product.find({
            _id: { $in: productIds }
        });

        // attach product details
        let ordersWithProducts = orders.map(order => {

            let updatedProducts = order.products.map(item => {

                let product = products.find(
                    p => p._id.toString() === item.productId
                );

                return {
                    ...item.toObject(),
                    productDetails: product
                };
            });

            return {
                ...order.toObject(),
                products: updatedProducts
            };
        });

        resp.send(ordersWithProducts);

    } catch (error) {

        console.log(error);

        resp.status(500).send({
            result: "Error fetching orders"
        });
    }
});

//
app.put("/cart/:id", verifyToken, async (req, resp) => {
    let result = await Cart.updateOne(
        { _id: req.params.id },
        { $set: { quantity: req.body.quantity } }
    );
    resp.send(result);
});

// admin dashboard
app.get("/dashboard", verifyToken, async (req, resp) => {

    try {

        const totalProducts = await Product.countDocuments()
        const totalOrders = await Order.countDocuments()
        const totalUsers = await User.countDocuments()

        const orders = await Order.find()

        let revenue = 0
        orders.forEach(o => {
            revenue += o.totalAmount || 0
        })

        resp.send({
            totalProducts,
            totalOrders,
            totalUsers,
            revenue
        })

    } catch (error) {
        console.log(error)
        resp.status(500).send({
            result: "Dashboard Error"
        })
    }
})

// cancel order
app.put("/cancel-order/:id", verifyToken, async (req, resp) => {

    try {

        const result = await Order.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    status: "Cancelled",
                    cancelReason: req.body.cancelReason
                }
            }
        )

        resp.send({
            result: "Order Cancelled",
            data: result
        })

    } catch (error) {

        console.log(error)

        resp.status(500).send({
            result: "Error cancelling order"
        })
    }
})


app.listen(5000)