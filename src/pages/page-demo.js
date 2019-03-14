import React, {Component} from 'react'
import {Link} from 'gatsby'
import {graphql} from 'gatsby'

import Card from '@material-ui/core/Card'
import Layout from '../components/layout'

import {
  LiveVueGatsby,
  LiveVueData
} from '../live-vue-js/react/LiveVueGatsby.jsx'

function Body (props) {
  return <>
    <h6>Body: </h6>
    <div dangerouslySetInnerHTML={props.content}></div>
  </>
}

function SafeImage (props) {

  const imgStyle = {
    maxWidth: '600px',
    maxHeight: '600px'
  }

  if (props.image[0]) {
    return <>
      <h6>image:</h6>
      <img src={props.image[0] && props.image[0].url} style={imgStyle}
           alt={'Card presentation'}/>
      <h6>image url: {props.image[0].url}</h6>
    </>
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

  let data = props.data
  if (!data || !data.craftql) {
    return <h3>No data yet</h3>
  }

  let cardStyle = {
    color: 'darkblue', // '#00091a',
    backgroundColor: '#dddddd',
    maxWidth: '640px',
    margin: '30px 40px',
    padding: '20px 20px'
  }

  let cards = <h2>No Cards</h2>
  let cardsData = data.craftql.cards
  // this is safed also...
  if (cardsData && cardsData.length > 0) {
    cards = data.craftql.cards.map(card =>
      <React.Fragment key={card.id}>
        <Card style={cardStyle}>
          <h5>title:</h5><h2>{card.title}</h2>
          <Body content={{ __html: card.body.content }}/>
          <SafeImage image={card.image}/>
          <h6>card id: {card.id}</h6>
        </Card>
      </React.Fragment>
    )
  }
  return cards
}

/**
 * @classdesc the demo Page class
 * @note Using LiveVueGatsby and LiveVueGatsbyDataWrap components
 * according to https://narrationsd.com/docs/live-vue/live-vue-gatsby-api.html,
 * in order to enable Craft Live Preview.
 */
class LVDemoPage extends Component {

  render () {

    const boxStyle = {
      padding: '15px',
      backgroundColor: '#eeffee'
    }

    const textStyle = {
      color: 'white'
    }

    return (
      <LiveVueGatsby data={this.props.data}>
        <Layout>
          <LiveVueData>
            <h3 style={textStyle}>The Demo page, with Cards via Live Vue Gatsby...</h3>

            <ShowTheCards data={this.props.data}/>

            <br/><br/>
            <div style={boxStyle}>
              <Link to="/">Go back to the homepage</Link>
            </div>
          </LiveVueData>
        </Layout>
      </LiveVueGatsby>
    )
  }

}

export default LVDemoPage

export const
  pageQuery = graphql`
      query DemoCards ($id: [Int]) {
          craftql {
              cards: entries (
                  section: cards,
                  id: $id,
                  orderBy: "postDate asc"
              ) {
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
