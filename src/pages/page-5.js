/* eslint-disable  */
import React, {Component} from 'react'
import {Link} from 'gatsby'
import {StaticQuery, graphql} from 'gatsby'
import Reporter from '../live-vue-js/react/Reporter.jsx'

import Layout from '../components/layout'

class FifthPage extends Component {
  entries = null
  blarf = 'what ablarg'
  id = [2]
  imgStyle = {
    maxWidth: '150px',
    maxHeight: '150px'
  }
  post = {}


  constructor (props) {
    super(props)
    this.reporter = React.createRef()
    // setTimeout(() => { this.reporter.current.report("Timed Out", this.state.content)}, 5000)
    const id = [2]
    this.post = this.props.data

    this.props.pageContext["id"] = id
    this.setData('original data here')
    console.log('original props: ' + JSON.stringify(this.props))
  }

  state = {
    show: false,
    content: 'This is original state content'
  }

  report = (title, content) => {
    this.reporter.current.report(title, content)
  }

  showModal = () => {
    this.setState({ show: true, content: 'shown content' })
  }

  hideModal = () => {
    this.setState({ show: false, content: 'after content' })
  }

  setContent = (line) => {
    this.reporter.current.report('Bonanza', line)
  }

  setStateData = () => {
    this.setState(
      { content: 'We set fresh state content...'}
    )
  }

  setData = (data = 'before using setData data...') => {
    // this.props.data.craftql.cards[0].title = 'We Changed This Title'
    this.post.craftql.cards[0].title = data
    // let newData = this.props.data
    // newData.craftql.cards[0].title = 'We Changed This Title'
    // this.props.data = newData

    console.log('setData cards[0].title to: ' + this.post.craftql.cards[0].title)
  }

  openDialog = (line) => {
    this.setContent(line)
  }

  openWarn = () => {
    this.report('BonanzaWarn', '<h2>More Complex...</h2>\n<p>content set from button</p><br><p>\n...and with a break</p>')
  }

  render (data) {

    const id = [2]
    // this.props.pageContext["id"] = id

    console.log('pageContext: ' + JSON.stringify(this.post.pageContext))

    // console.log(JSON.stringify(this.props))
    // console.log(JSON.stringify(post.craftql))
    // console.log(JSON.stringify(post.swapi.allSpecies[1].name))
    let newData = 'how about fresh data'

    return (
      <Layout>
        <div id="main">
          <h1>The fifth page, with Cards via page queries...</h1>
          <h2>{this.state.content}</h2>
        </div>
        <p>Welcome to page 5</p>
        <button onClick={this.setData()}>
          New Data
        </button>
        <button onClick={this.setStateData}>
          New State Data
        </button>


        <h2>lv-demo says of Cards, {this.post.craftql.cards[0].title}</h2>

        { this.post.craftql.cards.map(card =>
          <div key={card.id}>
            <h2>title: {card.title}</h2>
            <h4>body: {card.body.content}</h4>
            <h5>image: {card.image[0].url}</h5>
            <img src={ card.image[0].url} style={ this.imgStyle } />
            <h6>id: {card.id}</h6>
          </div>
        )
        }

        <br/>
        <br/>
        <h2>blarf: {this.blarf} </h2>
        <Reporter ref={this.reporter}/>
        <br/>
        <br/>

        <button onClick={this.openWarn}>
          Set Reporter Content
        </button>

        <br/><br/>
        <Link to="/page-6">Go to sixth page</Link>
        <br/>
        <Link to="/page-3">Go back to third page</Link>
        <br/>
        <Link to="/">Go back to the homepage</Link>
      </Layout>
    )
  }
}

export default FifthPage

export const pageQuery = graphql`

      query Cards5 ($id: [Int]) {
          craftql {
              cards: entries (section: cards, id: $id, orderBy: "postDate asc") {
              ...on CraftQL_Cards {
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
