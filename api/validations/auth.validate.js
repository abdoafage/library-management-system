import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const { access_token } = req.cookies;

  if (!access_token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(access_token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }

      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = decoded;
    next();
  });
};

export { authenticate };
