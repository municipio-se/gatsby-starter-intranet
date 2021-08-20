import { loadConfig } from "@municipio/gatsby-theme-intranet";
import { createProxyMiddleware } from "http-proxy-middleware";

loadConfig();

export const developMiddleware = (app) => {
  if (process.env.API_PROXY) {
    app.use(
      "/api",
      createProxyMiddleware({
        target: process.env.API_PROXY,
        secure: !process.env.API_PROXY_INSECURE,
        changeOrigin: true,
        followRedirects: false,
      })
    );
  }
};

export const siteMetadata = {
  siteUrl: process.env.GATSBY_SITE_URL,
  title: `Municipio`,
  description: `Starter site using Wordpress and Gatsby`,
};

export const plugins = [
  "gatsby-plugin-remove-serviceworker",
  {
    resolve: `@municipio/gatsby-theme-intranet`,
    options: {
      basePath: __dirname,
      fragmentsDir: `${__dirname}/src/fragments`,
      i18next: {
        defaultLanguage: "sv",
        languages: ["sv", "en"],
      },
      wp: {
        url: `${process.env.GATSBY_WORDPRESS_URL}/graphql`,
        refetchInterval: process.env.WORDPRESS_REFETCH_INTERVAL,
      },
      auth: {
        requireLogin: false,
      },
      // XXX: postcss.config.js doesn’t seem to load automatically
      postCss: { postcssOptions: require("./postcss.config")() },
    },
  },
];
