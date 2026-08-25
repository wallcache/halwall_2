import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    /*
      Two hosts, both The Daily Canon's own: the public bucket the app uploads
      rendered quote cards to, and the fixed set of author portraits a reader
      picks an avatar from. Narrow patterns rather than a wildcard, so this
      cannot be turned into an open image proxy for the whole internet.
    */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dbrscklixweidxwtqckf.supabase.co",
        pathname: "/storage/v1/object/public/quote-cards/**",
      },
      {
        protocol: "https",
        hostname: "thedailycanon.org",
        pathname: "/avatars/**",
      },
    ],
  },
  /**
   * private-media/ is read at runtime by the gated route handler and imported
   * by nothing, so tracing has to be told about it explicitly.
   */
  outputFileTracingIncludes: {
    "/api/gated/[...path]": ["./private-media/**/*"],
  },
  /**
   * The old URLs are indexed. Every one of them keeps working.
   * 308 rather than 302: these moves are permanent.
   */
  async redirects() {
    return [
      { source: "/photography", destination: "/making/photography", permanent: true },
      { source: "/logos", destination: "/making/identity", permanent: true },
      { source: "/logos/:slug", destination: "/making/identity/:slug", permanent: true },
      { source: "/animations", destination: "/making/motion", permanent: true },
      { source: "/hiking-journal", destination: "/walking", permanent: true },
      { source: "/hiking-journal/:slug", destination: "/walking/:slug", permanent: true },
      { source: "/daily-canon", destination: "/canon", permanent: true },
    ];
  },
};

export default nextConfig;
