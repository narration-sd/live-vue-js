/* eslint-disable  */
import React, {Component} from 'react'
import {Link} from 'gatsby'
import {StaticQuery, graphql} from 'gatsby'
import Reporter from '../live-vue-js/react/Reporter.jsx'
import GatsbyConnect from '../live-vue-js/gatsby-connect.js'

import Layout from '../components/layout'

function ShowSome () {
  return <h2>Showing Some...</h2>
}

var parentMsg = 'could be the message, really? Where\'s the event?'

class ShowFromParentC extends React.Component {

  render = () => {
    let styles = {
      margin: '20px',
      width: '250px',
      height: '250px',
      padding: '5px',
      backgroundColor: 'lightblue',
      border: '4px solid red',
      overflow: 'hidden'
    }

    return <div style={styles}>
      <h2>Here is where the message goes: </h2>
      <p>{this.props.msg}</p>
    </div>
  }
}

function ShowFromParent (props) {
  let styles = {
    margin: '20px',
    width: '250px',
    height: '250px',
    padding: '5px',
    backgroundColor: 'yellow',
    border: '4px solid green',
    overflow: 'hidden'
  }
  console.log('props.msg: ' + JSON.stringify(props.msg))
  // msg = 'static inside'
  return <div style={styles}>
    <h2>Here is where the message will go: </h2>
    <p>{props.msg}</p>
  </div>
}

class FifthPage extends Component {
  entries = null
  blarf = 'what ablarg'
  id = [2]
  imgStyle = {
    maxWidth: '150px',
    maxHeight: '150px'
  }
  post = {}
  connector = null

  constructor (props) {
    super(props)
    this.reporter = React.createRef()
    // setTimeout(() => { this.reporter.current.report("Timed Out", this.state.content)}, 5000)
    const id = [2]
    // this.post = this.props.data
    // this.setState({
    //   data: this.props.data
    // })

    // this.props.pageContext['id'] = id
    this.setData('original data here')
    console.log('original props: ' + JSON.stringify(this.props))
  }

  receiveMessage = (event) => {
    // if (event.origin !== "http://example.org:8080")
    //   return;

    console.log('child received event: ' + JSON.stringify(event))
    if (event.data === undefined) {
      console.log('skipping in hope')
      return
    }

    if (event.data !== undefined) {
      console.log('received data is: ' + JSON.stringify(event.data))
      if (event.data.text !== undefined) {
        parentMsg = event.data.text
        // let's see the jsoniousness  of it
        let obj = {}
        try {
          obj = JSON.parse(parentMsg)
          obj = this.connector.rearrangeData(obj)
          console.log('json parse success; obj is: ' + JSON.stringify(obj))
        } catch (error) {
          console.log('json parse error: ' + error)
        }

        // parentMsg = 'tempotempo'
        this.setState({
          data: obj ? obj.data : this.state.data,
          parentMsg: parentMsg,
          content: 'We set fresh Live Vue content...',
        })
      }
    } else {
      console.log('no data')
    }

  }

  state = {
    show: false,
    content: 'This is original state content',
    parentMsg: 'a message? '
  }

  componentDidMount = () => {
    this.receiveMessage = this.receiveMessage.bind(this)
    window.addEventListener('message', this.receiveMessage, false)
    // document.getElementById('ifrm').dataset.iframeReady = 'yes'
    window.parent.postMessage('loaded', '*')

    this.connector = new GatsbyConnect()

    let dataQuery = 'script=Cards'

    // here we're going to use Live Vue only for previews.
    // This method will never call out for server data.
    let theData = this.connector.liveVue(dataQuery)
    if (theData) {
      console.log('Live Vue data present: ' + JSON.stringify(theData))
      // so we'll reactively show it...
      this.setState(
        {
          content: 'We set fresh Live Vue content...',
          data: theData
        }
      )
    } else { // normal run case
      this.setState({
        data: this.props.data
      })
    }
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

  setStateData = (event) => {
    this.setState(
      {
        content: 'We set fresh state content...',
        parentMsg: 'and we set a fresher message...'
      }
    )
    console.log('setState state: ' + JSON.stringify(this.state))
  }

  setData = (event) => {
    let data = this.state.data
    if (data !== undefined) {
      data.craftql.cards[0].title = 'We changed this with setData'
      this.setState({
        data: data,
        parentMsg: 'and we set a fresh message...'
      })
    }

    // this.receiveMessage({ data: {msg: { text: 'something extra'}}})
    // // this.props.data.craftql.cards[0].title = 'We Changed This Title'
    // this.post.craftql.cards[0].title = event
    // // let newData = this.props.data
    // // newData.craftql.cards[0].title = 'We Changed This Title'
    // // this.props.data = newData
    //
    // console.log('setData cards[0].title to: ' + JSON.stringify(this.post.craftql.cards[0].title))
  }

  openDialog = (line) => {
    this.setContent(line)
  }

  openWarn = () => {
    this.report('BonanzaWarn', '<h2>More Complex...</h2>\n<p>content set from button</p><br><p>\n...and with a break</p>')
  }

  cardsPlay = (props) => {
    return this.state.data.craftql.cards.map(card =>
      <div key={card.id}>
        <h2>title: {card.title}</h2>
        <h4>body: {card.body.content}</h4>
        <h5>image: {card.image[0].url}</h5>
        <img src={card.image[0].url} style={this.imgStyle}/>
        <h6>id: {card.id}</h6>
      </div>
    )
  }

  showCards = (props) => {
    if (true || this.state.data !== undefined) {
      return <h2>Cards go here</h2>
      {/*<cardsPlay />*/
      }
    }
  }

  render (data) {

    const id = [2]
    // this.props.pageContext["id"] = id

    // console.log('pageContext: ' + JSON.stringify(this.post.pageContext))

    // console.log(JSON.stringify(this.props))
    // console.log(JSON.stringify(post.craftql))
    // console.log(JSON.stringify(post.swapi.allSpecies[1].name))
    let newData = 'how about fresh data'

    return (
      <Layout>
        {/*{ {% hook "live-vue" %} }*/}
        <div id="main">
          <h1>The fifth page, with Cards via page queries...</h1>
          <h2>{this.state.content}</h2>
        </div>
        <p>Welcome to page 5</p>
        <ShowFromParentC msg={this.state.parentMsg}/>
        <button onClick={this.setData}>
          New First Title
        </button>
        <button onClick={this.setStateData}>
          New State Data
        </button>

        <ShowSome msg="showing some"/>
        {/*<h2>lv-demo says of Cards, {this.state.data.craftql.cards[0].title}</h2>*/}
        {/*if (this.state.data !== undefined) {*/}

        {this.state.data !== undefined &&
        this.state.data.craftql.cards.map(card =>
          <div key={card.id}>
            <h2>title: {card.title}</h2>
            <h4>body: {card.body.content}</h4>
            <h5>image: {card.image[0].url}</h5>
            <img src={card.image[0].url} style={this.imgStyle}/>
            <h6>id: {card.id}</h6>
          </div>
        )
        }
        {/*}*/}


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

export const
  pageQuery = graphql`

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
