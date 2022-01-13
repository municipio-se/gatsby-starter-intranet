import { loadConfig } from "@municipio/gatsby-theme-intranet";
import { createProxyMiddleware } from "http-proxy-middleware";

loadConfig();

function falsey(value) {
  try {
    return !JSON.parse(value);
  } catch {
    return !value;
  }
}

function truey(value) {
  try {
    return !!JSON.parse(value);
  } catch {
    return !!value;
  }
}

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
        url: process.env.GATSBY_WORDPRESS_URL,
        refetchInterval: process.env.WORDPRESS_REFETCH_INTERVAL,
        nodesPerFetch: Number(process.env.WORDPRESS_NODES_PER_FETCH),
      },
      auth: {
        requireLogin: REQUIRE_LOGIN,
      },
      // XXX: postcss.config.js doesn’t seem to load automatically
      postCss: { postcssOptions: require("./postcss.config")() },
    },
  },
];
