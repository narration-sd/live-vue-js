<p align="center">
  <a href="https://www.gatsbyjs.org">
    <img alt="Gatsby" src="https://www.gatsbyjs.org/monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Live Vue Gatsby demo site
</h1>

I'll leave Gatsby's tips at the bottom, since this site is based on the basic Gatsby demo. It is however a fully configured site for both Gatsby and recent CraftCms 3. The basis of a Vagrant vm is also included.

## Getting started

1. Clone this entire site from its repo, which you'll have been informed of for the Beta.
1. Run `npm install` to get required general packages
1. Run `npm install -g gatsby-cli` to install Gatsby globally as they recommend, if you haven't already.
1. Run `composer install`, which will get you the live-vue-js package installed directly in `/src`, as well as a complete CraftCMS installation plus configuration you can tune and use if you'd like to run it using Vagrant.

1. You can then immediately try the following, which starts `gatsby develop`, however with a changed port, since there are typically things running already on Gatsby's default 8000.
   ```
      npm run dev
   ```

1. Click the link to visit the dev server, and you should see a near-stock basic Gatsby demo first page.
1. Click the link on that page to go to the demo Cards page. You'll see a set of cards, very barebones, with title, body text, and a picture. 
1. Note that the Gatsby site is very fast, as it should be, while you'll soon learn that it's showing so with the Live Vue React code already operating. It doesn't interfere with your operational built Gatsby site.

1. This has worked because Gatsby is configured in this repo to pull its build-states GraphQL off https://staging.narrationsd.com's Craft CMS, giving you the immediately viewable content.
1. You can also run `gatsby build`, which will produce the `/public` directory with the built Gatsby site. 
1. To use this, you'll need a web server, so it's also time to bring Craft into the picture.

## Preparing the Craft site 

1. If you have a workable recent Craft (version 3.1.14 or better I believe) installation, you can use it.
1. To run with the available Vagrant vm, adjust the config in `Homestead.yaml` to suit. Then with a `vagrant up`, your server will appear with Live Vue needs loaded, and nginx properly set to run separate instances for the web sites.
1. What kind of DNS/hosts file configuration does Live Vue Gatsby require? You'll need to have separate URLs and server instances for Craft operating fron /web, and for the Gatsby site itself, in /public. 
1. It can be convenient to have the Craft headless server on `site.domain.com`, while the Gatsby live server is on `domain.com` .
1. Vagrant will take care of synchronizing all needs at boot-up or reload, given you've got command-line rsync installed on your source machine. If you use a separate server, appropriately arrange to upload at least the `/templates/lv-gatsby-index.html` file and the `/templates/cardz` folder, the` /config/live-vue.php` file, and probably the /web/resources assets.
1. With a fresh server, you'll run through the short CraftCMS install to set what you want.
1. Once you've got your Craft vm or server site up, log in as admin, and 
## Craft configuration
1.The Craft schema for this demo is very simple. You'll need to make two fields:
   a. body, as a Redactor or other rich text field
   b. images, as an image Assets field
   
1. To match, you'll want a Setting>Assets configuration to use the `/web/resouces/images` folder, and to have run Update Asset Indexes from `Craft>Utilities`. 
1. You'll also need an `Assets Image Transform` named `Card Image`, with settings Scale to Fit and 600x400.
1. To complete, make a new Section named `Cards`, and put your fields in it. 
1. Now you can run Craft, and edit the cards to have titles, body text, and an image. You can run the Craft website with `https://your.domain.com/cardz` to see a listing page of the Cards. 
1. Three Cards is a good number.

## Live Vue configuration.

How do we get Live Preview into operation? You've installed the Live Vue plugin, and noticed the cat at his evening window icon. Now we'll use that to complete setup.
1. Open Live Vue Settings from the Settings>Plugins page or from its menu item and icon at left of the CP.
. You'll need to add just one row to the Endpoints to run the demo. Enter the following, and then Save:
    - Path Signature: `cards`
    - Endpoint Template: `page-cards`
    - Data Type: select `Gatsby`
    - Endpoint or Script: `Cards`
1. This row will match any card you edit, and run it with the GraphQL script named `Cards`, which you find in `config/live-vue.php`.
1. For future page types, you make the CraftQL script by copying the GraphQL query in your Page file, deleting the `craftql {}` bracketing, and removing the `CRAFTQL_` prefix from all query lines, to make a normal query. Those tag lines are named from your `gatsby-config.js` configuration of the `gatsby-source-graphql` plugin.

## Running Live Vue

Once you have these points set up, you're ready to see each of your Cards live in their Gatsby page, following every change you make while editing their content.

When you finish editing, Save normally to update Craft's database. Then to publish the results, run `gatsby build`, followed by uploading the `/public` directory to the website. 

Now your edits are out, and available at Gatsby speed.






# Original Gatsby Demo site instructions

## 🚀 Quick start

1.  **Create a Gatsby site.**

    Use the Gatsby CLI to create a new site, specifying the default starter.

    ```sh
    # create a new Gatsby site using the default starter
    npx gatsby new my-default-starter
    ```

1.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```sh
    cd my-default-starter/
    gatsby develop
    ```

1.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!
    
    *Note: You'll also see a second link: `http://localhost:8000/___graphql`. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql).*
    
    Open the `my-default-starter` directory in your code editor of choice and edit `src/pages/index.js`. Save your changes and the browser will update in real time!
    
## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── .gitignore
    ├── .prettierrc
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── yarn.lock

  1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.  
  
  2.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.
  
  3.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.
  
  4.  **`.prettierrc`**: This is a configuration file for [Prettier](https://prettier.io/). Prettier is a tool to help keep the formatting of your code consistent.
  
  5.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.
  
  6.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.org/docs/gatsby-config/) for more detail).
  
  7.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.
  
  8.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.org/docs/ssr-apis/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.
  
  9.  **`LICENSE`**: Gatsby is licensed under the MIT license.
  
  10.  **`package-lock.json`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. **(You won’t change this file directly).**
  
  11.  **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.
  
  12.  **`README.md`**: A text file containing useful reference information about your project.
  
  13.  **`yarn.lock`**: [Yarn](https://yarnpkg.com/) is a package manager alternative to npm. You can use either yarn or npm, though all of the Gatsby docs reference npm.  This file serves essentially the same purpose as `package-lock.json`, just for a different package management system.

## 🎓 Learning Gatsby

Looking for more guidance? Full documentation for Gatsby lives [on the website](https://www.gatsbyjs.org/). Here are some places to start:

-   **For most developers, we recommend starting with our [in-depth tutorial for creating a site with Gatsby](https://www.gatsbyjs.org/tutorial/).** It starts with zero assumptions about your level of ability and walks through every step of the process.

-   **To dive straight into code samples, head [to our documentation](https://www.gatsbyjs.org/docs/).** In particular, check out the _Guides_, _API Reference_, and _Advanced Tutorials_ sections in the sidebar.

## 💫 Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gatsbyjs/gatsby-starter-default)
