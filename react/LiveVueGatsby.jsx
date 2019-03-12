/*
 * @link           https://narrationsd.com/
 * @copyright Copyright (c) 2018 Narration SD
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {Component} from 'react'
// Gatsby may not need the modal; has ErrorBoundary?
// import LvModal from './lv-modal.jsx'
import SessionStorage from 'gatsby-react-router-scroll/StateStorage.js'
// until we may return to using Fades, out
// import './lv-fade-in-anim.css'
// import Fade from '@material-ui/core/Fade'
// import Reporter from './Reporter.jsx'

const LVGatsbyContext = React.createContext('no Context')

/**
 * @classdesc This is the primary component to operate
 * Live Vue Gatsby
 *
 * @usage LiveVueGatsby communicates automatically
 * with the Live Vue Craft plugin, delivering your momentary
 * editing to the Gatsby page shown in the Craft Live Preview
 * panel. This gives you real time viewing of the result, each
 * time a content text, image, etc. is altered. Even while you
 * do this, the currently compiled Gatsby page will continue
 * to be rapidly served and shown as normal on your website.
 *
 * @note As ever, to make use of a fresh
 * Live Vue/Live Preview edited result, you must save it
 * as the current version in Craft, then rebuild your Gatsby
 * page/s in the usual manner which makes use of the Craft data.
 *
 * @description To use Live Vue editing for your Gatsby site,
 * you'll wrap the entire render tree of a Page with
 * this component, and then wrap the content portion of the
 * tree with the companion component described below,
 * LiveVueDataWrap.
 *
 * @example At head of your page file, include  the following:
 * ```
 * import {
 *   LiveVueGatsby,
 *   LiveVueDataWrap
 * } from '../live-vue-js/react/LiveVueGatsby.jsx'
 ```
 *
 * Then in your Page render(), arrange the top level this way:
 * ```
 *    return (
 *      <LiveVueGatsby>
 *        ...your render tree...
 *      </LiveVueGatsby>
 *    )
 * ```
 */
class LiveVueGatsby extends Component {

  state = {
    liveVueData: null,
    dataArrived: false,
    isLiveVue: false,
    editFadeDuration: 802 // identifiable
  }

  constructor (props) {
    super(props)

    console.log('Wrap props data: ' + props.data)
    console.log(props.data)

    this.state.isLiveVue = this.inIFrame()
    this.reporter = React.createRef() // *todo* to be used...?
  }

  rearrangeToGatsbyData (fullResult) {
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

  receiveMessage = (event) => {
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
        // console.log('event.data.text: ' + event.data.text)

        let obj = { data: {} }
        try {
          obj = JSON.parse(event.data.text)

          if (!obj.data) {
            // *todo* here we get into integrating Reporter??
            throw new Error('no data from Live Preview!')
          }

          let editFadeDuration = obj.lvMeta
            ? obj.lvMeta.editFadeDuration
            : 0 // default, which share will use

          console.log('receive editFadeDuration: ' + editFadeDuration)

          if (Object.keys(obj.data).length > 0) {
            obj = this.rearrangeToGatsbyData(obj)
            console.log('json rearranged; obj is: ' + JSON.stringify(obj))

            console.log('setting state data arrived')
            // there should be only one...
            this.setState({
              liveVueData: obj.data,
              editFadeDuration: editFadeDuration,
              dataArrived: true
            })
            console.log('state data after receive: ' + JSON.stringify(this.state.liveVueData))
          }
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
    window.parent.postMessage('loaded', '*')
  }

  componentWillUnmount = () => {
    window.removeEventListener('message', this.receiveMessage)
  }

  // nice if this would help us but it won't
  // shouldComponentUpdate (nextProps, nextState, nextContext) {
  //   return this.state.isLiveVue // if not, not...
  // }

  componentWillUpdate (nextProps, nextState, nextContext) {
    if (this.state.isLiveVue) {
      this.location = window.location // window is safe here
      try {
        const currentPosition = new SessionStorage().read(this.location, null)
        if (currentPosition) {
          console.log('scrolling to: ' + JSON.stringify(currentPosition))
          let x, y
          [x, y] = currentPosition
          window.scrollTo(x, y)
        }
      } catch (e) {
        console.log('no currentPosition yet: ' + e)
      }
    }
  }

  // due for some usage, or deprecate...
  report = (title, content) => {
    this.reporter.current.report(title, content)
  }

  render = () => {

    // *todo* leaving this for the moment.
    // As doesn't accomplish the intended, a safety on
    // scroll recovery regardless of compiled html content
    //
    // const bigStyle = {
    //   height: '10000px'
    // }
    //
    // if (this.state.isLiveVue && !this.state.dataArrived) {
    //   console.log('LiveVueGatsby render out of Live Vue')
    //   return <div style={bigStyle}>nada but big</div>
    // }

    console.log('begin LiveVueGatsby render')
    console.log(this.props)

    let style = {}
    let fadeIn = false
    let fadeTime = 0
    // let fadeInClass = ''
    if (!this.context.isLiveVue) {
      fadeIn = true
      fadeTime = 0
      // fadeInClass = ''
      style = { visibility: 'visible' }
    } else if (this.context.dataArrived) {
      fadeIn = true
      fadeTime = this.context.editFadeDuration
      style = { visibility: 'visible', display: 'block', backgroundColor: '#004d66' }
      // fadeInClass = 'wrap-fade-in'
    } else { // in live vue, but no data yet
      fadeIn = false
      fadeTime = 0
      style = { visibility: 'hidden', display: 'none' }
      // fadeInClass = ''
    }

    // *todo* provide a material-ui theme available to block the Fade
    // entirely for public load. If we need it, after clearing events
    // and if we keep the Fade
    console.log('LiveVueGatsby fadeIn: ' + fadeIn +
      ', fadeTime: ' + fadeTime +
      ', style: ' + JSON.stringify(style))

    return (
      <LVGatsbyContext.Provider value={
        {
          isLiveVue: this.state.isLiveVue,
          dataArrived: this.state.dataArrived,
          editFadeDuration: this.state.editFadeDuration,
          data: this.state.dataArrived
            ? this.state.liveVueData
            : null, // this.props.data,
          children: this.props.children
        }
      }>
        <React.Fragment>
          <ErrorBoundary>
            {/*<Fade in={fadeIn} timeout={fadeTime}>*/}
            <div style={this.style}>
              {this.props.children}
            </div>
            {/*</Fade>*/}
          </ErrorBoundary>
        </React.Fragment>
      </LVGatsbyContext.Provider>
    )
  }
}

/**
 * @classdesc This is the inner wrap component necessary
 * to operate Live Vue Gatsby
 *
 * @usage LiveVueGatsby has received Live Preview/Live Vue
 * editing content from Craft, but we need to communicate it
 * now to your Page components. LiveVueGatsby does this
 * automatically, providing a data prop with the content.
 *
 * @description To complete installing Live Vue editing for
 * your Gatsby Page, enclose its render tree by inserting
 * a LiveVueDataWrap just below the Layout component,
 * and above your own Page components.
 *
 * @example In your Page render(), arrange the completed result
 * in this way:
 * ```
 *    return (
 *      <LiveVueGatsby>
 *        <Layout>
 *          <LiveVueDataWrap>
 *            <YourExampleComponent data={this.props.data}/>
 *            ...your other render components...
 *          </LiveVueDataWrap>
 *        </Layout>
 *      </LiveVueGatsby>
 *    )
 * ```
 * Be sure to leave your current data prop for each
 * render component in place, so that Gatsby will use
 * current Craft headless data as normal in development
 * or build. Live Vue Gatsby will automatically substitute
 * the fresh content for each moment's change, during the
 * periods while you're editing in Craft Live Preview.
 */
class LiveVueDataWrap extends Component {
  static contextType = LVGatsbyContext

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
    console.log('begin LiveVueDataWrap render; context: ' + this.context)
    console.log(this.context)

    let childrenToUse = this.context.dataArrived
      ? this.addDataToChildren(
        this.props.children,
        this.context.data)
      : this.props.children

    // *todo* this doesn't accomplish scroll recovery - later
    // const bigStyle = {
    //   height: '10000px'
    // }
    //
    // if (this.context.isLiveVue && !this.context.dataArrived) {
    //   console.log('LiveVueGatsby render out of Live Vue')
    //   return <div style={bigStyle}>nada but big</div>
    // } else {
    //   return (
    //     childrenToUse
    //   )
    // }

    return (
      childrenToUse
    )

  }
}

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch (error, info) {
    // *todo* Display fallback UI?
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
        {/*//something to do here, or out?*/}
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
  LiveVueDataWrap
}
