/* eslint-disable  */
import React, {Component} from 'react'
import {Link} from 'gatsby'
import {StaticQuery, graphql} from 'gatsby'
import SessionStorage from 'gatsby-react-router-scroll/StateStorage.js'

import {
  LiveVueGatsbyB,
  LiveVueWrapB,
  LiveVueDataB,
  LiveVueOnlyWrap
} from '../live-vue-js/react/LiveVueGatsbyB.jsx'
import Reporter from '../live-vue-js/react/Reporter.jsx'
import GatsbyConnect from '../live-vue-js/gatsby-connect.js'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'

import Layout from '../components/layout'

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
    color: 'red', // '#00091a',
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
    <h4>See this: {props.data}</h4>
  </>
}

const Child = () => {
// We wrap the component that actually needs access to
// the lastName property in FamilyConsumer
  return <MyContext.Consumer>{context =>
    <p>{scontext.msg}</p>}</MyContext.Consumer>
}

/**
 * @classdesc the page-7 Page class, inheriting from LiveVueGatsby so we
 * will have Live Vue Craft Preview ability
 * @note inheriting from LiveVueGatsby so we
 * will have Live Vue Craft Preview ability
 * @usage in Page render(), enclose using <LiveVueWrap>...render tree...</LiveVueWrap>
 */
class SeventhPage extends Component {


  render () {
      console.log('page-11 rendering with props: ' + JSON.stringify(this.props))

      const style = {
        // color: 'lightgoldenrodyellow',
        backgroundColor: '#ffffcc'
      }

      const boxStyle = {
        padding: '15px',
        backgroundColor: 'lightgoldenrodyellow'
      }

      return (

        <LiveVueOnlyWrap data={this.props.data}>
          <Layout>
            {/*<div style={style}>*/}
              <h3>The seventh page, with Cards via LiveVueGatsbyB...</h3>

              {/*<SeeSomeData data={'hello there'} />*/}
              <ShowTheCards data={this.props.data}/>

              <br/><br/>
              {/*<Link to="/page-6">Go to sixth page</Link>*/}
              {/*<br/>*/}
              <div style={boxStyle}>
                <Link to="/page-8">Go back to eighth page</Link>
                <br/>
                <Link to="/page-9">Go back to ninth page</Link>
                <br/>
                <Link to="/">Go back to the homepage</Link>
              </div>
            {/*</div>*/}
          </Layout>
        </LiveVueOnlyWrap>
      )
    }

}

export default SeventhPage

export const
  pageQuery = graphql`
      query Cards11 ($id: [Int]) {
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
