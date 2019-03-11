/*
 * @link           https://narrationsd.com/
 * @copyright Copyright (c) 2018 Narration SD
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {Component} from 'react'
import LvModal from './lv-modal.jsx'
import SessionStorage from 'gatsby-react-router-scroll/StateStorage.js'
// import './lv-fade-in-anim.css'
// import Fade from '@material-ui/core/Fade'
// import Reporter from './Reporter.jsx'

const LVGatsbyContextB = React.createContext('no Context')

class LiveVueGatsbyWrap extends Component {

  state = {
    liveVueData: {},
    isLiveVue: false
  }

  constructor (props) {
    super(props)

    if (this.state === undefined) {
      // we'll provide our own, but otherwise use theirs
    }

    console.log('Wrap props data: ' + props.data)
    console.log(props.data)
    this.state.dataArrived = false
    this.state.liveVueData = null
    this.state.isLiveVue = this.inIFrame()
    this.state.editFadeDuration = 802

    this.reporter = React.createRef() // *todo* to be used...?
  }

  /**
   * @param fullResult
   * @returns {{data: {craftql: {cards: *}}}}
   */
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
    // if (!isliveVueData) {
    //   console.log('showContent on call to liveVueData')
    //   this.showContent()
    // }

    let displayData = isliveVueData
      ? this.props.data
      : this.state.liveVueData

    return displayData
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

  // nice if this would help us
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
          [ x, y ] = currentPosition
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

    // *todo* this little number can't be done but for dev test
    if (false && !this.state.isLiveVue) {
      console.log('LiveVueGatsbyWrap render out of Live Vue')
      return null // but why are we called?
    }
    console.log('begin LiveVueGatsbyWrap render')
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
    console.log('LiveVueGatsbyWrap fadeIn: ' + fadeIn +
      ', fadeTime: ' + fadeTime +
      ', style: ' + JSON.stringify(style))

    return (
      <LVGatsbyContextB.Provider value={
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
          <ErrorBoundaryB>
            {/*<Fade in={fadeIn} timeout={fadeTime}>*/}
              <div style={this.style}>
              {this.props.children}
              </div>
            {/*</Fade>*/}
          </ErrorBoundaryB>
        </React.Fragment>
      </LVGatsbyContextB.Provider>
    )
  }
}


class LiveVueDataWrap extends Component {
  static contextType = LVGatsbyContextB

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

    return (
      childrenToUse
    )
  }
}

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

export {
  LiveVueGatsbyWrap,
  LiveVueDataWrap
}
