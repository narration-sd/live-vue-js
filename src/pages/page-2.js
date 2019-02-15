import React from 'react'
import {Link} from 'gatsby'

import Layout from '../components/layout'

const styles = {
  // margin: '20px',
  marginLeft: '-100px',
  width: '1200px', // document.body.clientWidth - 400, // '100%',
  height: '2000px', //(window.innerHeight - 250).toString() + 'px', // '800px',  //document.body.clientHeight + 200, // '400px',
  padding: '5px',
  // backgroundColor: 'lightblue',
  border: '0px solid red',
  overflow: 'hidden'
}

const SecondPage = () => (

  <Layout>
    {/*<h1>Hi from the second page</h1>*/}
    {/*<p>Welcome to page 2</p>*/}
    <iframe title={'Docs'} src={"https://narrationsd.com/docs/live-vue"} style={styles}></iframe>
    <Link to="/page-3">Go on to third page</Link>
    {/*<br/>*/}
    {/*<Link exact to="http://narrationsd.com/docs/live-vue">Go to Doc</Link>*/}
    <br/>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default SecondPage
