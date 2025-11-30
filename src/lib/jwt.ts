import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface CustomJWTPayload {
  id: string;
  email: string;
  role: string;
}

export function signToken(payload: CustomJWTPayload): string {
  return jwt.sign(
    { ...payload }, // Spread operator use করলাম
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions // Type assertion
  );
}

export function verifyToken(token: string): CustomJWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJWTPayload;
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}