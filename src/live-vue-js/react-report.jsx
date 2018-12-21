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
    font: '70% sans-serif'
  }
}

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('body') // this is actually the default if don't set

class ReactReport extends React.Component {

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

  render () {

    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={subtitle => this.subtitle = subtitle}>Hello from
            subtitle</h2>
          <h2>{this.state.title} </h2>
          <p>{this.state.content}</p>
          <div
            dangerouslySetInnerHTML={{ __html: 'inner: ' + this.state.content }}></div>
          <br/>
          <button onClick={this.closeModal}>Accept</button>
        </Modal>
      </div>
    )
  }
}

export default ReactReport

