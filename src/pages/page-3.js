import React, {Component} from 'react'
import {Link} from 'gatsby'
import ReactReporter from '../live-vue-js/react-report'

import Layout from '../components/layout'

class ThirdPage extends Component {

  constructor(props) {
    super(props)
    this.reporter = React.createRef()
    setTimeout(this.setContent, 5000)
  }

  state = { show: false, content: 'before content' };

  showModal = () => {
    this.setState({ show: true, content: 'shown content' })
  }

  hideModal = () => {
    this.setState({ show: false, content: 'after content'});
  }

  setContent = () =>  {
    this.reporter.current.report('Bonanza', 'We got there')
  }
  render () {
    return (
      <Layout>
        <div id="main">
        <h1>Hi from the third page</h1>
          <h2> here state content: {this.state.content}</h2>
        </div>
        <p>Welcome to page 3</p>
        <br/>
        <br/>

        <ReactReporter show={this.state.show} handleClose={this.hideModal}
                       ref={this.reporter}
                       title={"This is our Modal now, and I don't care who knows it."}
                       subtitle={"some subtitle or another"}
                       content={ this.state.content }
          pstate={this.state}>
        </ReactReporter>
        <br/>
        <br/>

        <Link to="/page-2">Go back to page two</Link>
        <button onClick={this.setContent}>
          Set Content
        </button>

      </Layout>
    )
  }
}

export default ThirdPage
