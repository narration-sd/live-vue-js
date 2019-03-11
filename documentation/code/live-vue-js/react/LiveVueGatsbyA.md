---
title: LiveVueGatsbyA
---

# LiveVueGatsbyA

## Classes

<dl>
<dt><a href="#LiveVueWrapA">LiveVueWrapA</a></dt>
<dd><p>this is a wrapper Component to enclose a Gatsby Page render tree.
It provides blanking during Live Preview refresh, and fade-in transition,
which is essential for smoothness of view during use.</p>
<p>There&#39;s also an error-presenting wrapper silently included, which will
announce on cases of Page code errors, as may be helpful during development.</p>
</dd>
<dt><a href="#LiveVueGatsbyA">LiveVueGatsbyA</a></dt>
<dd><p>Basis Component to enable Live Vue preview on a Gatsby Page.
It provides all services to manage previewing transit from static to live data
Companion LiveVueWrapA is used to wrap the render tree for the Page.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#LiveVueDataA">LiveVueDataA()</a></dt>
<dd></dd>
</dl>

<a name="LiveVueWrapA"></a>

## LiveVueWrapA
this is a wrapper Component to enclose a Gatsby Page render tree.
It provides blanking during Live Preview refresh, and fade-in transition,
which is essential for smoothness of view during use.

There's also an error-presenting wrapper silently included, which will
announce on cases of Page code errors, as may be helpful during development.

**Kind**: global class  
**Note**: used in combination with LiveVueGatsbyA, which the Page class inherits from  
**Usage**: place LiveVueWrapA in the Page render(), surrounding the actual child components

```
   // here's an example
   render () {
     <LiveVueWrapA>
       ...render tree...
     </LiveVueWrapA>
   }
   ```  
<a name="LiveVueGatsbyA"></a>

## LiveVueGatsbyA
Basis Component to enable Live Vue preview on a Gatsby Page.
It provides all services to manage previewing transit from static to live data
Companion LiveVueWrapA is used to wrap the render tree for the Page.

**Kind**: global class  
**Usage:**: The page inherits from LiveVueGatsbyA, rather than from React.Component.
This allows retrieving preview data on behalf of the Page.  
<a name="LiveVueGatsbyA+liveVueData"></a>

### liveVueGatsbyA.liveVueData([forceLive]) ⇒
provides the automatically switched liveVueData:
 - Gatsby props data as expected for a static page
 - but Craft Live Preview data, when entries are edited in Craft

**Kind**: instance method of [<code>LiveVueGatsbyA</code>](#LiveVueGatsbyA)  
**Returns**: string  

| Param | Type | Default |
| --- | --- | --- |
| [forceLive] | <code>boolean</code> | <code>false</code> | 

**Example**  
create a prop for the element which calls this function, which
will appear on the Page class, then use that data in the rendering Component:
```
    <ShowTheData data={ this.liveVueData()} />
```
<a name="LiveVueDataA"></a>

## LiveVueDataA()
**Kind**: global function  
**Note**: used in combination with LiveVueGatsbyA, which the Page class inherits from  
**Example**  
place LiveVueWrapA in the Page render(), surrounding the actual child components

```
   render () {
     <LiveVueWrapA dataArrived={this.getDataArrived()}>
       [future]...render tree of components which use prop.liveData rather than props.data...
       ...render tree of components which set their data via this.liveVueData()...
       <Example data={this.liveVueData()}/>
     </LiveVueDataA>
   }
   ```
