// envConfig.ts

import * as fs from 'node:fs';
import * as path from 'node:path';

function parseEnv() {
  const env = path.resolve('.env');

  if (!fs.existsSync(env)) throw new Error('缺少环境配置文件');
  
  return { path: env };
}

export default parseEnv();
