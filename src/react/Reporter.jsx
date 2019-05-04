/*
 *  @link       https://narrationsd.com/
 *  @copyright Copyright (c) 2018 Narration SD
 *  @license   https://narrationsd.com/docs/license.html
 */

import React, {Component} from 'react'
import LvModal from './lv-modal.jsx'

class Reporter extends Component {
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
      <LvModal ref={this.reporter}
               subtitle={"some subtitle or another"}></LvModal>
    )
  }
}

export default Reporter
