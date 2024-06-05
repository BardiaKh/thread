/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  basePath: '/hecks',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/hecks/' : '',
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/ingest/:path*",
        destination: "https://app.posthog.com/:path*",
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.test\.ts$/,
      loader: 'ignore-loader',
      });
      config.module.rules.push({
        test: /__tests__/,
        loader: 'ignore-loader',
      });
    }
    return config;
  },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below
const { withSentryConfig } = require("@sentry/nextjs");

const withTM = require('next-transpile-modules')(['react-chart-editor']);


module.exports = withSentryConfig(
  withTM(module.exports),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "squaredtechnologiesinc",
    project: "noterous",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    enableTracing: false,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
