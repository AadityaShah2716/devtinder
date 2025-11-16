const authMiddleware = (req, res, next) => {
    const token = "xyz";
    const isAdminAuthenticated = token === "xyz";
    if (!isAdminAuthenticated) {
        res.status(401).send("Unauthorized");
    }
    else {
        next()
    }
}
module.exports = authMiddleware 