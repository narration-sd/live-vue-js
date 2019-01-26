module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter'
  },
  plugins: [
    {
      resolve: "gatsby-source-graphql",
      options: {
        // This type will contain the remote schema Query type
        typeName: "CraftQL",
        // This is the field under which it's accessible
        fieldName: "craftql",
        // URL to query from
        url: "http://lv-demo.test/cqapi",
        // HTTP headers
        headers: {
          // Learn about environment variables: https://gatsby.app/env-vars
          Authorization: `bearer S2XedNbHI_QeON3J2RZ4YxstCTkBA7HxBk7n2FmecH0gsxGRe4wHao3E350Vdb3g`,
        },
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        // This type will contain remote schema Query type
        typeName: "SWAPI",
        // This is the field under which it's accessible
        fieldName: "swapi",
        // URL to query from
        url: "https://api.graphcms.com/simple/v1/swapi",
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png' // This path is relative to the root of the site.
      }
    },
    // {
    //   resolve: "gatsby-source-graphql",
    //   options: {
    //     // This type will contain the remote schema Query type
    //     typeName: "CraftQL",
    //     // This is the field under which it's accessible
    //     fieldName: "craftql",
    //     // URL to query from
    //     url: "https://lv-demo.test/cqapi",
    //   },
    // },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ]
}
