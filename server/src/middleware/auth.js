import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    // 401, not 403: the caller is not authenticated. 403 is reserved for
    // "authenticated but not allowed", such as a workspace non-member.
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
