/* eslint-disable  */
import React, {Component} from 'react'
import {Link} from 'gatsby'
import {StaticQuery, graphql} from 'gatsby'
import Reporter from '../live-vue-js/react/Reporter.jsx'
import GatsbyConnect from '../live-vue-js/gatsby-connect.js'
import SessionStorage from 'gatsby-react-router-scroll/StateStorage.js'

import Layout from '../components/layout'

class LiveVueGatsby extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return <ErrorBoundary>
      <div>
        {this.props.children}
      </div>
    </ErrorBoundary>
  }
}

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch (error, info) {
    // Display fallback UI
    this.setState({
      hasError: true,
      error: error,
      errorInfo: info
    })
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render () {
    if (this.state.hasError) {
      console.log('this.state.errMsg: ' + this.state.errMsg)
      // You can render any custom fallback UI
      return this.props.msg ? <div>{this.props.msg}</div> : <div>
        <h2>Something has gone wrong.</h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {this.state.error && this.state.error.toString()}
          <br/>
          {this.state.errorInfo.componentStack}
        </details>
        <div>
          {this.state.errorInfo.componentStack}
        </div>
        {/*<h3>{ this.state.errMsg }</h3>*/}
        {/*<h3>{ this.state.errInfo }</h3>*/}
      </div>
    }
    return this.props.children
  }
}

function ShowSome (props) {
  console.log('ShowSome props: ' + JSON.stringify(props))

  return <h2>Showing Some...</h2>
}

var parentMsg = 'could be the message, really? Where\'s the event?'
var scrollPos = [0, 0]

function Relocate () {
  if (typeof window !== `undefined`) {
    console.log('Relocate to: ' + JSON.stringify(scrollPos))
    window.scrollTo(scrollPos[0], scrollPos[1])
  }
  return null
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
  return <div dangerouslySetInnerHTML={props.content}></div>
}

function Image (props) {
  console.log('Image image: ' + JSON.stringify(props))

  const imgStyle = {
    maxWidth: '150px',
    maxHeight: '150px'
  }

  if (props.image[0]) {
    return <div>
      <img src={props.image[0] && props.image[0].url} style={imgStyle}/>
      <h5>image: {props.image[0].url}</h5>
    </div>
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

  let cards = <h2>No Cards</h2>
  cards = data.craftql.cards.map(card =>
    <div key={card.id}>
      <h2>title: {card.title}</h2>
      <Body content={{ __html: card.body.content }}/>
      <Image image={card.image}/>
      <h6>card id: {card.id}</h6>
    </div>)
  return cards
}

class FifthPage extends Component {
  entries = null
  blarf = 'Reporter Next...'
  id = [2]
  post = {}
  connector = null
  location = null
  dataArrived = false

  constructor (props) {
    console.log('React version: ' + React.version)
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
    console.log('original props.location: ' + JSON.stringify(this.props.location))
    this.location = this.props.location
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
          content: 'We set fresh Live Vue content from receiveMessage...'
        })
        console.log('state.content: ' + this.state.content)
        this.dataArrived = true
        this.showContent()
        Relocate()
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

  stripTrailingSlash = (str) => {
    return str.endsWith('/') ? str.slice(0, -1) : str
  }

  componentWillUpdate (nextProps, nextState, nextContext) {
    console.log('will update session storage: ' + JSON.stringify(window.sessionStorage))
    console.log('Reporter: ' + JSON.stringify(new GatsbyConnect()))
    console.log('SessionStorage: ' + JSON.stringify(new SessionStorage())) +
    console.log('location.pathname: ' + location.pathname)
    this.location.pathname = this.stripTrailingSlash(this.location.pathname) + '/'
    const currentPos = new SessionStorage().read(this.location, null)
    console.log('xcurrentPos: ' + JSON.stringify(currentPos))
    console.log('this.location: ' + JSON.stringify(this.location))

    for (var i = 0; i < window.sessionStorage.length; i++) {
      console.log('key' + i + ': ' + window.sessionStorage.key(i))
      console.log(window.sessionStorage.getItem(window.sessionStorage.key(i)))
    }
    console.log('ours: ' + window.sessionStorage.getItem('@@scroll|/page-5'))
    console.log('ours/: ' + window.sessionStorage.getItem('@@scroll|/page-5/'))
    console.log('typeof ours/: ' + typeof window.sessionStorage.getItem('@@scroll|/page-5/'))
    console.log('mine: ' + window.sessionStorage.getItem('mine'))
    // const currentPos = window.sessionStorage.getItem('@@scroll|/page-5/')
    // const currentPos = window.sessionStorage.getItem('mine')
    let currentPosition = [0, 0]
    console.log('now currentPos: ' + currentPos)
    try {
      if (currentPos) {
        console.log('trying currentPos: ' + JSON.stringify(currentPos))
        currentPosition = currentPos // JSON.parse(currentPos)
        console.log('will update scroll currentPosition: ' + JSON.stringify(currentPosition)) // JSON.stringify(currentPosition))
        // console.log('will update scroll to x: ' + currentPosition[0] + ', y: ' + currentPosition[1])
        // window.scrollTo(...(currentPosition || [0, 0]))
        scrollPos = currentPosition
        window.scrollTo(currentPosition[0], currentPosition[1])
      } else {
        console.log('no currentPos yet')
      }
    } catch (e) {
      console.log('no pos yet: ' + e)
    }
  }

  count = 5

  markWin () {
    let pos = '[' + String(window.scrollX) + ',' + String(window.scrollY + this.count++) + ']'
    // let pos = [ parseInt(window.scrollX), parseInt(window.scrollY) ]
    // pos = '[0,350]'
    console.log('markWin pos: ' + JSON.stringify(pos))
    console.log('markWin page-5/: ' + window.sessionStorage.getItem('@@scroll|/page-5/'))
    // window.sessionStorage.setItem('@@scroll|/page-5', pos)
    // window.sessionStorage.setItem('@@scroll|/page-5/', pos)
    window.sessionStorage.setItem('mine', pos)
  }

  componentDidMount = () => {
    this.receiveMessage = this.receiveMessage.bind(this)
    window.addEventListener('message', this.receiveMessage, false)
    window.addEventListener('beforeunload', this.markWin, false)
    // document.getElementById('ifrm').dataset.iframeReady = 'yes'
    let returnValue = window.parent.postMessage('loaded', '*')
    console.log('win postMessage: ' + returnValue)
    const params = new URLSearchParams(window.location.search)
    let blocked = params.get('isLiveVue') ? 'lv_blocked' : 'lv_unblocked'
    console.log('blocked: ' + params.get('isLiveVue'))
    // window.parent.getSelection().catch ((error) => {
    //   // whatever
    //   console.log ('caught parent: ' + error)
    //   parentName = 'lv_blocked'
    // });

    if (blocked !== 'lv_blocked') {
      console.log('should be live: ' + blocked)
      this.dataArrived = true // since we're not in the Live Vue iframe
      this.showContent()
    }

    this.markWin()
    console.log('did mount session storage: ' + JSON.stringify(window.sessionStorage))
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
          content: 'We set fresh Live Vue content from connector.liveVue...',
          data: theData
        }
      )
      this.dataArrived = true
    } else { // normal run case
      this.setState({
        data: this.props.data
      })
    }
    console.log('state.content: ' + this.state.content)
    Relocate()
  }

  componentDidUpdate () {
    Relocate()
    this.showContent()
  }

  componentWillUnmount () {
    this.markWin()
    console.log('will unmount session storage: ' + JSON.stringify(window.sessionStorage))
    window.removeEventListener('message', this.receiveMessage)
    window.removeEventListener('beforeunload', this.markWin)
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

  showContent () {
    if (typeof window !== 'undefined' && this.dataArrived) {
      console.log('showing content')
      let content = document.getElementById('content')
      content.style.visibility = 'visible'
    }
  }

  ShowTheCards (props) {

    const imgStyle = {
      maxWidth: '150px',
      maxHeight: '150px'
    }
    console.log('ShowTheCards props: ' + JSON.stringify(props))

    let data = props.data
    if (!data || !data.craftql) {
      return <h3>No data yet</h3>
    }

    let cards = <h2>No Cards</h2>
    // try {
    cards = data.craftql.cards.map(card =>
      <div key={card.id}>
        <h2>title: {card.title}</h2>
        <h4>body: {card.body.content}</h4>
        <h5>image: {card.image[0].url}</h5>
        <img src={card.image[0] && card.image[0].url} style={imgStyle}/>
        <h6>id: {card.id}</h6>
      </div>)
    // } catch (e) {
    //   console.log('cards error: ' + e)
    //   cards = <h1>No such luck on cards:</h1>
    //   return <h1>Cards bust</h1>
    // }
    return cards
  }

  render (data) {

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

    return (
      <LiveVueGatsby>
        <div id="content" style={style}>
          <Layout>
            {/*<ErrorBoundary>*/}
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
            <button onClick={Relocate}>
              Relocate
            </button>

            <ShowSome msg="showing some"/>

            {/*<ShowTheCards data={this.state.data}/>*/}
            <ShowTheCards data={this.props.data}/>
            {console.log('props data') }
            { console.log(this.props)}

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
            <Link to="/page-7">Go to seventh page</Link>
            <br/>
            <Link to="/page-3">Go back to third page</Link>
            <br/>
            <Link to="/">Go back to the homepage</Link>
            {/*</ErrorBoundary>*/}
          </Layout>
        </div>
      </LiveVueGatsby>
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
