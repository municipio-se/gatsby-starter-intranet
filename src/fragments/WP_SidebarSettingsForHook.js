import { graphql } from "gatsby";

export const query = graphql`
  fragment WP_SidebarSettingsForHook on WP {
    municipioIntranetSidebarSettings {
      tools {
        tools {
          label
          url
        }
      }
    }
  }
`;
