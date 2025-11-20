const express = require('express');
const adminauth = require('../middleware/auth');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user')
app.use(express.json());
// app.use("/admin", adminauth);
// app.get("/admin", (req, res) => {
//     res.send("I am admin");
// })

// app.get("/admin/delete", (req, res) => {
//     res.send("delete a user");
// })

// app.get('/user', (req, res, next) => {
//     console.log("Handling the route user")
//     next();
//     // res.send("Response!!")

// },
//     (req, res, next) => {
//         console.log("Handling the route user 2!")
//         next();
//         // res.send("2nd Response!!")
//     },
//     (req, res, next) => {
//         console.log("Handling the route user 3!")
//         next()

//         res.send("3rd Response!!")
//     },
//     (req, res) => {
//         console.log("Handling the route user 4!")
//         res.send("4th Response!!")
//     }
// )


// use interrupt route it is eligible for all routes thats why order matters
// app.get("/user/:userId/:name/:password", (req, res) => {
//     console.log(req.params);
//     res.send({ firstName: "Akshay", lastName: "Saini" })x`
// })
// In * betwenn a and c any alphabet allowed
// In + compulesory abc is ther in between b and c any alphabet allowed
// In ? it is optional
// app.post('/user', (req, res) => {
//     res.send('Data send successfully');
// })
// app.delete('/user', (req, res) => {
//     res.send('Delete data successfully');
// })
// app.use("/test", (req, res) => {
//     res.send("Hello test");
// })

// the above function is call request handler function


// app.get("/user", (req, res, next) => {
//     console.log("Handling the route user 2!");
//     // res.send("2nd Route Handler");
//     next()
// })

// app.get("/user", (req, res, next) => {
//     console.log("Handling the route user!");
//     // next();
// })

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User Added Successfully")
    } catch (err) {
        res.status(400).send("Error saving the user:" + err.message)
    }
})
connectDB().then(() => {
    console.log("Database connection established")
    app.listen(7777, () => {
        console.log("Server is successfully running on port")
    })
}).catch(err => {
    console.error('Database connection not established')
})
