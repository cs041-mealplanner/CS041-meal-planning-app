import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';
import { AuthenticationError, ValidationError } from '../../utils/errors';
import { issueRefreshToken, revokeRefreshToken, rotateRefreshToken, signAccessToken } from '../../utils/tokens';

export async function signup(email: string, password: string, meta?: { userAgent?: string; ip?: string }) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new ValidationError('Email already registered');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true },
  });
  const accessToken = signAccessToken({ id: user.id, email: user.email });
  const refreshToken = await issueRefreshToken(user.id, meta);
  return { user, accessToken, refreshToken };
}

export async function login(email: string, password: string, meta?: { userAgent?: string; ip?: string }) {
  const userRecord = await prisma.user.findUnique({ where: { email } });
  if (!userRecord) {
    throw new AuthenticationError('User not found');
  }
  const ok = await bcrypt.compare(password, userRecord.passwordHash);
  if (!ok) {
    throw new AuthenticationError('Invalid credentials');
  }
  const user = { id: userRecord.id, email: userRecord.email };
  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user.id, meta);
  return { user, accessToken, refreshToken };
}

export async function refresh(oldRefreshToken: string, meta?: { userAgent?: string; ip?: string }) {
  const { userId, token } = await rotateRefreshToken(oldRefreshToken, meta);
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true } });
  if (!user) throw new AuthenticationError('User not found');
  const accessToken = signAccessToken({ id: user.id, email: user.email });
  return { user, accessToken, refreshToken: token };
}

export async function logout(refreshToken: string) {
  await revokeRefreshToken(refreshToken);
  return { ok: true };
}


