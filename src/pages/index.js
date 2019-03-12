import React from 'react'
import {Link} from 'gatsby'

import Layout from '../components/layout'
import Image from '../components/image'

const boxStyle = {
  padding: '15px',
  backgroundColor: '#eeffee'
}

const pageStyle = {
  backgroundColor: '#ffffee',
  padding: '20px'
}

const IndexPage = () => (

  <Layout>
    <div style={pageStyle}>
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.
        (well...this is what they say...)</p>
      <div style={{ maxWidth: '300px', marginBottom: '1.45rem' }}>
        <Image/>
      </div>
      <div style={boxStyle}>
        <Link to="/page-demo/">Go to Demo page, where the action is...</Link>
      </div>
    </div>
  </Layout>
)

export default IndexPage
