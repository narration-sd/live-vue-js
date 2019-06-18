/*
 *  @link      https://narrationsd.com/
 *  @copyright Copyright (c) 2018 Narration SD
 *  @license   Craft License https://narrationsd.com/docs/license.html
 */

import React, {Component} from 'react'
import ScrollMem from  '../common/ScrollMem.js'

const LVGatsbyContext = React.createContext('no Context')

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
 * @description To use Live Vue editing for your existing Gatsby page,
 * please refer to the documentation. There are several easy and
 * similar methods to do this, according to whether your page
 * display is from a React Component or a functional component.
 *
 * You'll find there won't be any disturbance to speed or structure
 * of the code you originally designed and proved out on your page.
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
      throw new Error(msg)
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
    revisedResult.data['lvMeta'] = craftResult.lvMeta // power for decisions!

    lvgDevLog('rearrangeToGatsbyData result: ' + JSON.stringify(revisedResult))
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

            ScrollMem.setUp() // correct spot for this, as React is leaving on setState()

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
    ScrollMem.takeDown()
  }

  componentWillUpdate = (nextProps, nextState, nextContext) => {
    if (this.state.isLiveVue) {
      ScrollMem.remember()
    }
  }

  // due for some usage, or deprecate...do we need it?
  report = (title, content) => {
    this.reporter.current.report(title, content)
  }

  render = () => {

    lvgDevLog('begin LiveVueGatsby render')
    lvgDevLog(this.props)

    // *todo* all but style of this preparation can go out, as no longer
    // using Fades.

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
 * editing content from Craft, but we need to substitute it
 * into your Page elements, only during previews.
 *
 * LiveVueData wraps your compnent elements, and does this
 * automatically.
 *
 * @description Please see the documention to see how you can
 * use LiveVueData. It will work at any enclosure level of your
 * components, always doing its work of preview data substitution.
 */
class LiveVueData extends Component {
  static contextType = LVGatsbyContext

  addDataToChildren = (children, data = null) => {

    return React.Children.map(children, child => {

      // could recurse to get them all the way down, but...
      // in truth usually there's a div in the way, so this
      // wouldn't work (not React, no children). So better to
      // be consistent with the <LiveVueData> surround everywhere
      // substitution's expected, like inner <LiveVueDisable>,
      // and this avoids any possible dangers from odd elements.
      // The recursion out: this.addDataToChildren(child.children, data)

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

    return (
      childrenToUse
    )

  }
}

/**
 * @classdesc LiveVueDisable is a component that can be very handy in
 * a Craft Live Preview situation. It allows you to disable controls
 * in your app that could be problematic during previews, like a menu
 * that could move route locatino from the page.
 *
 * @usage To use LiveVueDisable, just surround your problem component
 * or group with it, as:
 * ```
 *   <LiveVueDisable>
 *     ...your component/s...
 *   </LiveVueDisable>
 * ```
 *
 * By default, an h3 'Disabled during Previews' message will replace what's
 * surrounded during Live Vue/Live Preview.
 *
 * You can change this message by passing in a suitable replacement as a
 * JSX prop named `replacement`, as:
 * ```
 *   <LiveVueDisable replacement={<h3>This menu disabled during previews...</h3>}
 * ```
 * The replacement will be rendered as innerHtml content of a div.
 */
function LiveVueDisable (props) {

  const defaultMessage = {
    __html: '<h3>Disabled during Previews</h3>'
  }

  let replacement = typeof props.replacement !== 'undefined'
    ? props.replacement
    : <div dangerouslySetInnerHTML={defaultMessage}></div>

  if (props && props.data && props.data.lvMeta && props.data.lvMeta.isLivePreview) {
    return (replacement)
  } else {
    return props.children
  }
}

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch (error, info) {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: info
    })
  }

  render () {
    if (this.state.hasError) {
      console.log('React Error: this.state.errMsg: ' + this.state.errMsg)
      const errMsgHtml = { __html: this.state.error }
      return (
        <div style={{backgroundColor: 'white',
          padding: '20px', height: '100h', width: '100w'}}>
          <h2>Sorry, something has gone wrong during React rendering.</h2>
          <p>You're likely to find a useful clue by using the
            direct tip or Error Decoder website link that's usually
            offered under Details, just below. </p>
          <p>The decoder if offered is React's method of providing quite
            useful error messages for the compact runtime version, and
            its messages when available are often quite good. </p>
          <details open style={{ whiteSpace: 'pre-wrap',
            fontFamily: 'sans-serif', color: 'darkblue' }}>
            {this.state.error && this.state.error.toString()}
          </details>
          <br/>
          <p><i>A first thing to try, which may often clear a problem that shows here,
            is to freshly copy the query from your latest Gatsby /src page into its Route rule,
            and save this updated Yaml config to your server -- then try the preview again.</i></p>
          <p><i>This will correct (or make more visible) errors that can occur only for preview
            data, and thus wouldn't have shown up in your initial tests of the currently built
            Gatsby page itself (which you should always make for all data that needs to show,
            before previewing).</i></p>
          <p>If refreshing the query this way doesn't help, then normal troubleshooting
            practices apply, and any clues linked from
            the Decoder site, combined with a little backing off of recent
            changes, will usually locate the problem for you rapidly.</p>
          <p>If needing to go further, you'll find a stack trace in the browser
            console,which may show code you can recognize, at or near its top level.</p>
          <p>To get a more readable stack trace and results, you can set
            the Webpack build not to minify -- search online for how
            to do that with your current Gatsby version.</p>
        </div>
      )
    } else {
      return (
        <div>
          {this.props.children}
        </div>
      )
    }
  }
}

export {
  LiveVueGatsby,
  LiveVueData,
  LiveVueDisable
}
