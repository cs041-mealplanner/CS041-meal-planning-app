import { Router } from 'express';
import { authSchema } from '../../utils/validation';
import { login, logout, refresh, signup } from './service';

const router = Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const result = await signup(email, password, { userAgent: req.headers['user-agent'], ip: req.ip });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const result = await login(email, password, { userAgent: req.headers['user-agent'], ip: req.ip });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const token = String(req.body?.refreshToken || '');
    const result = await refresh(token, { userAgent: req.headers['user-agent'], ip: req.ip });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const token = String(req.body?.refreshToken || '');
    const result = await logout(token);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;


