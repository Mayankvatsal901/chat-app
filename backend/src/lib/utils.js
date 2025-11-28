const jwt = require("jsonwebtoken");

function generateToken(userId, res) {
    const token = jwt.sign({ userId }, process.env.SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,          // MUST be true on Render (HTTPS)
        sameSite: "none",      // Allows cross-domain cookies
    });

    return token;
}

module.exports = generateToken;
