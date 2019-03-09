// let's get this completely re-factored, in time for the beta
import React, {Component, useContext} from 'react'
import GatsbyConnect from '../gatsby-connect.js'
import SessionStorage from 'gatsby-react-router-scroll/StateStorage.js'
// import './lv-fade-in-anim.css'
import Fade from '@material-ui/core/Fade'

// import Reporter from './Reporter.jsx'

const LVGatsbyContextB = React.createContext('no Context')

class ErrorBoundaryB extends React.Component {
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

class LiveVueDataWrap extends Component {
  static contextType = LVGatsbyContextB

  constructor (props) {
    super(props)
  }

  addDataToChildren = (children, data = null) => {

    return React.Children.map(children, child => {

      // React mis-recognizes <Elements> that aren't its own,
      // and then, passes them as empty strings.
      // Also, children can be null. I ask you.
      if (child && child.type !== undefined) {
        return React.cloneElement(child, { data: data })
      } else {
        return React.cloneElement(child)
      }
    })
  }

  render () {
    console.log('LiveVueDataWrap context: ' + this.context)
    console.log(this.context)

    // *todo* temporary measures, until eventing sort anyway
    const fadeIn = this.context.liveVue
      ? this.context.dataArrived
      : true
    const fadeTime = this.context.liveVue
      ? this.context.editFadeDuration
      : 0
    console.log('DataWrap fadeIn: ' + fadeIn +
      ', fadeTime: ' + fadeTime)

    let childrenToUse = this.context.dataArrived
      ? this.addDataToChildren(
          this.props.children,
          this.context.data)
      : this.props.children

    return (
      <Fade in={fadeIn} timeout={fadeTime}>
        <div style={this.props.style}>
          { childrenToUse }
        </div>
      </Fade>
    )
  }
}

class LiveVueGatsbyWrap extends Component {

  state = {
    show: false,
    content: 'This is original state content',
    parentMsg: 'a message? ',
    testVar: 'unset', // *todo* get this out of here
    liveVueData: {}, // critical, unless they over-ride it
    isLiveVue: true,
    else: 'else state'
  }

  constructor (props) {
    super(props)

    if (this.state === undefined) {
      // we'll provide our own, but otherwise use theirs
    }

    console.log('Wrap props data: ' + props.data)
    console.log(props.data)
    this.state.dataArrived = false
    this.state.editFadeDuration = 802
    this.state.liveVueData = null

    this.reporter = React.createRef()
    this.setter = this.props.setter
    this.dataArrived = 'hoho'
    this.state.isLiveVue = this.inIFrame()
    console.log('Wrap props dataArrived: ' + props.dataArrived)
    console.log('Wrap props editFadeDuration: ' + props.editFadeDuration)
    console.log(props)
    console.log(this.props)
  }

  getDataArrived = () => {
    return this.state.dataArrived
  }

  getEditFadeDuration = () => {
    console.log('getEditFadeDuration: ' + this.state.editFadeDuration)
    return this.state.editFadeDuration
  }

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

  /**
   * @param fullResult
   * @returns {{data: {craftql: {cards: *}}}}
   */
  rearrangeToGatsbyDatal (fullResult) {
    // now revise this into shape gatsby expects
    let cardsData = fullResult.data.cards
    fullResult = {
      data: {
        craftql: {
          cards: cardsData
        }
      }
    }

    return fullResult
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

    const isliveVueData = Object.keys(this.state.liveVueData).length === 0

    // we should free up display as soon as we know we're static
    // *todo* this works, but isn't the optimum place

    if (!isliveVueData) {
      console.log('showContent on call to liveVueData')
      this.showContent()
    }

    let displayData = isliveVueData
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

  inIFrame () {
    if (typeof window === `undefined`) {
      // abso necessary for build time with no window to check
      return false
    } else {
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
        let parentMsg = event.data.text
        // console.log('event.data.text: ' + event.data.text)
        // let's see the jsoniousness  of it
        let obj = { data: {} }
        try {
          obj = JSON.parse(parentMsg)

          if (!obj.data) {
            // *todo* fix this -- here we get into integrating Reporter
            throw new Error('no data from Live Preview!')
          }

          // more *todo* must do before rearrange elides lvMeta
          let editFadeDuration = obj.lvMeta
            ? obj.lvMeta.editFadeDuration
            : 0 // default, which share will use

          console.log('receive editFadeDuration: ' + editFadeDuration)

          // console.log('json parse success; obj is: ' + JSON.stringify(obj))
          if (Object.keys(obj.data).length > 0) {
            obj = this.rearrangeToGatsbyDatal(obj)
            console.log('json rearranged; obj is: ' + JSON.stringify(obj))
          }

          if (obj) {
            console.log('setting state received')
            this.setState({
              liveVueData: obj.data,
              editFadeDuration: editFadeDuration,
              dataArrived: true
            })
            console.log('state data: ' + JSON.stringify(this.state.liveVueData))
          }
          this.dataArrived = true
          console.log('showContent on div data arrival')
          this.showContent()

        } catch (error) {
          console.log('json parse error: ' + error)
        }
      } else {
        console.log('event data.text undefined')
      }
    } else {
      console.log('no data')
    }
  }

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

      // this.connector = new GatsbyConnect()

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
  }

  showContent () {
    if (typeof window !== 'undefined' && this.dataArrived) {
      this.dataArrived = false // don't keep looping on it
      console.log('showing content')
      let content = document.getElementById('content')
      // *todo* here's where Hider does better?
      if (content) {
        // content.style.visibility = 'visible'
        // content.style.display = 'display'
        // *todo* nononono!!! content.style.opacity = '1'
      } else {
        console.log('content div not available for visibility')
      }
    } else if (!this.dataArrived) {
      console.log('not dataArrived')
    }
  }

  componentDidUpdate () {
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

  render = () => {

    console.log('begin LiveVueGatsbyWrap render')
    console.log('Wrap style: ' + JSON.stringify(style))
    console.log(style)

    // let fadeInClass = ''
    let style = {}
    let fadeIn = false
    let fadeTime = 0
    if (!this.inIFrame()) {
      fadeIn = true
      fadeTime = 0
      // fadeInClass = ''
      style = { visibility: 'visible', backgroundColor: '#004d66' }
    } else if (this.state.dataArrived) {
      fadeIn = true
      fadeTime = this.state.editFadeDuration
      style = { visibility: 'visible', display: 'block', backgroundColor: '#004d66' }
      // fadeInClass = 'wrap-fade-in'
    } else { // in live vue, but no data yet
      fadeIn = false
      fadeTime = 0
      style = { visibility: 'hidden', display: 'none', backgroundColor: '#004d66' }
      // fadeInClass = ''
    }

    console.log('Wrap fadeIn: ' + fadeIn + ', time: ' + fadeTime + 'ms')
    console.log(this.props)

    return (
      <LVGatsbyContextB.Provider value={
        {
          liveVue: this.state.isLiveVue,
          dataArrived: this.state.dataArrived,
          editFadeDuration: this.state.editFadeDuration,
          data: this.state.dataArrived
            ? this.state.liveVueData
            : this.props.data,
          children: this.props.children
        }
      }>
        <React.Fragment>
          <ErrorBoundaryB>
              {this.props.children}
          </ErrorBoundaryB>
        </React.Fragment>
      </LVGatsbyContextB.Provider>
    )
  }
}

export {
  LiveVueGatsbyWrap,
  LiveVueDataWrap
}
