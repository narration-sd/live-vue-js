/*
 *  @link       https://narrationsd.com/
 *  @copyright Copyright (c) 2018 Narration SD
 *  @license   https://narrationsd.com/docs/license.html
 */

import React, {Component} from 'react'
import SessionStorage from 'gatsby-react-router-scroll/StateStorage.js'
// *todo* Gatsby may not need the modal; we have ErrorBoundary?
// import LvModal from './lv-modal.jsx'

// *todo* out until we may return to using Fades, now rather not needed?
// import './lv-fade-in-anim.css'
// import Fade from '@material-ui/core/Fade'
// import Reporter from './Reporter.jsx'

// this is what makes the simple-to-use wrapping design work...
const LVGatsbyContext = React.createContext('no Context')

// *todo* until we select a general log package
let lvgDevLogDev = false // clean unless desired

function lvgDevLog (msg) {
  if (lvgDevLogDev) {
    console.log(msg)
  }
}

/**
 * @classdesc This is the primary component to operate
 * Live Vue Gatsby
 *
 * @usage LiveVueGatsby communicates automatically with
 * the Live Vue Craft plugin, delivering your momentary editing
 * to the Gatsby page shown in the Craft Live Preview panel.
 *
 * This gives you immediate real time viewing of the result, each
 * time a content text, image, etc. is altered. Even while you
 * do this, the currently compiled Gatsby page will continue
 * to be rapidly served, and shown as normal on your website.
 *
 * @note As ever, to make use of a fresh
 * Live Vue/Live Preview edited result, you must save it
 * as the current version in Craft, then rebuild your Gatsby
 * page/s in the usual manner which makes use of the Craft data.
 *
 * @description To use Live Vue editing for your Gatsby site,
 * you'll add a small new component first, with the following code.
 * A nice place for it is near the bottom, just above your pageQuery
 * definition:
 *
 * ```
 * const YourPage = ({ data }) => {
 *
 *  return (
 *    <LiveVueGatsby data={data}>
 *      <Layout>
 *        <LiveVueData>
 *          <YourPageBase data={data}/>
 *        </LiveVueData>
 *      </Layout>
 *    </LiveVueGatsby>
 *  )
 *}
 * ```
 *
 * Before you forget, rename it to your Page component name, then
 * edit the enclosed YourPageBase to match, keeping the 'Base' part.
 * Complete by adding 'Base' to your original Page component's name,
 * and deleting the 'Layout' label from that component, both ends.
 *
 * This will leave you with your Page enclosed in the LiveVueGatsby
 * wrapper, and with shorthand for a React Fragment giving you a
 * div-less collector for your rendering components -- like so:
 *
 * ```
 *    return (
 *      <>
 *        <YourRenderComponent1/>
 *        <YourRenderComponent2 data={this.props.data}/>
 *            ...the rest ofyour render tree...
 *      </>
 *    )
 * ```
 *
 * That's all, except to add imports for Live Vue with the others
 * at the head of your page file:
 * ```
 * import {
 *   LiveVueGatsby,
 *   LiveVueData
 * } from '../live-vue-js/react/LiveVueGatsby.jsx'
 ```
 *
 * You're done!
 *
 * What we've accomplished is the two crucial needs for Live Vue.
 *
 * 1. The entire render of your Page is now controlled by LiveVueGatsby.
 *    This arranges for proper updating during the previews we're enabling.
 *
 * 2. Your rendering components receive any 'data' prop they specify
 *    as normal, but when your page is in Live Preview, this will be
 *    substituted internally with the preview information in Craft.
 *
 * We've done this without disturbing anything about how you've
 * originally designed and proved out your page.
 *
 * So adding Live Vue should be a very smooth process, as outlined
 * in the documentation.
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

    lvgDevLog('Wrap props data: ' + props.data)
    lvgDevLog(props.data)

    if (!props.data) {
      const msg = 'LiveVueGatsby: a valid data prop is required, but it\'s not yet provided!'
      if (typeof window !== 'undefined') {
        // likely fail will come in build, but if some dynamic case, show in app...
        document.write('<h2>Exiting: ' + msg + '</h2>')
      }
      throw new Error (msg)
    }

    // this little dance is JavaScript reflection
    // it works as written because from Gatsby's GraphQL page data query,
    // there will be only the one top element, the particular source introducer
    this.introducer = Object.getOwnPropertyNames(props.data)[0]

    this.state.isLiveVue = this.inIframe()
    this.reporter = React.createRef() // *todo* to be used...will we?
  }

  rearrangeToGatsbyData = (craftResult) => {
    // Now revise CraftQL's normal result into shape Gatsby expects, using the
    // introducer element that we got from the page GraphQL query in the constructor.
    // Thus we're able to work with whatever that introducer turns out to be.

    let revisedResult = { data: {} }
    revisedResult.data[this.introducer] = craftResult.data

    lvgDevLog ('rearrangeToGatsbyData result: ' + JSON.stringify(revisedResult))
    return revisedResult
  }

  inIframe = () => {
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
    // lvgDevLog('child received event: ' + JSON.stringify(event))
    if (event.data === undefined) {
      lvgDevLog('skipping data on undefined')
      return
    }

    if (event.data === '') {
      lvgDevLog('skipping data on empty')
      return
    }

    if (event.data !== undefined) {
      // lvgDevLog('received event is: ' + JSON.stringify(event))
      if (event.data.text !== undefined) {
        // lvgDevLog('event.data.text: ' + event.data.text)

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

          lvgDevLog('receive editFadeDuration: ' + editFadeDuration)

          if (Object.keys(obj.data).length > 0) {
            obj = this.rearrangeToGatsbyData(obj)
            lvgDevLog('json rearranged; obj is: ' + JSON.stringify(obj))

            lvgDevLog('setting state data arrived')
            // there should be only one...
            this.setState({
              liveVueData: obj.data,
              editFadeDuration: editFadeDuration,
              dataArrived: true
            })
            lvgDevLog('state data after receive: ' + JSON.stringify(this.state.liveVueData))
          }
        } catch (error) {
          lvgDevLog('json parse error: ' + error)
        }
      } else {
        lvgDevLog('event data.text undefined')
      }
    } else {
      lvgDevLog('no data')
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

  // nice if this would help us, but it won't
  // shouldComponentUpdate (nextProps, nextState, nextContext) {
  //   return this.state.isLiveVue // if not, not...
  // }

  componentWillUpdate = (nextProps, nextState, nextContext) => {
    if (this.state.isLiveVue) {
      this.location = window.location // window is safe here
      try {
        const currentPosition = new SessionStorage().read(this.location, null)
        if (currentPosition) {
          lvgDevLog('scrolling to: ' + JSON.stringify(currentPosition))
          let x, y
          [x, y] = currentPosition
          window.scrollTo(x, y)
        }
      } catch (e) {
        lvgDevLog('no currentPosition yet: ' + e)
      }
    }
  }

  // due for some usage, or deprecate...do we need it?
  report = (title, content) => {
    this.reporter.current.report(title, content)
  }

  render = () => {

    lvgDevLog('begin LiveVueGatsby render')
    lvgDevLog(this.props)

    // *todo* all but style of this preparation isn't needed unless we bring
    // back Fades. If we might, unlikely, add a material-ui theme available
    // to block entirely for public load.

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
    lvgDevLog('LiveVueGatsby fadeIn: ' + fadeIn +
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
            : this.props.data,
          children: this.props.children
        }
      }>
        <React.Fragment>
          <ErrorBoundary>
            <div style={this.style}>
              {this.props.children}
            </div>
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
 * automatically.
 *
 * @description You won't need to do anything special to your
 * page design or dataflow to enable Live Vue.
 *
 * Do be sure to leave your data prop as normal for each
 * render component that needs it, so that Gatsby will fill
 * in the fast static html page information as expected.
 *
 * Behind the scenes when you're editing in Craft Live Preview,
 * this LiveVueData component will automatically substitute the
 * fresh content for each moment's change into the React portion
 * of those same website pages.
 *
 * This substitution and its display of new or altered content
 * happens only as the pages appear in Craft editing.
 *
 * The live site stays the same, until you may rebuild it with
 * results of such an edit, so that its pages always will have
 * that full Gatsby speed.
 */
class LiveVueData extends Component {
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
    lvgDevLog('begin LiveVueData render; context: ' + this.context)
    lvgDevLog(this.context)

    let childrenToUse =
      this.context.dataArrived &&
      this.context.data !== null
      ? this.addDataToChildren(
        this.props.children,
        this.context.data)
      : this.props.children

    // *todo* this doesn't accomplish all-cases scroll recovery - later
    // we will possibly re-institute an earlier extension on React's
    //
    // const bigStyle = {
    //   height: '10000px'
    // }
    //
    // if (this.context.isLiveVue && !this.context.dataArrived) {
    //   lvgDevLog('LiveVueGatsby render out of Live Vue')
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
      lvgDevLog('this.state.errMsg: ' + this.state.errMsg)
      // You can render any custom fallback UI
      return this.props.msg ? <div>{this.props.msg}</div> : <div>
        <h2>Sorry, something has gone wrong.</h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {this.state.error && this.state.error.toString()}
          <br/>
          {this.state.errorInfo.componentStack}
        </details>
        <div>
          {this.state.errorInfo.componentStack}
        </div>
        {/*// *todo* something to do here, or out?*/}
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
  LiveVueData
}
