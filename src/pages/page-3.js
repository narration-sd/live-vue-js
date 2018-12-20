import React, {Component} from 'react'
import {Link} from 'gatsby'
import ReactReporter from '../live-vue-js/react-report.jsx'

import Layout from '../components/layout'

class ThirdPage extends Component {

  constructor(props) {
    super(props)
    this.reporter = React.createRef()
    setTimeout(() => { this.reporter.current.report("Timed Out", this.state.content)}, 5000)
  }

  state = { show: false, content: 'This is parent state content' };

  showModal = () => {
    this.setState({ show: true, content: 'shown content' })
  }

  hideModal = () => {
    this.setState({ show: false, content: 'after content'});
  }

  setContent = (line) =>  {
    this.reporter.current.report('Bonanza', line)
  }

  openDialog = (line) => {
    this.setContent(line)
  }

  openWarn = () => {
    this.openDialog('Now we do from button')
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
        <button onClick={ (e) => { this.openDialog('What ho, from click event') }}>Open Dialog</button>
        <button onClick={ (e) => { this.reporter.current.report('A Report', 'reporting, from a click event') }}>Report thing</button>
        <button onClick={ (e) => { this.reporter.current.report('A Report', this.state.content) }}>Report state</button>

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
        <button onClick={this.openWarn}>
          Set Content
        </button>

      </Layout>
    )
  }
}

export default ThirdPage
