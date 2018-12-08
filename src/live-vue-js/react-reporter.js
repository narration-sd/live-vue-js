import React from 'react'
import '../live-vue-js/reporter-style.css'

const ReactReporter = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none"

  return (
     <div className={ showHideClassName }>
      <section className="modal-main">
        <p>What we say</p>
        {children}
        <button onClick={handleClose}>close</button>
      </section>
    </div>
  )
}

export default ReactReporter
