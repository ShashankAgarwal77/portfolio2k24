import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx', 'md'],
  images: {
    domains: [
      'images.unsplash.com',
      'pbs.twimg.com',
      'media.licdn.com',
      'mir-s3-cdn-cf.behance.net',
      'cdn.sanity.io',
      'aceternity.com',
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
