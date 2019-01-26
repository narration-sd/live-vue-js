/* eslint-disable */
import React, {Component} from 'react'
import {Link} from 'gatsby'
import { StaticQuery, graphql } from "gatsby"
import Reporter from '../live-vue-js/react/Reporter.jsx'

import Layout from '../components/layout'

class FifthPage extends Component {
  entries = null
  blarf = 'what ablarg'

  constructor(props) {
    super(props)
    this.reporter = React.createRef()
    // setTimeout(() => { this.reporter.current.report("Timed Out", this.state.content)}, 5000)

  }

  state = { show: false,
            content: 'This is parent state content',
  };

  report = (title, content) => { this.reporter.current.report (title, content) }

  showModal = () => {
    this.setState({ show: true, content: 'shown content' })
  }

  hideModal = () => {
    this.setState({ show: false, content: 'after content'});
  }

  setContent = (line) =>  {
    this.reporter.current.report('Bonanza', line)
  }

  openDialog = (line) => {
    this.setContent(line)
  }

  openWarn = () => {
    this.report('BonanzaWarn', '<h2>More Complex...</h2>\n<p>content set from button</p><br><p>\n...and with a break</p>')
  }

  render (data) {
    // createNodeField({
    //   node,
    //   name: 'entries',
    //   value: entries || false,
    // })

    const post = this.props.data

    // console.log(JSON.stringify(post.craftql))
    // console.log(JSON.stringify(post.swapi.allSpecies[1].name))

    return (
      <Layout>
        <div id="main">
        <h1>Hi from the fifth page, where we plan further queries...</h1>
          <h2>{this.state.content}</h2>
        </div>
        <p>Welcome to page 5</p>

{/*
        <StaticQuery query={  graphql`
    query Cards ($id: [Int]) {
  cards: entries (section: cards, id: $id, orderBy: "postDate asc") {
    ...on Cards {
      id
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
}`}/>
*/}

        <br/>
        <br/>
        <h2>Turn back on cqapi when we can correct to Schema</h2>
        <br/>
        <br/>
        <h2>blarf: { this.blarf } </h2>
        <Reporter ref={this.reporter} />
        <br/>
        <br/>
        {/*data => (*/}
        {/*<header>*/}
        {/*  <h1>{data.site.siteMetadata.title}</h1>*/}
        {/*</header>*/}
        {/*)*/}
        <h2>{ data }</h2>
        <br/>
        <button onClick={this.openWarn}>
          Set Reporter Content
        </button>
        <br/><br/>

        <Link to="/page-3">Go back to third page</Link>
        <br/>
        <Link to="/">Go back to the homepage</Link>
      </Layout>
    )
  }
}

export default FifthPage

/*
export const pageQuery = graphql`
  query {
      swapi {
#          allFilms{
#              edges{
#                  node{
#                      title
#                  }
#              }
#          }
          allSpecies {
              name
          }
      }
  }
`
*/

/*
export const pageQuery = graphql`

      query {
          craftql {
              entries (section: cards, orderBy: "postDate asc") {
              ...on Cards {
                  id
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
  }
`
*/
