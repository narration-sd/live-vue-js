import React, {Component} from 'react'
import {Link} from 'gatsby'
import Reporter from '../live-vue-js/react/Reporter.jsx'

import Layout from '../components/layout'

// import Fade from '@material-ui/core/Fade'


class ThirdPage extends Component {

  constructor(props) {
    super(props)
    this.reporter = React.createRef()
    // setTimeout(() => { this.reporter.current.report("Timed Out", this.state.content)}, 5000)
  }

  state = { show: false, content: 'This is our own state content' };

  report = (title, content) => { this.reporter.current.report (title, content) }

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
    this.report('BonanzaWarn', '<h2>More Complex...</h2>\n<p>content set from button</p><br><p>\n...and with a break</p>')
  }

  render () {
    return (
      <Layout>
        <div id="main">
        <h1>Hi from the third page</h1>
          <h2>{this.state.content}</h2>
        </div>
        <p>Welcome to page 3</p>
        <br/>
        <br/>
        <button onClick={ (e) => { this.openDialog('What ho, from click event') }}>Open Dialog</button>
        <button onClick={ (e) => { this.reporter.current.report('A Report', 'reporting, thing from a click event') }}>Report thing</button>
        <button onClick={ (e) => { this.reporter.current.report('A Report', this.state.content) }}>Report state</button>

        <Reporter ref={this.reporter} />
        <br/>
        <br/>

        <Link to="/page-4">Go on to fourth page</Link>
        <br/>
        <Link to="/page-2">Go back to page two</Link>
        <br/>
        <button onClick={this.openWarn}>
          Set Content
        </button>

      </Layout>
    )
  }
}

export default ThirdPage
