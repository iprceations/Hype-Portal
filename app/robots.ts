import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://hype-portal.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/og/"],
        disallow: [
          "/api/",
          "/actions/",
          "/_next/",
          "/*.json$",
        ],
      },
      {
        // Disallow aggressive or unauthorized scrapers
        userAgent: [
          "PetalBot",
          "Bytespider",
          "Scrapy",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
