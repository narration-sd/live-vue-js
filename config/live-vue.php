<?php

$gqlScript1 = <<<'EOT'
query Navigation {
  navigation: entries(section: pages, level: 1) {
    ... on PagesPage {
      title
      level
      uri
      url
      children {
        ... on PagesPage {
          title
          level
          uri
          url
          children {
            id
          }
        }
      }
    }
  }
}
EOT;

$gqlScript2 = <<<'EOT'
# This shows a way to make the recursive base navigation clearer,
# using fragments.

# Along with this, there's example of GraphQL includin a second element, 
# in this case, events.

fragment navFields on PagesPage {
  title
  level
  uri
  children {
    id
  }
}

# awkward, but this is the Facebook/GraphQL insisted way.
# why they don't just provide a limit factor on recursions, ??
fragment recursive2Nav on PagesPage {
    ...navFields
    children {
      ...navFields
    }
}

query Navigation {
  # indeed, this becomes very simple
  navigation: entries(section: pages, level: 1) {
    ...recursive2Nav
  }
  
  # an extra unrelated item, because we can
  events: entries(section: events) {
    ... on EventsEvent {
      id
      eventTime
      sidebar {
        totalPages
        content
      }
    }
  }
}
EOT;

$gqlScript3 = <<< 'EOT'
fragment navFields on PagesPage {
  title
  level
  uri
  children {
    id
  }
}

fragment recursive2Nav on PagesPage {
  ...navFields
  children {
    ...navFields
  }
}

query homePage {
  nav: entries(section: pages, level: 1) {
    ...recursive2Nav
  }
  home: entries(section: home) {
    ... on Home {
      title
      aDate: postDate
      top3MSlider {
        ... on Top3MSliderUnion {
          ... on Top3MSliderCustomSlide {
            __typename
            id
            slideTitle
            slideContentText {
              totalPages
              content
            }
            slideImage {
              id
            }
            slideLink
          }
        }
      }
    }
  }
}

EOT;

$gqlScript4 = <<< 'EOT'
fragment navFields on PagesPage {
  title
  level
  uri
  id
  children {
    id
  }
}

fragment recursive2Nav on PagesPage {
  ...navFields
  children {
    ...navFields
     children {
      ...navFields
    }
  }
}

query page($id: [Int] ) {
  nav: entries(section: pages, level: 1) {
    ...recursive2Nav
  }
  pageContent: entries(id: $id, section: pages) {
    ... on PagesPage {
      title
      uri
      id
      postDate @date(as: "j F Y")
      mainContent: pageMContent {
        type:__typename
        ... on PageMContentTextArea {
          textArea {
            totalPages
            content
          }
        }
        ... on PageMContentAccordion {
          title: accordionTitle
          content: accordionContent
        }
      }
    }
  }
}
EOT;

$gqlScript5 = <<< 'EOT'
fragment navFields on PagesPage {
  title
  level
  uri
  id
  children {
    id
  }
}

fragment recursive2Nav on PagesPage {
  ...navFields
  children {
    ...navFields
     children {
      ...navFields
    }
  }
}

query page($id: [Int] ) {
  nav: entries(section: pages, level: 1) {
    ...recursive2Nav
  }
  pageContent: entries(id: $id) {
    ... on Tingleton {
      title
      uri
      id
      postDate @date(as: "j F Y")
      mainContent: pageMContent {
        type:__typename
        ... on PageMContentTextArea {
          textArea {
            totalPages
            content
          }
        }
        ... on PageMContentAccordion {
          title: accordionTitle
          content: accordionContent
        }
      }
    }
  }
}

EOT;

$gqlScript6 = <<< 'EOT'
fragment navFields on PagesPage {
  title
  level
  uri
  id
  children {
    id
  }
}

fragment recursive2Nav on PagesPage {
  ...navFields
  children {
    ...navFields
    children {
      ...navFields
    }
  }
}

query page($id: [Int], $site: String, $idNot: [Int]) {
  nav: entries(section: pages, level: 1, idNot: $idNot) {
    ...recursive2Nav
  }
  pageContent: entries(id: $id, site: $site, section: pages) {
    ... on PagesPage {
      title
      uri
      id
      postDate @date(as: "j F Y")
      mainContent: pageMContent {
        type: __typename
        ... on PageMContentTextArea {
          textArea {
            totalPages
            content
          }
        }
        ... on PageMContentAccordion {
          title: accordionTitle
          content: accordionContent
        }
      }
    }
  }
}
EOT;

$gqlScript7 = <<<'EOT'
query Cards ($idNot: [Int]) {
  cards: entries (section: cards, idNot: $idNot) {
    ...on Cards {
      title
      body {
        content
      }
      image {
        id
        url
      }
    }
  }
}
EOT;

$gqlScript8 = <<<'EOT'
query Cards ($id: [Int], $idNot: [Int], 
  $uri: String) {
  cards: entries (section: cards, 
    uri: $uri, id: $id, idNot: $idNot, orderBy: "postDate asc") {
    ...on Cards {
      id
      uri
      title
      body {
        content
      }
      image {
        id
        title
        url(transform: originalCards)
      }
    }
  }
}
EOT;

$gqlScript9 = <<<'EOT'
query Cards ($id: [Int], $idNot: [Int], 
  $uri: String) {
  cards: entries (section: cards, 
    uri: $uri, id: $id, idNot: $idNot, orderBy: "postDate asc") {
    ...on Cards {
      id
      uri
      title
      level
      body {
        content
      }
      image {
        id
        title
        url(transform: originalCards)
      }
    }
  }
}
EOT;

$gqlScript10 = <<<'EOT'
query Cards ($id: [Int], $uri: String) {
  cards: entries (section: cards, 
    uri: $uri, id: $id, orderBy: "postDate asc") {
    ...on Cards {
      id
      uri
      title
      level
      body {
        content
      }
      image {
        id
        title
        url(transform: originalCards)
      }
    }
  }
}
EOT;

// now collect the scripts from the texts

return [
    // first, set up logging for live-vue-js on the browser
    'lvDevMode' => true,
    'apiDevMode' => false,
    'dataDevMode' => false,
    'routerDevMode' => false, // not active at present
    // list here CORS-allowable urls -- '*' would be completely open, if you want that...
    'allowedOrigins' => [
        'http://localhost:8080',
        '*', // open, if you want that...
    ],
    'gqlScripts' => [
        'Navigation' => [
            'tokenName' => 'koty-ou', // a token configured with permissions in GraphQL admin
            'query' => $gqlScript1,
        ],
        'Navigation2' => [
            'tokenName' => 'koty-ou', // a token configured with permissions in GraphQL admin
            'query' => $gqlScript2,
        ],
        'Home' => [
            'tokenName' => 'koty-ou', // a token configured with permissions in GraphQL admin
            'query' => $gqlScript3,
        ],
        'Page' => [
            'tokenName' => 'koty-ou', // a token configured with permissions in GraphQL admin
            'query' => $gqlScript6,
        ],
        'Tingle' => [
            'tokenName' => 'koty-ou', // a token configured with permissions in GraphQL admin
            'query' => $gqlScript5,
        ],
        'Cards' => [
            'tokenName' => 'lv-test-open', // a token configured with permissions in GraphQL admin
            'query' => $gqlScript9,
        ],
        'CardsLevel' => [
            'tokenName' => 'lv-test-open', // a token configured with permissions in GraphQL admin
            'query' => $gqlScript9,
        ],
    ],
];
