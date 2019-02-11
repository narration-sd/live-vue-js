import React, {Component} from 'react'
import {Link} from 'gatsby'
import {StaticQuery, graphql} from 'gatsby'
import GatsbyConnect from '../gatsby-connect.js'
import SessionStorage from 'gatsby-react-router-scroll/StateStorage.js'

import Layout from '../../components/layout'
import Reporter from './Reporter.jsx'

const MyContext = React.createContext('no Context')

class LiveVueGatsby extends React.Component {

  state = {
    testVar: 'unset'
  }

  constructor (props) {
    super(props)
    this.setState({ testVar: 'testVar' })
  }

  render () {

    let values = {
      styles: {
        visibility: 'visible'
      },
      msg: 'our message'
    }

    return (<MyContext.Provider value={values}>
      <ErrorBoundary>
        <Hider>
          <div>
            {this.props.children}
          </div>
        </Hider>
      </ErrorBoundary>
    </MyContext.Provider>)
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

function Hider (props) {
  return (
    <div>
      <MyContext.Consumer>{context =>
        <div>
          <p>{rev(context.msg)}</p>
          <div style={context.styles}>
            <h2>Do we see this?</h2>
            {props.children}
          </div>
        </div>
      }
      </MyContext.Consumer>
    </div>
  )
}

export {
  LiveVueGatsby,
  ErrorBoundary,
  MyContext
}
