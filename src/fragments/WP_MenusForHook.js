import { graphql } from "gatsby";

export const query = graphql`
  fragment WP_MenusForHook on WP {
    menus(first: 1000) {
      nodes {
        menuItems(first: 10000) {
          nodes {
            connectedObject {
              ... on WP_Page {
                id
                contentType {
                  node {
                    name
                  }
                }
                ...WP_PageForMenuItem
              }
            }
            label
            description
            url
            target
            ...WP_MenuItem
          }
        }
        locations
      }
    }
  }
`;
