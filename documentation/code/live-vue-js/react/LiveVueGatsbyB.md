---
title: LiveVueGatsbyB
---

# LiveVueGatsbyB

## Classes

<dl>
<dt><a href="#LiveVueGatsbyWrap">LiveVueGatsbyWrap</a></dt>
<dd><p>This is the primary component to operate
Live Vue Gatsby</p>
</dd>
<dt><a href="#LiveVueDataWrap">LiveVueDataWrap</a></dt>
<dd><p>This is the inner wrap component necessary
to operate Live Vue Gatsby</p>
</dd>
</dl>

<a name="LiveVueGatsbyWrap"></a>

## LiveVueGatsbyWrap
This is the primary component to operate
Live Vue Gatsby

**Kind**: global class  
**Usage**: LiveVueGatsbyWrap communicates automatically
with the Live Vue Craft plugin, delivering your momentary
editing to the Gatsby page shown in the Craft Live Preview
panel. This gives you real time viewing of the result, each
time a content text, image, etc. is altered. Even while you
do this, the currently compiled Gatsby page will continue
to be rapidly served and shown as normal on your website.  
**Note**: As ever, to make use of a fresh
Live Vue/Live Preview edited result, you must save it
as the current version in Craft, then rebuild your Gatsby
page/s in the usual manner which makes use of the Craft data.  

* [LiveVueGatsbyWrap](#LiveVueGatsbyWrap)
    * [new LiveVueGatsbyWrap()](#new_LiveVueGatsbyWrap_new)
    * [.rearrangeToGatsbyData(fullResult)](#LiveVueGatsbyWrap+rearrangeToGatsbyData) ⇒ <code>Object</code>
    * ~~[.liveVueData([forceLive])](#LiveVueGatsbyWrap+liveVueData) ⇒~~

<a name="new_LiveVueGatsbyWrap_new"></a>

### new LiveVueGatsbyWrap()
To use Live Vue editing for your Gatsby site,
you'll wrap the entire render tree of each Page with
this component, and then wrap the content portion of the
tree with the companion component below, LiveVueDataWrap.

**Example**  
At head of your page file, include  the following:
```
import {
  LiveVueGatsbyWrap,
  LiveVueDataWrap
} from '../live-vue-js/react/LiveVueGatsbyB.jsx'
 ```

Then in your Page render(), arrange the top level this way:
```
   return (
     <LiveVueGatsbyWrap>
       ...your render tree...
     </LiveVueGatsbyWrap>
   )
```
<a name="LiveVueGatsbyWrap+rearrangeToGatsbyData"></a>

### liveVueGatsbyWrap.rearrangeToGatsbyData(fullResult) ⇒ <code>Object</code>
**Kind**: instance method of [<code>LiveVueGatsbyWrap</code>](#LiveVueGatsbyWrap)  

| Param |
| --- |
| fullResult | 

<a name="LiveVueGatsbyWrap+liveVueData"></a>

### ~~liveVueGatsbyWrap.liveVueData([forceLive]) ⇒~~
***Deprecated***

provides the automatically switched liveVueData:
 - Gatsby props data as expected for a static page
 - but Craft Live Preview data, when entries are edited in Craft

**Kind**: instance method of [<code>LiveVueGatsbyWrap</code>](#LiveVueGatsbyWrap)  
**Returns**: object displayData  

| Param | Type | Default |
| --- | --- | --- |
| [forceLive] | <code>boolean</code> | <code>false</code> | 

**Example**  
create a prop for the element which calls this function, which
will appear on the Page class, then use that data in the rendering Component:
```
    <ShowTheData data={ this.liveVueData()} />
```
<a name="LiveVueDataWrap"></a>

## LiveVueDataWrap
This is the inner wrap component necessary
to operate Live Vue Gatsby

**Kind**: global class  
**Usage**: LiveVueGatsbyWrap has received Live Preview/Live Vue
editing content from Craft, but we need to communicate it
now to your Page components. LiveVueGatsbyWrap does this
automatically, providing a data prop with the content.  
<a name="new_LiveVueDataWrap_new"></a>

### new LiveVueDataWrap()
To complete installing Live Vue editing for
your Gatsby Page, complete its render tree by inserting
a LiveVueDataWrap just below the Layout component,
and above your own Page components.

**Example**  
In your Page render(), arrange the completed result
in this way:
```
   return (
     <LiveVueGatsbyWrap>
       <Layout>
         <LiveVueDataWrap>
           <Example data={this.props.data}/>
           ...your render components...
         </LiveVueDataWrap>
       </Layout>
     </LiveVueGatsbyWrap>
   )
```
Be sure to leave your current data prop for each
render component in place, so that Gatsby will use
current Craft headless data as normal in development
or build. Live Vue Gatsby will automatically substitute
the fresh content for each moment's change, during the
periods while you're editing in Craft Live Preview.
