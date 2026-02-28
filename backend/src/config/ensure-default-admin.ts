import { prisma } from './database.config';
import { hashPassword } from '../utils/password.utils';

/**
 * If ADMIN_EMAIL and ADMIN_PASSWORD are set, ensures a user with that email exists
 * (creates one with role admin if missing). Safe to run on every startup; no-op when
 * env is unset or user already exists. Use in production to get a default admin without seeding.
 */
export async function ensureDefaultAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_FULL_NAME?.trim() || 'Admin';

  if (!email || !password) {
    return;
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return;
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: 'admin',
      },
    });
    console.log(`Default admin ensured: ${email}`);
  } catch (err) {
    console.error('Failed to ensure default admin:', err);
    // Do not throw – allow server to start (e.g. DB temporarily unavailable)
  }
}
