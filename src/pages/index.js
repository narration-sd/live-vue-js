import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import Image from '../components/image'

const IndexPage = () => (

  <Layout>

    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <p>(well...)</p>
    <div style={{ maxWidth: '300px', marginBottom: '1.45rem' }}>
      <Image />
    </div>
    {/*<Link to="/page-2/">Go to page 2</Link>*/}
    {/*  <br/>*/}
    {/*  <Link to="/page-4/">Go to page 4</Link>*/}
    {/*<br/>*/}
    {/*<Link to="/page-5/">Go to page five</Link>*/}
    <br/>
    <Link to="/page-7/">Go to page seven, and see...</Link>
    <br/>
    <Link to="/page-8/">Go to page eight, where the action is...</Link>
  </Layout>
)

export default IndexPage
