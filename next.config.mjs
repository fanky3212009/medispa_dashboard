import { exec } from 'child_process';
import { promisify } from 'util';


const execAsync = promisify(exec);

const generatePrisma = async () => {
  if (process.env.NODE_ENV === 'production') {
    try {
      await execAsync('prisma generate');
    } catch (error) {
      console.error('Error generating Prisma Client:', error);
    }
  }
};

let userConfig = undefined;
try {
  userConfig = await import('./v0-user-next.config');
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdfkit"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      generatePrisma();
    }
    return config;
  },
  output: 'standalone',
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true
  },
  outputFileTracingIncludes: {
    '/*': ['./node_modules/.prisma/**/*']
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
