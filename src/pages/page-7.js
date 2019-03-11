/* eslint-disable  */
import React, {Component} from 'react'
import {Link} from 'gatsby'
import {Redirect} from '@reach/router'
import {StaticQuery, graphql} from 'gatsby'
import SessionStorage from 'gatsby-react-router-scroll/StateStorage.js'
import {
  LiveVueGatsby,
  LiveVueWrap,
  LiveVueData
} from '../live-vue-js/react/LiveVueGatsby.jsx'
import Reporter from '../live-vue-js/react/Reporter.jsx'
import GatsbyConnect from '../live-vue-js/gatsby-connect.js'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'

import Layout from '../components/layout'
import {Router} from '@reach/router'

function Body (props) {
  return <React.Fragment>
    <h6>Body: </h6>
    <div dangerouslySetInnerHTML={props.content}></div>
  </React.Fragment>
}

function SafeImage (props) {

  const imgStyle = {
    maxWidth: '600px',
    maxHeight: '600px'
  }

  if (props.image[0]) {
    return <React.Fragment>
      <h6>image:</h6>
      <img src={props.image[0] && props.image[0].url} style={imgStyle}/>
      <h6>image url: {props.image[0].url}</h6>
    </React.Fragment>
  } else {
    return <h3>Missing Image (*todo* later we will have a substitute)</h3>
  }
}

function ShowTheCards (props) {
  /**
   * @classdesc main Page class for showing the Cards content
   * @note it's a functional component
   * @usage in Page render(), <LiveVueWrap>...render tree...</LiveVueWrap>
   */
  console.log('ShowTheCards props: ' + props)
  console.log(props)

  let data = props.data
  if (!data || !data.craftql) {
    return <h3>No data yet</h3>
  }

  let cardStyle = {
    color: '#00091a',
    backgroundColor: 'ffffcc',
    maxWidth: '640px',
    margin: '30px 40px',
    padding: '20px 20px'
  }

  let cards = <h2>No Cards</h2>
  cards = data.craftql.cards.map(card =>
    <React.Fragment key={card.id}>
      <Card style={cardStyle}>
        <h5>title:</h5><h2>{card.title}</h2>
        <Body content={{ __html: card.body.content }}/>
        <SafeImage image={card.image}/>
        <h6>card id: {card.id}</h6>
        {/*<h5>Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... Here is extratext... </h5>*/}
      </Card>
    </React.Fragment>)
  console.log('ShowTheCards rendering with: ' + cards)
  return cards
}

function SeeSomeData (props) {
  return <>
    <h4>Data: </h4>
    <h6>{props.data}</h6>
  </>
}

const Child = () => {
// We wrap the component that actually needs access to
// the lastName property in FamilyConsumer
  return <MyContext.Consumer>{context =>
    <p>{scontext.msg}</p>}</MyContext.Consumer>
}

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  // if (!isLoggedIn() && location.pathname !== `/app/login`) {
  //   // If the user is not logged in, redirect to the login page.
  //   navigate(`/app/login`)
  //   return null
  // }
  navigate('/page-8')
  return null

  // return <Component {...rest} />
}

/**
 * @classdesc the page-7 Page class, inheriting from LiveVueGatsby so we
 * will have Live Vue Craft Preview ability
 * @note inheriting from LiveVueGatsby so we
 * will have Live Vue Craft Preview ability
 * @usage in Page render(), enclose using <LiveVueWrap>...render tree...</LiveVueWrap>
 */
class SeventhPage extends LiveVueGatsby {

  state = {
    liveVueData: {}
  }

  constructor (props) {
    super(props)

    this.state = {
      weHaveToProvideThis: true,
      liveVueData: {} // must provide and not modify this if include or set a state at all.
    }
  }

  componentDidMount () {
    super.componentDidMount() // must call super if using any React lifecycle methods like  this
  }

  render (props) {
    let liveData = this.liveVueData()
    let dataArrived = this.getDataArrived()
    console.log('page-7 rendering with rendering props: ' + JSON.stringify(props))
    console.log('page-7 rendering with props: ' + JSON.stringify(this.props))

    const style = {
      // color: 'lightgoldenrodyellow',
      backgroundColor: '#ffffcc'
    }

    const boxStyle = {
      padding: '15px',
      backgroundColor: 'lightgoldenrodyellow'
    }

    const pathPresent = typeof this.props.location.pathname !== 'undefined'
    const presentPath = pathPresent
      ? this.props.location.pathname
      : ''

    // more incredible nastiness, that  Router or Redirect blows up if not in window during build
    // and fixing that defeats the choice on build. So, patch the choice out for now
    const deviate = true && typeof window !== 'undefined' && pathPresent

    console.log('deviator: ' + presentPath)
    // console.log(props)
    // console.log(this.props)
    return (
      <>
        {deviate ? <Router>
            <Redirect path={presentPath} to={'/page-8/'} noThrow/>
          </Router>
          : <LiveVueWrap
            dataArrived={this.getDataArrived()}
            editFadeDuration={this.getEditFadeDuration()}
          >
            <Layout>
              <div style={style}>
                <h3>The seventh page, with Cards via LiveVueGatsby...</h3>

                <ShowTheCards data={this.liveVueData()}/>

                <br/><br/>
                <Link to="/page-6">Go to sixth page</Link>
                <br/>
                <div style={boxStyle}>
                  <Link to="/page-8">Go back to eighth page</Link>
                  <br/>
                  <Link to="/page-9">Go back to ninth page</Link>
                  <br/>
                  <Link to="/">Go back to the homepage</Link>
                </div>
              </div>
            </Layout>
          </LiveVueWrap>
        }
      </>
    )
  }
}

{/*
<LiveVueWrap
  dataArrived={this.getDataArrived()}
  editFadeDuration={this.getEditFadeDuration()}
>
  <Layout>
    <div style={style}>
      <h3>The seventh page, with Cards via LiveVueGatsby...</h3>

      <ShowTheCards data={this.liveVueData()}/>

      <br/><br/>
      <Link to="/page-6">Go to sixth page</Link>
      <br/>
      <div style={boxStyle}>
        <Link to="/page-8">Go back to eighth page</Link>
        <br/>
        <Link to="/page-9">Go back to ninth page</Link>
        <br/>
        <Link to="/">Go back to the homepage</Link>
      </div>
    </div>
  </Layout>
</LiveVueWrap>
*/
}

export default SeventhPage

export const
  pageQuery = graphql`
      query Cards7 ($id: [Int]) {
          craftql {
              cards: entries (section: cards, id: $id, orderBy: "postDate asc") {
                  ...on CraftQL_Cards {
                      id
                      title
                      # postDate @date(as "F Y")
                      body {
                          content
                      }
                      image {
                          id
                          url: url(transform: cardImage)
                      }
                  }
              }
          }
      }
  `