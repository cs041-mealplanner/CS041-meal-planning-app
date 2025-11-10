import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export function signAccessToken(
  payload: { id: string; email: string },
  expiresIn: SignOptions['expiresIn'] = '15m',
): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret not configured');
  }
  const opts: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, opts);
}

export async function issueRefreshToken(userId: string, meta?: { userAgent?: string; ip?: string }, ttlDays = 30) {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error('Refresh token secret not configured');
  const tokenId = crypto.randomUUID();
  const payload = { sub: userId, jti: tokenId } as Record<string, unknown>;
  const opts: SignOptions = { expiresIn: `${ttlDays}d` };
  const raw = jwt.sign(payload, secret, opts);
  const tokenHash = await bcrypt.hash(raw, 10);
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      userId,
      tokenHash,
      expiresAt,
      userAgent: meta?.userAgent,
      ip: meta?.ip,
    },
  });
  return raw;
}

export async function rotateRefreshToken(oldToken: string, meta?: { userAgent?: string; ip?: string }, ttlDays = 30) {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error('Refresh token secret not configured');
  let decoded: any;
  try {
    decoded = jwt.verify(oldToken, secret) as { sub: string; jti: string };
  } catch {
    throw new Error('Invalid or expired refresh token');
  }
  const rec = await prisma.refreshToken.findFirst({
    where: { id: decoded.jti, userId: decoded.sub as string, revokedAt: null },
  });
  if (!rec) throw new Error('Refresh token not found or revoked');
  const ok = await bcrypt.compare(oldToken, rec.tokenHash);
  if (!ok) throw new Error('Refresh token mismatch');
  // revoke old
  await prisma.refreshToken.update({ where: { id: rec.id }, data: { revokedAt: new Date() } });
  // issue new
  const newToken = await issueRefreshToken(decoded.sub as string, meta, ttlDays);
  return { userId: decoded.sub as string, token: newToken };
}

export async function revokeRefreshToken(token: string) {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) throw new Error('Refresh token secret not configured');
  let decoded: any;
  try {
    decoded = jwt.verify(token, secret) as { sub: string; jti: string };
  } catch {
    return; // already invalid
  }
  await prisma.refreshToken.updateMany({
    where: { id: decoded.jti, userId: decoded.sub as string, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}


