---
title: gatsby-connect
---
<a name="GatsbyConnect"></a>

## GatsbyConnect
Provide Gatsby connection to live vue server

**Kind**: global class  
**Note**: this class may considerably change its function, or
become something else, as we're not using it properly yet  

* [GatsbyConnect](#GatsbyConnect)
    * [new GatsbyConnect(reporter, sourceBase, sourceTag)](#new_GatsbyConnect_new)
    * [.rearrangeData(fullResult)](#GatsbyConnect+rearrangeData) ⇒ <code>Object</code>
    * [.validateLiveVueDiv(response, haltOnError)](#GatsbyConnect+validateLiveVueDiv) ⇒ <code>null</code> \| <code>Object</code>

<a name="new_GatsbyConnect_new"></a>

### new GatsbyConnect(reporter, sourceBase, sourceTag)

| Param | Default | Description |
| --- | --- | --- |
| reporter | <code></code> | callback function to raise a modal usually |
| sourceBase | <code></code> |  |
| sourceTag | <code>gapi/query</code> |  |

<a name="GatsbyConnect+rearrangeData"></a>

### gatsbyConnect.rearrangeData(fullResult) ⇒ <code>Object</code>
**Kind**: instance method of [<code>GatsbyConnect</code>](#GatsbyConnect)  

| Param |
| --- |
| fullResult | 

<a name="GatsbyConnect+validateLiveVueDiv"></a>

### gatsbyConnect.validateLiveVueDiv(response, haltOnError) ⇒ <code>null</code> \| <code>Object</code>
Validate div content

**Kind**: instance method of [<code>GatsbyConnect</code>](#GatsbyConnect)  

| Param | Default |
| --- | --- |
| response |  | 
| haltOnError | <code>true</code> | 

