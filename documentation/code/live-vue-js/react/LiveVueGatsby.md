---
title: LiveVueGatsby
---
## Classes

<dl>
<dt><a href="#LiveVueWrap">LiveVueWrap</a></dt>
<dd><p>this is a wrapper Component to enclose a Gatsby Page render tree.
It provides blanking during Live Preview refresh, and fade-in transition,
which is essential for smoothness of view during use.</p>
<p>There&#39;s also an error-presenting wrapper silently included, which will
announce on cases of Page code errors, as may be helpful during development.</p>
</dd>
<dt><a href="#LiveVueGatsby">LiveVueGatsby</a></dt>
<dd><p>Basis Component to enable Live Vue preview on a Gatsby Page.
It provides all services to manage previewing transit from static to live data
Companion LiveVueWrap is used to wrap the render tree for the Page.</p>
</dd>
</dl>

<a name="LiveVueWrap"></a>

## LiveVueWrap
this is a wrapper Component to enclose a Gatsby Page render tree.
It provides blanking during Live Preview refresh, and fade-in transition,
which is essential for smoothness of view during use.

There's also an error-presenting wrapper silently included, which will
announce on cases of Page code errors, as may be helpful during development.

**Kind**: global class  
**Note**: used in combination with LiveVueGatsby, which the Page class inherits from  
**Usage**: place LiveVueWrap in the Page render(), surrounding the actual child components

```
   // here's an example
   render () {
     <LiveVueWrap>
       ...render tree...
     </LiveVueWrap>
   }
   ```  
<a name="LiveVueGatsby"></a>

## LiveVueGatsby
Basis Component to enable Live Vue preview on a Gatsby Page.
It provides all services to manage previewing transit from static to live data
Companion LiveVueWrap is used to wrap the render tree for the Page.

**Kind**: global class  
**Usage:**: The page inherits from LiveVueGatsby, rather than from React.Component.
This allows retrieving preview data on behalf of the Page.  
<a name="LiveVueGatsby+liveVueData"></a>

### liveVueGatsby.liveVueData([forceLive]) ⇒
provides the automatically switched data:
 - Gatsby props data as expected for a static page
 - but Craft Live Preview data, when entries are edited in Craft

**Kind**: instance method of [<code>LiveVueGatsby</code>](#LiveVueGatsby)  
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
