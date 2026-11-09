// Backend/utils/generateToken.js
import jwt from 'jsonwebtoken';

// Creates a signed JWT containing the user's id, valid for 30 days
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;