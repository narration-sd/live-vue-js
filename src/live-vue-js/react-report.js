import React from 'react';
// import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("body") // this is actually the default if don't set

export default class ReactReporter extends React.Component {
  constructor({handleClose, show, children, title, content, subtitle, pstate }) {
    super();

    this.state = {
      modalIsOpen: show,
      content: content
    };
    this.title = title
    this.pstate = pstate
    this.content = content // 'orig orig content'


    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  report(title, content) {
    this.title = title
    this.content = content
    this.setState({modalIsOpen: true, title: title, content: content});
  }

  openModal() {
    // this.content = 'local open state'
    this.setState({modalIsOpen: true, title: this.title, content: this.content});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00'
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {

    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={subtitle => this.subtitle = subtitle}>Hello from subtitle</h2>
          <h2>{ this.state.title } </h2>
          <p>{ this.state.content }</p>
          <button onClick={this.closeModal}>close</button>
        </Modal>
      </div>
    );
  }
}
