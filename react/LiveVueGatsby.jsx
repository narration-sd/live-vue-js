import React, {Component} from 'react'
import {Link} from 'gatsby'
import {StaticQuery, graphql} from 'gatsby'
import GatsbyConnect from '../gatsby-connect.js'
import SessionStorage from 'gatsby-react-router-scroll/StateStorage.js'

import Layout from '../../components/layout'
import Reporter from './Reporter.jsx'

const MyContext = React.createContext('no Context')

var parentMsg = 'could be the message, really? Where\'s the event?'
var scrollPos = [0, 0]


function Relocate () {
  // if (typeof window !== `undefined`) {
  //   console.log('Relocate to: ' + JSON.stringify(scrollPos))
  //   window.scrollTo(scrollPos[0], scrollPos[1])
  // }
  return null
}


class LiveVueGatsby extends React.Component {

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
    data: {}
  }

  constructor (props) {
    super(props)

    this.reporter = React.createRef()

    this.setter = this.props.setter
    // this.state.data = [] // this.props.data
    // this.state.data.craftql.cards[0].title = 'LiveVueGatsby modified title'
    console.log('LiveVueGatsby original state: ' + JSON.stringify(this.state))

    // setTimeout(() => { this.reporter.current.report("Timed Out", this.state.content)}, 5000)
    const id = [2]
    // this.post = this.props.data
    // this.setState({
    //   data: this.props.data
    // })

    // this.props.pageContext['id'] = id
    // this.setData('original data here')
    // console.log('original props: ' + JSON.stringify(this.props))
    console.log('original props.location: ' + JSON.stringify(this.props.location))
    console.log('original props.search: ' + JSON.stringify(this.props.search))
    console.log('original props.testVar: ' + JSON.stringify(this.props.testVar))
    // this.location = this.props.location
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
      console.log('received event is: ' + JSON.stringify(event))
      if (event.data.text !== undefined) {
        parentMsg = event.data.text
        console.log('event.data.text: ' + event.data.text)
        // let's see the jsoniousness  of it
        let obj = { data: {} }
        try {
          obj = JSON.parse(parentMsg)
          console.log('json parse success; obj is: ' + JSON.stringify(obj))
          if (Object.keys(obj.data).length > 0) {
            obj = this.connector.rearrangeData(obj)
            console.log('json rearranged; obj is: ' + JSON.stringify(obj))
          }
        } catch (error) {
          console.log('json parse error: ' + error)
        }

        // parentMsg = 'tempotempo'
        if (obj) {
          let freshState = {
            data: obj,
            parentMsg: parentMsg,
            content: 'We set fresh Live Vue content from receiveMessage...'
          }
          this.setState({
            data: obj.data
          })
          // this.setState(freshState) // on LiveVueGatsby
          console.log('LiveVueGatsby received set state.content: ' + this.state.content)
          // this.setter(freshState) // on SeventhPage
          console.log('LiveVueGatsby received state after setter: ' + JSON.stringify(this.state))

        }
        // this.setState({
        //   data: obj ? obj.data : this.state.data,
        //   parentMsg: parentMsg,
        //   content: 'We set fresh Live Vue content from receiveMessage...'
        // })
        // console.log('state.content: ' + this.state.content)
        this.dataArrived = true
        this.showContent()
        // Relocate()
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
      content.style.visibility = 'visible'
    }
  }

  stripTrailingSlash = (str) => {
    return str.endsWith('/') ? str.slice(0, -1) : str
  }

  componentWillUpdate (nextProps, nextState, nextContext) {
    console.log('componentWillUpdate nextState: ' + JSON.stringify(nextState))
    this.location = window.location
    // // *todo* function out any actual position storage, once it works again
    console.log('will update session storage: ' + JSON.stringify(window.sessionStorage))
    console.log('Reporter: ' + JSON.stringify(new GatsbyConnect()))
    console.log('SessionStorage: ' + JSON.stringify(new SessionStorage()))
    console.log('location.pathname: ' + this.location.pathname)
    console.log('props location pathname: ' + this.props.location.pathname)
    // this.location.pathname = this.stripTrailingSlash(this.location.pathname) + '/'
    const currentPos = new SessionStorage().read(this.props.location, null)
    console.log('xcurrentPos: ' + JSON.stringify(currentPos))
    console.log('this.location: ' + JSON.stringify(this.location))

    // for (var i = 0; i < window.sessionStorage.length; i++) {
    //   console.log('key' + i + ': ' + window.sessionStorage.key(i))
    //   console.log(window.sessionStorage.getItem(window.sessionStorage.key(i)))
    // }
    // console.log('ours: ' + window.sessionStorage.getItem('@@scroll|/page-7'))
    // console.log('ours/: ' + window.sessionStorage.getItem('@@scroll|/page-7/'))
    // console.log('typeof ours/: ' + typeof window.sessionStorage.getItem('@@scroll|/page-7/'))
    // console.log('mine: ' + window.sessionStorage.getItem('mine'))
    // const currentPos = window.sessionStorage.getItem('@@scroll|/page-7/')
    // const currentPos = window.sessionStorage.getItem('mine')
    let currentPosition = [0, 80]
    // let currentPos = currentPosition
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
    // let theData = this.connector.liveVue(dataQuery)
    //
    // if (theData) {
    //   console.log('Live Vue data present: ' + JSON.stringify(theData))
    //   // so we'll reactively show it...
    //   this.setState(
    //     {
    //       content: 'We set fresh Live Vue content from connector.liveVue...',
    //       data: theData
    //     }
    //   )
    //   this.dataArrived = true
    // } else { // normal run case
    //   // *todo* Here's the looping problem -- result of setState
    //   // this.setState({
    //   //   data: this.props.data
    //   // })
    // }
    console.log('componentDidMount state.content: ' + this.state.content)
    console.log('componentDidMount state: ' + JSON.stringify(this.state))
    Relocate()
  }

  componentDidUpdate () {
    // Relocate()
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

//   render () {
//
//     let values = {
//       styles: {
//         visibility: 'visible'
//       },
//       msg: 'our message',
//       newData: 'new data here from state?',
//       data: this.state.data
//     }
//
//     console.log('LiveVueGatsby render values: ' + JSON.stringify(values))
//     // return this.props.children
//
//     return (<MyContext.Provider value={values}>
//       <ErrorBoundary>
//         <Hider props={this.props}>
//           {/*<div>*/}
//           {this.props.children}
//           {/*</div>*/}
//         </Hider>
//       </ErrorBoundary>
//     </MyContext.Provider>)
//   }
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
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

function rev (val) {
  return 'rev ' + val
}

class Hider extends React.Component {

  childrenWithProps = null

  constructor (props) {
    super(props)
      console.log('Hider props data: ' + JSON.stringify(this.props.data))
  }

  addDataToChildren = (data) => {
    const { children } = this.props;
    const extraProps = { data: data }
    console.log('childrenWithProps extraProps: ' + JSON.stringify(extraProps))

    this.childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, extraProps)
    )

    console.log('childrenWithProps result props data: ' + JSON.stringify(this.childrenWithProps[0].props.data))
  }

  render = () => {
    return (<div>
      <MyContext.Consumer>{context =>
        <div>
          {/*{ alert('We got: ' + context.data) }*/}
          {/*<p>{rev(context.msg)}</p>*/}
          {this.addDataToChildren(context.data)}
          <div style={context.styles} >
            <h2>Do we see this?</h2>
            {/*{this.props.children}*/}
            { this.childrenWithProps }
          </div>
        </div>
      }
      </MyContext.Consumer>
    </div>)
  }

}

// function Hider (props) {
//
//   console.log('Hider props data: ' + JSON.stringify(this.parent.props))
//   let otherProps = {
//     ourData: { dataHere: 'new state data here'}
//   }
//
//   // const { children } = this.props;
//   //
//   // const childrenWithProps = React.Children.map(children, child =>
//   //   React.cloneElement(child, otherProps)
//   // )
//
// // throw new Error('Hider stop')
//   return (
//     <div>
//       <MyContext.Consumer>{context =>
//         <div>
//           {/*{ alert('We got: ' + context.msg) }*/}
//           {/*<p>{rev(context.msg)}</p>*/}
//           <div style={context.styles} dummy=>
//             {/*<h2>Do we see this?</h2>*/}
//             {props.children}
//             {/*{ childrenWithProps }*/}
//           </div>
//         </div>
//       }
//       </MyContext.Consumer>
//     </div>
//   )
// }

export {
  LiveVueGatsby,
  ErrorBoundary,
  MyContext
}
