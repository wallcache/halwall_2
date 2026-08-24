import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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
