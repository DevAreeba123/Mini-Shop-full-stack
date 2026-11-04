// Backend/utils/generateToken.js
import jwt from 'jsonwebtoken';

/**
 * Retrieves the active JWT Secret with an automatic fallback if environment variable is dummy/unset
 * @returns {string} - Valid signing key
 */
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  const dummySecrets = [
    'YOUR_SECRET_KEY',
    'YOUR_JWT_SECRET',
    'YOUR_SECRET',
    '<secret>',
    'placeholder',
  ];

  if (!secret || secret.trim() === '' || dummySecrets.includes(secret.trim())) {
    // Robust development fallback secret
    return 'minishop_fallback_jwt_production_ready_secret_key_2026_safe_hash';
  }
  return secret.trim();
};

/**
 * Generate a signed JWT token containing the user's ID
 * @param {string} id - The MongoDB User ID
 * @returns {string} - Signed JWT token string
 */
const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: '30d',
  });
};

export default generateToken;
