import jwt, { SignOptions } from 'jsonwebtoken';

const DEFAULT_SIGN_OPTION: SignOptions = {
  expiresIn: '7d', // 7 days token validity
};

export const signJwtAccessToken = (payload: object, options: SignOptions = DEFAULT_SIGN_OPTION) => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not defined in .env");
  
  const token = jwt.sign(payload, secret, options);
  return token;
};

export const verifyJwt = (token: string) => {
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) throw new Error("AUTH_SECRET is not defined in .env");
    
    return jwt.verify(token, secret);
  } catch (error) {
    console.log(error);
    return null;
  }
};