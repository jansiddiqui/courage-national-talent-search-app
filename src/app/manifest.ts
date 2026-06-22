import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Courage National Talent Search",
    short_name: "CNTS",
    description: "Courage National Talent Search (CNTS) is the official talent discovery and assessment program operated by Courage Library.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a", // slate-900
    theme_color: "#1e40af", // blue-800
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
