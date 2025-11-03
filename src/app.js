const express = require('express');

const app = express();

app.use((req, res) => {
    res.send("Hello from the server");
})
// the above function is call request handler function
app.listen(3000, () => {
    console.log("Server is successfully running on port")
})