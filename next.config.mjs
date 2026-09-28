import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx', 'md'],
  images: {
    /* Only host the site actually loads remote imagery from (testimonial
       avatars). The old unsplash/twimg/behance/sanity/aceternity entries
       served components and routes that no longer exist. */
    remotePatterns: [{ protocol: 'https', hostname: 'media.licdn.com' }],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
