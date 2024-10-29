const Jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).send("Access Denied Token not find");
    }
    try {
        const decode = Jwt.verify(token, process.env.JwtPrivateKey);

        req.user = decode;
        next();
    }
    catch (ex) {
        res.status(400).send("invalid token");
    }
}