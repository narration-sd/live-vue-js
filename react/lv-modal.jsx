import React from 'react'
import Modal from 'react-modal'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '80%',
    background: '#0c5460',
    color: 'lightgoldenrodyellow'
  },
  html: {
    // fontsize: '14px',
    // *todo* this formatting not working yet...
    font: '70% sans-serif !important'
  }
}

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('body') // this is actually the default if don't set

class LvModal extends React.Component {

  constructor ({ subtitle }) {
    super()

    this.state = {
      modalIsOpen: false,
      content: 'no content yet'
    }

    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  report = (title, content) => {
    this.setState({ modalIsOpen: true, title: title, content: content })
  }

  openModal = () => {
    this.setState({ modalIsOpen: true, title: '', content: '' })
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00'
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  // the point of parseUp() is to allow some formatting of report,
  // but not get into xss vulnerabilities by setting innerHtml,
  // which would be dangerouslySetInnerHtml() in React. This
  // is a function-separable way to do this in JSX
  parseUp (content) {
    let r = /[\s]*<([\w]+)>([\w\s.,=-]+)<\/([\w]+)>[\s]*|<(br)>[\s]*/g

    let index = 0
    let out = []
    let parts = []
    while ((parts = r.exec(content)) !== null) {
      // [0] is full match; [1] is the format'; [2] is the string
      // that we want usually -- but [4] is for br as it's a single
      // Also, the key thing is for React's reactive happiness

      switch (parts[1]) {
        case 'h1':
          out[index] = <h1 key={index++}>{parts[2]}</h1>
          break;
        case 'h2':
          out[index] = <h2 key={index++}>{parts[2]}</h2>
          break;
        case 'h3':
          out[index] = <h3 key={index++}>{parts[2]}</h3>
          break;
        case 'i':
          out[index] = <i key={index++}>{parts[2]}</i>
          break;
        case 'b':
        case 'strong':
          out[index] = <b key={index++}>{parts[2]}</b>
          break;
        default:
          if (parts[4] && parts[4].indexOf('br') >= 0) {
            out[index] = <br key={index++}/>
          }
          else {
            out[index] = <p key={index++}>{parts[2]}</p>
          }
          break;
      }
    }

    return out
  }

  render () {

    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Comms Error:" // *todo* look at this & subtitle also
        >
          <h2 ref={subtitle => this.subtitle = subtitle}>Hello from
            subtitle</h2>
          <h2>{this.state.title}</h2>
          <div>{this.parseUp(this.state.content)}</div>
          <br/>
          <button onClick={this.closeModal}>Accept</button>
        </Modal>
      </div>
    )
  }
}

export default LvModal

