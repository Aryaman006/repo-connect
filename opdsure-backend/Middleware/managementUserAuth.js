const jwt = require("jsonwebtoken");
const config = require("../Config");
const { CONSTANTS_MESSAGES } = require("../Helper");
const { StatusCodes } = require("http-status-codes");
const { ManagementAuthDal } = require("../DAL");
const { ApiError } = require("../Utils");

const ManagementUsersAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
      throw new ApiError(CONSTANTS_MESSAGES.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
    }
    const tokenValue = token.split(' ')[1];
    const decodedToken = await new Promise((resolve, reject) => {
      jwt.verify(tokenValue, config.JWT_PRIVATE_KEY, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });

    const { _id } = decodedToken;
    const managmentUser = await ManagementAuthDal.GetUser({ _id });

    if (!managmentUser) {
      throw new ApiError(CONSTANTS_MESSAGES.MANAGEMENT_USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (!managmentUser.token.includes(tokenValue)) {
      throw new ApiError(CONSTANTS_MESSAGES.INVALID_TOKEN, StatusCodes.UNAUTHORIZED);
    }

    req.token = tokenValue;
    req.managmentUser = managmentUser;
    next();
  } catch (error) {
    console.error("Error in AdminAuth middleware:", error);
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = ManagementUsersAuth;