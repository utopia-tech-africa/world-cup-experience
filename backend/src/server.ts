import 'dotenv/config';
import app from './app';
import { ensureDefaultAdmin } from './config/ensure-default-admin';
import { ensureDefaultPackageTypes } from './config/ensure-default-package-types';
import { ensureDefaultPackages } from './config/ensure-default-packages';

const PORT = process.env.PORT || 5000;

async function start() {
  await ensureDefaultAdmin();
  await ensureDefaultPackageTypes();
  await ensureDefaultPackages();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}

start();
