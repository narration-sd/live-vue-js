import React, {Component} from 'react'
import ReactReport from '../live-vue-js/react-report.jsx'

class ReactReporter extends Component {
  constructor (props) {
    super(props)
    this.reporter = React.createRef()
  }

  state = { show: false, content: 'This is parent state content' }

  report = (title, content) => {
    this.reporter.current.report(title, content)
  }

  render () {
    return (
      <ReactReport ref={this.reporter}
                   subtitle={"some subtitle or another"}></ReactReport>
    )
  }
}

export default ReactReporter
