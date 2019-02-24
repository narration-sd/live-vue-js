import React, {Component, useContext} from 'react'
import GatsbyConnect from '../gatsby-connect.js'
import SessionStorage from 'gatsby-react-router-scroll/StateStorage.js'

// import Fade from '@material-ui/core/Fade'

// import Reporter from './Reporter.jsx'

const LVGatsbyContext = React.createContext('no Context')

var parentMsg = 'could be the message, really? Where\'s the event?'
var editFadeDuration = 0

// this is really dirty, but React object freezing makes necessary
var fadeOut = {
  opacity: '0.1',
  // transition: 'opacity 0ms'
}

var fadeIn = {
  opacity: '1',
  transition: 'opacity 1200ms'
}

// var scrollPos = [0, 0]

/**
 * @classdesc this is a wrapper Component to enclose a Gatsby Page render tree.
 * It provides blanking during Live Preview refresh, and fade-in transition,
 * which is essential for smoothness of view during use.
 *
 * There's also an error-presenting wrapper silently included, which will
 * announce on cases of Page code errors, as may be helpful during development.
 *
 * @note used in combination with LiveVueGatsby, which the Page class inherits from
 * @usage place LiveVueWrap in the Page render(), surrounding the actual child components
 *
 * ```
 *    // here's an example
 *    render () {
 *      <LiveVueWrap>
 *        ...render tree...
 *      </LiveVueWrap>
 *    }
 *    ```
 *
 */
class LiveVueWrap extends Component {

  state = {
    isLiveVue: true
  }

  constructor (props) {
    super(props)
    this.state.isLiveVue = this.inIFrame()
  }

  inIFrame () {
    if (typeof window === `undefined`) {
      // abso necessary for build time with no window to check
      return false
    }
    else {
      try {
        return window.self !== window.top
      } catch (e) {
        return true
      }
    }
  }

  getEditFadeDuration = () => {
    console.log('getting editFadeDuration')
    return editFadeDuration
  }

  render = (props) => {

    let style = {
      visibility: this.isLiveVue
        ? 'hidden'  // critical so we don't flash static page
        : 'visible',
      opacity: this.isLiveVue
        ? '1'  // critical so we don't flash static page
        : '0'
    }

    return (
      <LVGatsbyContext.Provider value={
        { checked: this.state.isLiveVue }
      }>
        <React.Fragment>
          <ErrorBoundary>
            <Fader>
              {/*in={this.state.isLiveVue}*/}
              {/*timeout={{ enter: this.getEditFadeDuration(), exit: 0 }}>*/}
              <div id="content" style={style}>
                {/*<h2>Wrapping...</h2>*/}
                {this.props.children}
              </div>
            </Fader>
          </ErrorBoundary>
        </React.Fragment>
      </LVGatsbyContext.Provider>
    )
  }
}

class Fader extends React.Component {

  theStyle = fadeOut

  constructor (props) {
    super(props)
    // this.theStyle = this.inIFrame()
    //   ? fadeOut
    //   : fadeIn
    // if (!this.inIFrame()) {
    //   this.theStyle = fadeIn
    // }
    if (this.inIFrame()) {
      fadeIn = {
        opacity: '0.1',
        transition: 'opacity 600ms'
      }
    }

    console.log ('in iframe: ' + (this.inIFrame()
      ? 'yes'
      : 'no'))

    console.log('constructor  this.theStyle: ' + JSON.stringify(this.theStyle))
    console.log('constructor  fadeIn: ' + JSON.stringify(fadeIn))
  }

  inIFrame () {
    if (typeof window === `undefined`) {
      // abso necessary for build time with no window to check
      return false
    }
    else {
      try {
        return window.self !== window.top
      } catch (e) {
        return true
      }
    }
  }

  componentWillMount () {
    // this.theStyle = false // this.inIFrame()
    //   ? fadeOut
    //   : fadeIn
  }

  componentWillUpdate (nextProps, nextState, nextContext) {
    // this.theStyle.transition
    //   = 'opacity ' + (editFadeDuration + 'ms').toString()

    // *todo* for some reason this is critical - tie down
    console.log('will update prior this.theStyle: ' + JSON.stringify(this.theStyle))
    // this.theStyle = false // this.inIFrame()
    //   ? fadeOut
    //   : fadeIn
    // if (!this.inIFrame()) {
    //   this.theStyle = fadeIn
    // }

    console.log('will update after this.theStyle: ' + JSON.stringify(this.theStyle))
  }

  render (props) {
    console.log ('render in iframe: ' + (this.inIFrame()
      ? 'yes'
      : 'no'))

    if (!this.inIFrame()) {
      this.theStyle = fadeIn
    }
    console.log('render  this.theStyle: ' + JSON.stringify(this.theStyle))
    console.log('render  fadeIn: ' + JSON.stringify(fadeIn))

    return (
      <div style={ fadeIn } id={'Fader'}>
        {this.props.children}
      </div>
    )
  }
}

/**
 * @classdesc this is a functional Component to enclose a Gatsby Page elements
 * which normally use props.data. It provides instead props.liveData, which:
 * - normally supplies the expected props.data from the pageData GraphQL query
 * - but in Craft Preview, supplies the live data as edited in the CP
 *
 * @note used in combination with LiveVueGatsby, which the Page class inherits from
 * @example place LiveVueWrap in the Page render(), surrounding the actual child components
 *
 * ```
 *    render () {
 *      <LiveVueData>
 *        ...render tree of components which use prop.liveData rather than props.data...
 *      </LiveVueData>
 *    }
 *    ```
 *
 */
function LiveVueData (props) {

  const addDataToChildren = (children, liveVueData = null) => {

    return React.Children.map(children, child => {

      // React mis-recognizes <Elements> that aren't its own,
      // and then, passes them as empty strings.
      // Also, children can be null. I ask you.
      if (child && child.type !== undefined) {

        // if we don't have Live Vue data, replay the Gatsby
        // static data that the child already has
        const liveData = liveVueData
          ? liveVueData
          : child.props.data

        return React.cloneElement(child, { liveData: liveData })
      } else {
        return React.cloneElement(child)
      }
    })
  }

  const lvgData = useContext(LVGatsbyContext)
  const { isLiveVue } = lvgData

  console.log('lvgData: ' + JSON.stringify(lvgData))
  console.log('isLiveVue: ' + isLiveVue)

  const childrenWithData = addDataToChildren(props.children)

  return (
    <React.Fragment>
      <h2>Live Vue Data</h2>
      {childrenWithData}
    </React.Fragment>
  )
}

function Relocate () {
  // if (typeof window !== `undefined`) {
  //   console.log('Relocate to: ' + JSON.stringify(scrollPos))
  //   window.scrollTo(scrollPos[0], scrollPos[1])
  // }
  return null
}

/**
 * @classdesc Basis Component to enable Live Vue preview on a Gatsby Page.
 * It provides all services to manage previewing transit from static to live data
 * Companion LiveVueWrap is used to wrap the render tree for the Page.
 * @usage: The page inherits from LiveVueGatsby, rather than from React.Component.
 * This allows retrieving preview data on behalf of the Page.
 */
class LiveVueGatsby extends Component {

  location = null
  dataArrived = false
  id = [2]
  post = {}
  connector = null
  entries = null

  state = {
    show: false,
    content: 'This is original state content',
    parentMsg: 'a message? ',
    testVar: 'unset', // *todo* get this out of here
    liveVueData: {} // critical, unless they over-ride it
  }

  constructor (props) {
    super(props)

    if (this.state === undefined) {
      // we'll provide our own
      this.state = {}
    }

    this.state.liveVueData = null

    this.reporter = React.createRef()
    this.setter = this.props.setter
  }

  /**
   * provides the automatically switched liveVueData:
   *  - Gatsby props data as expected for a static page
   *  - but Craft Live Preview data, when entries are edited in Craft
   *
   * @example create a prop for the element which calls this function, which
   * will appear on the Page class, then use that data in the rendering Component:
   * ```
   *     <ShowTheData data={ this.liveVueData()} />
   * ```
   * @param {boolean} [forceLive = false]
   * @function
   * @returns string
   */
  liveVueData = (forceLive = false) => {

    const isLiveVueData = Object.keys(this.state.liveVueData).length === 0

    // we should free up display as soon as we know we're static
    // *todo* this works, but isn't the optimum place

    if (!isLiveVueData) {
      console.log('showContent on call to liveVueData')
      this.showContent()
    }

    let displayData = isLiveVueData
      ? this.props.data
      : this.state.liveVueData

    return displayData
  }

  setData = (event) => {
    let data = this.state.liveVueData
    if (data !== undefined) {
      data.craftql.cards[0].title = 'We changed this with setData'
      this.setState({
        liveVueData: data,
        parentMsg: 'and we set a fresh message...'
      })
    }
  }

  receiveMessage = (event) => {
    // if (event.origin !== "http://example.org:8080")
    //   return;

    // console.log('child received event: ' + JSON.stringify(event))
    if (event.data === undefined) {
      console.log('skipping data on undefined')
      return
    }

    if (event.data === '') {
      console.log('skipping data on empty')
      return
    }

    if (event.data !== undefined) {
      // console.log('received event is: ' + JSON.stringify(event))
      if (event.data.text !== undefined) {
        parentMsg = event.data.text
        // console.log('event.data.text: ' + event.data.text)
        // let's see the jsoniousness  of it
        let obj = { data: {} }
        try {
          obj = JSON.parse(parentMsg)
          editFadeDuration = obj.lvMeta.editFadeDuration
          // console.log('lvMeta is: ' + JSON.stringify(obj))
          console.log('editFadeDuration: ' + editFadeDuration)
          let localStyle = {
            opacity: '1',
          }
          // editFadeDuration = 3000
          console.log('setting editFade to: ' + editFadeDuration)
          localStyle.opacity = '1'
          localStyle.transition
            = 'opacity ' + (editFadeDuration + 'ms').toString()
          fadeIn = localStyle

          if (!obj.data) {
            // *todo* fix this -- here we get into integrating Reporter
            throw new Error('no data from Live Preview!')
          }

          // console.log('json parse success; obj is: ' + JSON.stringify(obj))
          if (Object.keys(obj.data).length > 0) {
            obj = this.connector.rearrangeData(obj)
            // console.log('json rearranged; obj is: ' + JSON.stringify(obj))
          }
        } catch (error) {
          console.log('json parse error: ' + error)
        }

        if (obj) {
          this.setState({
            liveVueData: obj.data
          })
        }
        this.dataArrived = true
        console.log('showContent on div data arrival')
        this.showContent()
        // Relocate()
      } else {
        console.log('event data.text undefined')
      }
    } else {
      console.log('no data')
    }
  }

  showContent () {
    if (typeof window !== 'undefined' && this.dataArrived) {
      this.dataArrived = false // don't keep looping on it
      console.log('showing content')
      let content = document.getElementById('content')
      // *todo* here's where Hider does better?
      if (content) {
        content.style.visibility = 'visible'
        content.style.opacity = '1'
      } else {
        console.log('content div not available for visibility')
      }
    } else if (!this.dataArrived) {
      console.log('not dataArrived')
    }
  }

  stripTrailingSlash = (str) => {
    return str.endsWith('/') ? str.slice(0, -1) : str
  }

  componentWillUpdate (nextProps, nextState, nextContext) {
    this.location = window.location // window is safe here
    const currentPosition = new SessionStorage().read(this.props.location, null)
    try {
      if (currentPosition) {
        // scrollPos = currentPosition
        window.scrollTo(currentPosition[0], currentPosition[1])
      }
    } catch (e) {
      console.log('no currentPosition yet: ' + e)
    }
  }

  count = 5

  markWin () {
    // let pos = '[' + String(window.scrollX) + ',' + String(window.scrollY + this.count++) + ']'
    // // let pos = [ parseInt(window.scrollX), parseInt(window.scrollY) ]
    // // pos = '[0,350]'
    // console.log('markWin pos: ' + JSON.stringify(pos))
    // console.log('markWin page-7/: ' + window.sessionStorage.getItem('@@scroll|/page-7/'))
    // // window.sessionStorage.setItem('@@scroll|/page-7', pos)
    // // window.sessionStorage.setItem('@@scroll|/page-7/', pos)
    // window.sessionStorage.setItem('mine', pos)
  }

  //

  componentDidMount = () => {
    this.receiveMessage = this.receiveMessage.bind(this)
    window.addEventListener('message', this.receiveMessage, false)
    window.addEventListener('beforeunload', this.markWin, false)

    window.parent.postMessage('loaded', '*')
    const params = new URLSearchParams(window.location.search)
    let blocked = params.get('isLiveVue') ? 'lv_blocked' : 'lv_unblocked'

    if (blocked !== 'lv_blocked') {
      this.dataArrived = true // since we're not in the Live Vue iframe
      console.log('showContent on non-live-vue')
      this.showContent()
    }

    this.markWin()
    // console.log('did mount session storage: ' + JSON.stringify(window.sessionStorage))
    this.connector = new GatsbyConnect()

    // let dataQuery = 'script=Cards'
    //
    // here we're going to use Live Vue only for previews.
    // This method will never call out for server data.
    // let theData = this.connector.liveVue(dataQuery)
    //
    // if (theData) {
    //   console.log('Live Vue data present: ' + JSON.stringify(theData))
    //   // so we'll reactively show it...
    //   this.setState(
    //     {
    //       content: 'We set fresh Live Vue content from connector.liveVue...',
    //       liveVueData: theData
    //     }
    //   )
    //   this.dataArrived = true
    // } else { // normal run case
    //   // *todo* Here's the looping problem -- result of setState
    //   // this.setState({
    //   //   liveVueData: this.props.data
    //   // })
    // }
    // console.log('componentDidMount state.content: ' + this.state.content)
    // console.log('componentDidMount state: ' + JSON.stringify(this.state))
    Relocate()
  }

  componentDidUpdate () {
    // Relocate()
    console.log('showContent on componentDidUpdate')
    this.showContent()
  }

  componentWillUnmount () {
    this.markWin()
    // console.log('will unmount session storage: ' + JSON.stringify(window.sessionStorage))
    window.removeEventListener('message', this.receiveMessage)
    window.removeEventListener('beforeunload', this.markWin)
  }

  report = (title, content) => {
    this.reporter.current.report(title, content)
  }

}

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch (error, info) {
    // *todo* Display fallback UI
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
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

export {
  LiveVueGatsby,
  LiveVueWrap,
  LiveVueData
}
