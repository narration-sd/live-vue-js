import React, {Component} from 'react'
import {Link} from 'gatsby'
import ReactReporter from '../live-vue-js/react-reporter.js'

import Layout from '../components/layout'

class ThirdPage extends Component {

  state = { show: false };

  showModal = () => {
    this.setState({ show: true });
  }

  hideModal = () => {
    this.setState({ show: false });
  }

  render () {
    return (
      <Layout>
        <h1>Hi from the third page</h1>
        <p>Welcome to page 3</p>
        <button onClick={this.showModal}>
          Open the modal
        </button>
        <br/>
        <br/>

        <ReactReporter show={this.state.show} handleClose={this.hideModal}>
          <h2>Here's our Report</h2>
        </ReactReporter>

        <Link to="/page-2">Go back to page two</Link>
      </Layout>
    )
  }
}

export default ThirdPage
