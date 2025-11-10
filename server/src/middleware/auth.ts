import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type JwtPayload = { id: string; email: string; iat?: number; exp?: number };

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  if (!token) {
    return res.status(401).json({ error: true, message: 'Missing Authorization header' });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: true, message: 'JWT secret not configured' });
  }
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    (req as any).user = { id: decoded.id, email: decoded.email };
    return next();
  } catch {
    return res.status(401).json({ error: true, message: 'Invalid or expired token' });
  }
}


