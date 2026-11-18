import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TB Secret Santa",
    short_name: "TB Santa",
    start_url: "/",
    display: "standalone",
    background_color: "#30653d",
    theme_color: "#30653d",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
