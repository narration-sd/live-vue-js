/* eslint-disable  */
import React, {Component} from 'react'
import {Link} from 'gatsby'
import {StaticQuery, graphql} from 'gatsby'
import SessionStorage from 'gatsby-react-router-scroll/StateStorage.js'

import {LiveVueGatsby, ErrorBoundary, MyContext} from '../live-vue-js/react/LiveVueGatsby.jsx'
import Reporter from '../live-vue-js/react/Reporter.jsx'
import GatsbyConnect from '../live-vue-js/gatsby-connect.js'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'

import Layout from '../components/layout'

function ShowSome (props) {
  console.log('ShowSome props: ' + JSON.stringify(props))

  return <h2>Showing Some...</h2>
}

const tellIt = (context) => {
  return 'msg was: ' + context.msg + ' from page-7'
}

function TellMeTrue (props) {
  console.log('TellMeTrue props: ' + JSON.stringify(props))

  // props.setter(props.data)

  return <div>
    <MyContext.Consumer>{context => <p>{tellIt(context)}</p>}</MyContext.Consumer>
    <h2>Told Me True</h2>
  </div>
}

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

function Body (props) {
  console.log('body content: ' + JSON.stringify(props.content))
  return <React.Fragment>
    <h6>Body: </h6>
    <div dangerouslySetInnerHTML={props.content}></div>
  </React.Fragment>
}

function Image (props) {
  console.log('Image image: ' + JSON.stringify(props))

  const imgStyle = {
    maxWidth: '150px',
    maxHeight: '150px'
  }

  if (props.image[0]) {
    return <React.Fragment>
      <h6>image:</h6>
      <img src={props.image[0] && props.image[0].url} style={imgStyle}/>
      <h6>image url: {props.image[0].url}</h6>
    </React.Fragment>
  } else {
    return <h3>Missing Image (*todo* later we will have substitute)</h3>
  }
}

function ShowTheCards (props) {
  console.log('ShowTheCards props: ' + JSON.stringify(props))

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
        <Image image={card.image}/>
        <h6>card id: {card.id}</h6>
      </Card>
    </React.Fragment>)
  return cards
}

const Child = () => {
// We wrap the component that actually needs access to
// the lastName property in FamilyConsumer
  return <MyContext.Consumer>{context =>
    <p>{scontext.msg}</p>}</MyContext.Consumer>
}

class SeventhPage extends Component {
  blarf = 'Reporter Next...'
  state = { noStateHere: true }

  constructor (props) {
    console.log('SeventhPage starting on React version: ' + React.version)
    super(props)
    this.state = {
      data: this.props.data,
      noStateHere: false
    }
    console.log('SeventhPage props data: ' + JSON.stringify(this.props.data))
    console.log('SeventhPage state: ' + JSON.stringify(this.state))
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
    console.log('setOwnStateData state: ' + JSON.stringify(this.state))
  }


  render (data) {

    console.log('SeventhPage render state data: ' + JSON.stringify(this.state.data))
    // console.log('SeventhPage render state: ' + JSON.stringify(this.state))

    const id = [2]
// this.props.pageContext["id"] = id

// console.log('pageContext: ' + JSON.stringify(this.post.pageContext))

// console.log(JSON.stringify(this.props))
// console.log(JSON.stringify(post.craftql))
// console.log(JSON.stringify(post.swapi.allSpecies[1].name))
    let newData = 'how about fresh data'
    let style = {
      visibility: 'hidden' // critical so we don't flash static page
    }
    {/*<ErrorBoundary>*/
    }

    let propsData = this.props.data ? this.props.data : { noData: true }
    let stateData = this.state.data ? this.state.data : { noStateData: true }

    return (

      <div id="content" style={style}>
        <Layout>
          <LiveVueGatsby data={propsData} stateData={stateData}
                         setter={this.setOwnStateData.bind(this)}
                         // propsData={this.props.data}
          >
            <TellMeTrue setter={this.setState.bind(this)} data={this.props.data}/>
            {/*<ErrorBoundary>*/}
            {/*{ {% hook "live-vue" %} }*/}
            {/*<Child/>*/}
            {/*<MyContext.Consumer>{*/}
            {/*  context => <p>{context.msg + ' from page-7'}</p>*/}
            {/*}</MyContext.Consumer>*/}
            <div id="main">
              <h1>The seventh page, with Cards via LiveVueGatsby...</h1>
              {/*<h2>{this.state.content}</h2>*/}
            </div>
            <p>Welcome to page 7</p>
            {/*<ShowFromParentC msg={this.state.parentMsg}/>*/}
            <Button onClick={this.setData} variant="contained" color="primary">
              New First Title
            </Button> &nbsp;
            {/*<Button onClick={this.setStateData} variant="contained" color="primary">*/}
            {/*  New State Data*/}
            {/*</Button> &nbsp;*/}
            {/*<Button onClick={Relocate} variant="contained" color="primary">*/}
            {/*  Relocate*/}
            {/*</Button>*/}

            <ShowSome msg="showing some"/>

            <ShowTheCards data={this.state.data}/>

            <br/>
            <br/>
            <h2>blarf: {this.blarf} </h2>
            <Reporter ref={this.reporter}/>
            <br/>
            <br/>

            <Button onClick={this.openWarn} variant="contained" color="primary">
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
            {/*</ErrorBoundary>*/}
          </LiveVueGatsby>
        </Layout>
      </div>
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
