const express = require('express');
const adminauth = require('../middleware/auth');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user');
const { use } = require('react');
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

app.get('/user', async (req, res) => {
    const useremail = req?.body?.emailId;
    try {
        const user = await User.findOne({ emailId: useremail });
        if (!user) {
            res.status(404).send("User Not found");
        }
        else {
            res.send(user);
        }

    } catch (err) {
        res.status(400).send("Error saving the user:" + err.message)
    }
})


app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send("User Not Found");
        }
        else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Error saving the feed:" + err.message);
    }
})

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
})
app.patch('/user/:userId', async (req, res) => {
    const userId = req?.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_FIELDS = ["photoUrl", "about", "skills"];
        const isupdateAllowed = Object.keys(data).every((k) => ALLOWED_FIELDS.includes(k));
        if (!isupdateAllowed) {
            throw new Error("Update not allowed")
        }
        if (data?.skills?.length > 15) {
            throw new Error("Skill is allowed only 15");
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            runValidators: true
        });
        console.log("user", user);
        res.send("User updated successfully");
    } catch (error) {
        res.status(400).send("UPDATE FAILED:" + error?.message);
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
