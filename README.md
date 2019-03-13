<p align="center">
  <a href="https://www.gatsbyjs.org">
    <img alt="Gatsby" src="https://www.gatsbyjs.org/monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Live Vue Gatsby demo site
</h1>

![Content Editing with Live Vue Gatsby](https://site.staging.narrationsd.com/docimages/live-vue-gatsby.png)

**Editing Gatsby Pages directly in Craft CMS, with Live Vue Gatsby** 
## Introduction

This repository will give you a full installation of Gatsby operating from headless CraftCMS, demonstrating instant live CP previews during editing of the resulting Gatsby site. 

This is accomplished through  use of the forthcoming Live Vue Gatsby.

The basis of a Vagrant vm is also included, so that you can run the complete live website and Craft editing demonstraton from a laptop.

## Getting started

1. Clone this website from its repo, which you'll have been informed of for the Beta.

1. Run `npm install -g gatsby-cli` to install Gatsby globally, as recommended by the Gatsby team, if you haven't already.

1. Run `npm install` to load required general packages

1. Run `composer install`, which will provide the live-vue-js package, installed directly in `/src`, as well as a complete CraftCMS installation including Live Vue and other plugins. 
    
   The website also includes configuration you can tune and use if you'd like to operate it using Vagrant.

1. You can then immediately try the following, which starts `gatsby develop`, however with a changed port, since there are typically things running already on Gatsby's default 8000.
   ```
      npm run dev
   ```

1. Click the link to visit the dev server, and you should see a near-stock basic Gatsby demo first page.

   Click the link on that page to go to the demo Cards page. You'll see a set of cards, very barebones, with title, body text, and a picture. 
   
   ![Content Editing with Live Vue Gatsby](https://site.staging.narrationsd.com/docimages/live-vue-demo-site.png)
   
   **Demo Site Gatsby Pages, on the development server** 
   
1. Note that even on the development server, pages are very fast, as they should be. This is because although Live Vue Gatsby is present, the design keeps it from interfering with your operational built Gatsby site.
   
   This instant demo has worked because Gatsby is configured to pull its build-states GraphQL from https://staging.narrationsd.com's Craft CMS, giving you the immediately viewable content. 
   
   You can change this later in the normal Gatsby config, to build from your own site.
   
1. When you're finished with first observations, you can stop the development server, and run `gatsby build`, which will produce the `/public` directory, home of the built Gatsby site.

1. To use this, you'll need a web server, so it's also time to bring Craft into the picture.

## Preparing the Craft site 

1. If you have a workable recent Craft installation(version 3.1.14 or better, due to some recent changes), you can use it for your demo site's headless CMS.

1. Alternatively, to run with a Vagrant vm, adjust the config in `Homestead.yaml` to suit, along with a matching hosts file line to provide an IP and DNS. 

   Then with a `vagrant up`, your server will appear with Live Vue requirements loaded, and `nginx` properly set to run separate instances for the Craft and Gatsby web sites.
   
   The convention is to have the Gatsby site on its base domain, and Craft on a subdomain, typically `site.domain.test/com`.
   
   Craft operates from its usual `/web` folder in the installation, and Gatsby from the `/public` folder which `gatsby build` will provision each time.
   
1. Vagrant will take care of synchronizing all needs at boot-up or reload, given you've got command-line rsync installed on your source machine. 

   If you use a separate server, appropriately arrange to upload at least the `/public` Gatsby folder, along with the usual `/web`, `/config`, and `/templates` folders for Craft.
   
1. With a fresh server, you'll run through the short CraftCMS install pages for the basis settings you want.

1. Once you've got your Craft vm or server site up, log in as admin, and proceed to configure the content for this demo website.

## Craft configuration

1.The Craft schema for this demo is very simple. You'll need to make two fields:
   a. `body`, as a Redactor or other rich text field
   b. `images`, as an image Assets field
   
1. For the images field, you'll want to provide a Setting>Assets configuration to name your assets, using the `/web/resources/images` folder.
 
   Then run Update Asset Indexes from `Craft>Utilities`, and finally, open and re-save your `images` field so that its assets will register.
 
1. You'll also need to set up a new `Assets>Assets Image Transform` named `Card Image`, with Scale to Fit and 600x400 properties.

1. To complete, make a new Section named `Cards`, and put your fields in it.

1. Now you can use Craft CP Entries as usual, and edit new Cards entries to have titles, body text, and an image. 
   
   To begin with for the demo, three Cards is likely a good number.

   You can run the Craft website with `https://your.domain.com/cardz` to see a simple Twig listing page of the Cards, to check they're present, before Live Vue is ready to give previews.

## Configuring Live Vue itself.

How do we get Live Preview into operation? 

You've installed the Live Vue plugin along with Redactor and CraftQL, and noticed the cat at his evening window icon, on this page:

   ![Craft Settings page with Live Vue Gatsby](https://site.staging.narrationsd.com/docimages/settings-w-plugins.png)
   
   **Craft Settings page with Live Vue Gatsby**
   
Now we'll use the plugin's settings to complete setup.

1. Open Live Vue Settings from the Settings page as you've just seen, or from its menu item with icon at left of the CP.

   Here's a view of that page, with all the basic configuration filled in and Saved.
   
   ![Content Editing with Live Vue Gatsby](https://site.staging.narrationsd.com/docimages/essential-live-vue-settings.png)
   
   **Content Editing with Live Vue Gatsby**
      
1. To provide the same for your new demo site,  you'll need to add just one row to the Endpoints table, from its initial blank state. 

   Enter the following, note your result looks like the screenshot above, and then Save:
    - Path Signature: `cards`
    - Endpoint Template: `page-cards`
    - Data Type: select `Gatsby`
    - Endpoint or Script: `Cards`
    - Notes: anything helpful to you about this routing.
    
1.  Let's understand the meanings of what you've just filled in and saved.

   By it's Path Signature `cards`, this row will match any card you edit, and run it with the GraphQL script named `Cards`. 
   
   You'll find `Cards` in the set of GraphQL scripts in the file `/config/live-vue.php`. Note how the scripts are conveniently entered so you can cut/paste them, then identify name and details at the bottom of the file.
   
1. Please note carefully how scripts for Live View are normal Graph/CraftQL queries, but that Gatsby's in-page queries are a little (but importantly) different. 

   As you probably know or will find in Gatsby documentation, its queries have an added bracketed enclosure and some added prefixes on top of the normal query, to match how the server is set up in your `gatsby-config.js` configuration of the `gatsby-source-graphql` plugin.

   For future page types, you can make the CraftQL script by copy-pasting the GraphQL query in your Page file, then deleting the `craftql {}` bracketing, and removing the `CRAFTQL_` prefix from all query lines. This will recover the normal query in an easy way.
   
   The following screenshots show the two forms of query via the nice Graphiql pages, first from Gatsby develop, and then from CraftQL in its CP page.
   
   First, the Gatsby version of the query:

![Gatsby Graphiql Cards query](https://site.staging.narrationsd.com/docimages/graphiql-page.png)

**The Cards query as the Gatsby page wants to see it** 

![CraftQL Graphiql Cards query](https://site.staging.narrationsd.com/docimages/craftql-site.png)

**The Cards query as the CraftQL script wants to see it**    
   
## Running Live Vue

Once you have the above Setup points arranged, you're ready to see each of your Cards live in their Gatsby page, following every change you make while editing their content.

When you finish editing, Save normally to update Craft's database. Then to publish the results, run `gatsby build`, followed by uploading the `/public` directory to the website. 

Now your edits are out, and available at Gatsby speed.

*n.b. Gatsby is pretty bad about housekeeping in the /public folder. JavaScript map files etc. will accumulate with each build, and while there is configuration that is supposed to prevent this, it isn't 100% effective at this point in Gatsby's rapid development.* 

   *Thus, before a final build, you may wish to clear out your /public folder, so the build's fresh files only will be present for upload. If you're not using rsync to transfer to Vagrant or a remote site, you'd want to do this there as well.*

<h3 style="text-align: center; margin: 0 auto;">Please Enjoy!</h3><br/>

Following are the original Gatsby Demo site instructions:

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
