import { falsey, loadConfig, truey } from "@municipio/gatsby-theme-intranet";
import { createProxyMiddleware } from "http-proxy-middleware";

loadConfig();

const REQUIRE_LOGIN = truey(process.env.REQUIRE_LOGIN);

console.log(`REQUIRE_LOGIN = ${REQUIRE_LOGIN}`);

export const developMiddleware = (app) => {
  if (process.env.API_PROXY) {
    app.use(
      "/api",
      createProxyMiddleware({
        target: process.env.API_PROXY,
        secure: falsey(process.env.API_PROXY_INSECURE),
        changeOrigin: true,
        followRedirects: false,
        // subscribe to http-proxy's error event
        onError: function onError(err, req, res) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Something went wrong.");
        },
      }),
    );
  }
};

export const siteMetadata = {
  author: "Municipio",
  description: `Starter site using Wordpress and Gatsby`,
  siteUrl: process.env.GATSBY_SITE_URL,
  title: `Municipio Starter`,
};

export const plugins = [
  "gatsby-plugin-remove-serviceworker",
  {
    resolve: `@municipio/gatsby-theme-intranet`,
    options: {
      basePath: __dirname,
      fragmentsDir: `${__dirname}/src/fragments`,
      siteMetadata,
      i18next: {
        defaultLanguage: "sv",
        languages: ["sv", "en"],
      },
      wp: {
        url: process.env.GATSBY_WORDPRESS_URL,
        refetchInterval: process.env.WORDPRESS_REFETCH_INTERVAL,
        nodesPerFetch: Number(process.env.WORDPRESS_NODES_PER_FETCH),
      },
      auth: {
        requireLogin: REQUIRE_LOGIN,
      },
      search: {
        paths: ["sok", "en/search"],
      },
      disableSearchPlugin: false,
      disableDefaultArchivePages: false,
      siteIndex: {
        includePage: ({ page }) =>
          page.context.contentType && page.context.contentType.name === "page",
        localizations: {
          sv: {
            basePath: "/innehall",
            alphabet: Array.from("abcdefghijklmnopqrstuvwxyzåäö"),
            restInitial: {
              path: "/övriga-sidor",
              title: "Övriga sidor",
              label: "#",
            },
          },
          en: {
            basePath: "/content",
            alphabet: Array.from("abcdefghijklmnopqrstuvwxyz"),
            restInitial: {
              path: "/other-pages",
              title: "Other pages",
              label: "#",
            },
          },
        },
      },
      enableSEO: true,
      manifest: {
        name: siteMetadata.title,
        short_name: siteMetadata.title,
        start_url: "/",
        background_color: "#336699",
        theme_color: "#336699",
        display: "standalone",
        icon: "src/images/icon.png",
        crossOrigin: `use-credentials`,
        include_favicon: true,
      },
      robotsTxt: {
        host: `${siteMetadata.siteUrl}`,
        sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
        env: {
          development: {
            policy: [{ userAgent: "*", disallow: ["/"] }],
          },
          production: {
            policy: [{ userAgent: "*", allow: "/" }],
          },
        },
      },
      // XXX: postcss.config.js doesn’t seem to load automatically
      postCss: { postcssOptions: require("./postcss.config")() },
    },
  },
  {
    resolve: "@whitespace/gatsby-plugin-cookie-consent",
    options: { head: true },
  },
];
