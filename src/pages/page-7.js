/* eslint-disable  */
import React, {Component} from 'react'
import {Link} from 'gatsby'
import {StaticQuery, graphql} from 'gatsby'
import SessionStorage from 'gatsby-react-router-scroll/StateStorage.js'

import {LiveVueGatsby, LiveVueWrap} from '../live-vue-js/react/LiveVueGatsby.js'
import Reporter from '../live-vue-js/react/Reporter.jsx'
import GatsbyConnect from '../live-vue-js/gatsby-connect.js'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'

import Layout from '../components/layout'

var styles = theme => ({
  backgroundColor: 'goldenrod'
})

var scrollPos = [0, 0]
var parentMsg = 'could be the message, really? Where\'s the event?'

function Relocate () {
  // if (typeof window !== `undefined`) {
  //   console.log('Relocate to: ' + JSON.stringify(scrollPos))
  //   window.scrollTo(scrollPos[0], scrollPos[1])
  // }
  return null
}

/**
 *
 * @param props
 * @returns {*}
 * @constructor
 */
function ShowSome (props) {
  // console.log('ShowSome props: ' + JSON.stringify(props))

  return <h2>Showing Some...</h2>
}

/**
 * @param context
 * @returns {string}
 */
const tellIt = (context) => {
  return 'msg was: ' + context.msg + ' from page-7'
}

/**
 * @param props
 * @returns {*}
 * @constructor
 */
function TellMeTrue (props) {
  // console.log('TellMeTrue props: ' + JSON.stringify(props))

  // props.setter(props.data)

  return <div>
    <MyContext.Consumer>{context =>
      <p>{tellIt(context)}</p>}</MyContext.Consumer>
    <h2>Told Me True</h2>
  </div>
}

class ShowFromParentC extends React.Component {
  /**
   * @classdesc Show what's enclosed
   * @note this is nonsense to gin up the doc generator, since ShowFromParentC goes out
   */
  constructor () {

  }

/**
 * provide the rendering
 * @returns string
 */
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
  // console.log('props.msg: ' + JSON.stringify(props.msg))
// msg = 'static inside'
  return <div style={styles}>
    <h2>Here is where the message will go: </h2>
    <p>{props.msg}</p>
  </div>
}

function Body (props) {
  // console.log('body content: ' + JSON.stringify(props.content))
  return <React.Fragment>
    <h6>Body: </h6>
    <div dangerouslySetInnerHTML={props.content}></div>
  </React.Fragment>
}

function SafeImage (props) {
  // console.log('SafeImage image: ' + JSON.stringify(props))

  const imgStyle = {
    maxWidth: '500px',
    maxHeight: '500px'
  }

  if (props.image[0]) {
    return <React.Fragment>
      <h6>image:</h6>
      <img src={props.image[0] && props.image[0].url} style={imgStyle}/>
      <h6>image url: {props.image[0].url}</h6>
    </React.Fragment>
  } else {
    return <h3>Missing Image (*todo* later we will have a substitute)</h3>
  }
}

function ShowTheCards (props) {
  /**
   * @classdesc main Page class for showing the Cards content
   * @note it's a functional component
   * @usage in Page render(), <LiveVueWrap>...render tree...</LiveVueWrap>
   */
  // console.log('ShowTheCards data: ' + JSON.stringify(data))

  let data = props.data
  if (!data || !data.craftql) {
    return <h3>No data yet</h3>
  }

  let cardStyle = {
    maxWidth: '600px',
    margin: '20px 40px',
    padding: '20px 20px'
  }

  let cards = <h2>No Cards</h2>
  cards = data.craftql.cards.map(card =>
    <React.Fragment key={card.id}>
      <Card style={cardStyle}>
        <h5>title:</h5><h2>{card.title}</h2>
        <Body content={{ __html: card.body.content }}/>
        <SafeImage image={card.image}/>
        <h6>card id: {card.id}</h6>
      </Card>
    </React.Fragment>)
  return cards
}

function SeeSomeData (props) {
  return <>
    <h4>Data: </h4>
    <h6>{props.data}</h6>
  </>
}


const Child = () => {
// We wrap the component that actually needs access to
// the lastName property in FamilyConsumer
  return <MyContext.Consumer>{context =>
    <p>{scontext.msg}</p>}</MyContext.Consumer>
}

/**
 * @classdesc the page-7 Page class, inheriting from LiveVueGatsby so we
 * will have Live Vue Craft Preview ability
 * @note inheriting from LiveVueGatsby so we
 * will have Live Vue Craft Preview ability
 * @usage in Page render(), enclose using <LiveVueWrap>...render tree...</LiveVueWrap>
 */
class SeventhPage extends LiveVueGatsby {

  note = 'Reporter Next...'

  state = { noStateHere: true }

  constructor (props) {
    // console.log('SeventhPageImpl starting on React version: ' + React.version)
    super(props)

    this.state = {
      checked: true,
      data: {}
    }

    // console.log('SeventhPageImpl props data: ' + JSON.stringify(this.props.data))
    // console.log('SeventhPageImpl state: ' + JSON.stringify(this.state))
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
    // console.log('setState state: ' + JSON.stringify(this.state))
  }

  setChecked = () => {
    this.setState(
      {
        checked: !this.state.checked
      }
    )
  }

  openDialog = (line) => {
    this.setContent(line)
  }

  openWarn = () => {
    this.report('BonanzaWarn', '<h2>More Complex...</h2>\n<p>content set from button</p><br><p>\n...and with a break</p>')
  }

  setOwnStateData = (data) => {
    this.setState(
      {
        data: data,
        content: 'We setter fresh state content...',
        parentMsg: 'and we setter a fresher message...'
      }
    )
    // console.log('setOwnStateData state: ' + JSON.stringify(this.state))
  }

  componentDidMount () {
    super.componentDidMount()
  }

  render () {

    console.log('SeventhPage render state data: ' + JSON.stringify(this.state.data))
    console.log('SeventhPage render props data: ' + JSON.stringify(this.props.data))
    // console.log('SeventhPage render state: ' + JSON.stringify(this.state))

    const id = [2]
// this.props.pageContext["id"] = id

// console.log('pageContext: ' + JSON.stringify(this.post.pageContext))

// console.log(JSON.stringify(this.props))
// console.log(JSON.stringify(post.craftql))
// console.log(JSON.stringify(post.swapi.allSpecies[1].name))
    let newData = this.state.data // 'how about fresh data'
    let style = {
      visibility: 'hidden' // critical so we don't flash static page
    }

    // console.log('pre-displayData this.state: ' + JSON.stringify(this.state))
    // console.log('pre-displayData this.state.data: ' + JSON.stringify(this.state.data))
    let displayData = Object.keys(this.state.data).length === 0
      ? this.props.data
      : this.state.data
    // console.log('displayData: ' + JSON.stringify(displayData))

    if (displayData) {
      // console.log('SeventhPage render, props data set to: ' + this.state.data)
      // this.props.data = this.state.data
      // console.log('SeventhPage render, props data are: ' + JSON.stringify(this.props.data))

    } else {
      console.log('SeventhPage render, empty state data')
    }

    return (

      <LiveVueWrap>
        <Layout>
          <div id="main">
            <h3>The seventh page, with Cards via LiveVueGatsby...</h3>
            {/*<h2>{this.state.content}</h2>*/}
          </div>
          <p>Welcome to page 7</p>
          <SeeSomeData data={this.liveVueData()}/>
          {/*<Button onClick={this.setData} variant="contained"*/}
          {/*        color="primary">*/}
          {/*  New First Title*/}
          {/*</Button> &nbsp;*/}
          {/*<Button onClick={this.setChecked} variant="contained"*/}
          {/*        color="primary">*/}
          {/*  Flip Checked*/}
          {/*</Button> &nbsp;*/}
          {/*<ShowSome msg="showing some"/>*/}

          <ShowTheCards data={displayData}/>
          {/*{this.props.data}/>*/}

          <br/>
          <br/>
          <h2>Note: {this.note} </h2>
          <Reporter ref={this.reporter}/>
          <br/>
          <br/>

          <Button onClick={this.openWarn} variant="contained"
                  color="primary">
            Set Reporter Content
          </Button>

          <br/><br/>
          <Link to="/page-6">Go to sixth page</Link>
          <br/>
          <Link to="/page-5">Go back to fifth page</Link>
          <br/>
          <Link to="/page-3">Go back to third page</Link>
          <br/>
          <Link to="/">Go back to the homepage</Link>
        </Layout>
      </LiveVueWrap>
    )
  }
}

export default SeventhPage

export const
  pageQuery = graphql`

      query Cards7 ($id: [Int]) {
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
