(this.webpackJsonpapp=this.webpackJsonpapp||[]).push([[0],{66:function(e,t,c){},84:function(e,t,c){"use strict";c.r(t);var n=c(0),s=c.n(n),r=c(17),a=c.n(r),i=(c(66),c(6)),o=c(88),l=c(89),u=c(96),j=c(95),b=c(93),d=c(92),h=c(94),p=c(91),O=c(97),f=c(98),x=c(90),m=c(59),v=c.n(m),g=c(1),w=function(e){return Object(g.jsx)("div",{className:"text-wrapper",children:Object(g.jsx)("div",{className:"text",children:e})})},k=function(e){if(void 0===e)return"";var t,c,n;if(e.length<6){for(var s=1;e.length<22;)s>0?e+=".":e="."+e,s*=-1;t=e.slice(0,e.length/2),c=e.slice(e.length/2,e.length),n="<span class='pivot-pre'>"+t.slice(0,t.length-1),n+="</span><span class='pivot-mid'>",n+=t.slice(t.length-1,t.length),n+="</span><span class='pivot-post'>",n+=c,n+="</span>"}else{var r=22-(e.length+7);t=(e="......."+e+".".repeat(r)).slice(0,e.length/2),c=e.slice(e.length/2,e.length),n="<span class='pivot-pre'>"+t.slice(0,t.length-1),n+="</span><span class='pivot-mid'>",n+=t.slice(t.length-1,t.length),n+="</span><span class='pivot-post'>",n+=c,n+="</span>"}return n=n.replace(/\./g,"<span class='invisible'>.</span>"),Object(g.jsx)("div",{className:"text-wrapper",children:Object(g.jsx)(v.a,{className:"text",jsx:n})})},y=c(87),S=function(){return Object(g.jsxs)("div",{children:[Object(g.jsx)("p",{children:"This is a speed reader application which can be controlled by commands in the script. Write or copy a script to the editor and press the button to process the script. In the settings you can set the amount of loops the script does, and center the words using a pivot function."}),Object(g.jsx)("p",{children:"The following options are available (More Options are in the making, as well as an Strobe effect for this application):"}),Object(g.jsxs)(y.a,{bordered:!0,children:[Object(g.jsx)("thead",{children:Object(g.jsxs)("tr",{children:[Object(g.jsx)("th",{children:"key (default)"}),Object(g.jsx)("th",{children:"example"}),Object(g.jsx)("th",{children:"description"})]})}),Object(g.jsxs)("tbody",{children:[Object(g.jsxs)("tr",{children:[Object(g.jsx)("td",{children:"wpm (300)"}),Object(g.jsx)("td",{children:"<wpm=300>"}),Object(g.jsx)("td",{children:"Sets the words per minute the script displays. Note: The change will be applied to the word previous to the command!"})]}),Object(g.jsxs)("tr",{children:[Object(g.jsx)("td",{children:"halt"}),Object(g.jsx)("td",{children:"<halt=3>"}),Object(g.jsx)("td",{children:"Makes the script pause for x seconds, displaying the last word previous to the command."})]}),Object(g.jsxs)("tr",{children:[Object(g.jsx)("td",{children:"break"}),Object(g.jsx)("td",{children:"<break=3>"}),Object(g.jsx)("td",{children:"Makes the script pause for x seconds, showing no word during the pause."})]}),Object(g.jsxs)("tr",{children:[Object(g.jsx)("td",{children:"fontsize (10vw)"}),Object(g.jsx)("td",{children:"<fontize=50px>"}),Object(g.jsx)("td",{children:"Sets the fontsize for the words. Any css values are accepted. Note: The change will be applied to the word previous to the command!"})]})]})]}),Object(g.jsx)("p",{children:"This app is mainly to showcase the underlying script reader hook. It is written with React and Typescript. Feel free to use it in your own application, if you have any questions feel free to ask :)"})]})},C=c(2),R=c(36),N=function(){var e=Object(n.useState)(0),t=Object(i.a)(e,2),c=t[0],s=t[1],r=Object(n.useState)(!1),a=Object(i.a)(r,2),o=a[0],l=a[1],u=Object(n.useState)(!1),j=Object(i.a)(u,2),b=j[0],d=j[1],h=Object(n.useRef)(300),p=Object(n.useRef)(setInterval((function(){}),1e6)),O=Object(n.useCallback)((function(){clearInterval(p.current),d(!1)}),[]),f=Object(n.useCallback)((function(){d(!0),clearInterval(p.current),p.current=setInterval((function(){s((function(e){return e+1}))}),6e4/h.current)}),[]),x=Object(n.useCallback)((function(){l(!0),d(!0),p.current=setInterval((function(){s((function(e){return e+1}))}),6e4/h.current)}),[]),m=Object(n.useCallback)((function(){clearInterval(p.current),d(!1),l(!1)}),[]),v=Object(n.useCallback)((function(){clearInterval(p.current),l(!1),d(!1),s(0)}),[]),g=Object(n.useCallback)((function(e){h.current=e,b&&f()}),[b,f]);return{index:c,wpm:h.current,isActive:o,isRunning:b,handleStart:x,handlePause:O,handleResume:f,handleReset:v,handleStop:m,setWPM:g}},E={open:"<",assign:"=",seperator:",",close:">"},T=function(e){var t=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},c=N(),s=c.index,r=c.handleStop,a=c.handleReset,o=Object(n.useState)(e),l=Object(i.a)(o,2),u=l[0],j=l[1],b=Object(n.useRef)(s),d=Object(n.useMemo)((function(){return Object(C.a)(Object(C.a)({},E),t.operators)}),[t.operators]),h=Object(n.useRef)(Object(C.a)({},t.managers)),p=Object(n.useCallback)((function(e){var t=d.open+"[^"+d.close+"]*"+d.close;return e.replace(new RegExp(t,"g"),(function(e){return e.replace(/\s+/g,"")})).split(/\s+/g)}),[d]),O=Object(n.useRef)([""].concat(Object(R.a)(p(u)))),f=Object(n.useCallback)((function(e){h.current=Object(C.a)({},e)}),[]),x=Object(n.useCallback)((function(e){h.current=Object(C.a)(Object(C.a)({},h.current),e)}),[]),m=Object(n.useCallback)((function(){O.current=[""].concat(Object(R.a)(p(u))),a()}),[a,p,u]);return Object(n.useEffect)((function(){m()}),[m]),Object(n.useEffect)((function(){b.current=s;var e=O.current[s+1];if(e&&e.startsWith(d.open+"")){for(var t in h.current){var c=new RegExp(t+d.assign+"[^"+d.seperator+d.close+"]+"),n=e.match(c);if(n){var r=new RegExp(d.assign+"([^"+d.seperator+d.close+"]+)"),a=n[0].match(r);a&&h.current[t](a[1])}}O.current=O.current.filter((function(e,t){return t!==s+1}))}}),[s,d]),Object(n.useEffect)((function(){s>=O.current.length&&r()}),[r,s]),Object(C.a)(Object(C.a)({},c),{},{script:u,index:b.current,indexRef:b,currentWord:O.current[s],wordsRef:O,operators:d,resetScript:m,setScript:j,setOptionManagers:f,addOptionManagers:x})}(e),c=t.index,s=t.currentWord,r=t.indexRef,a=t.wordsRef,o=t.isActive,l=t.setWPM,u=t.handleStart,j=t.handleStop,b=t.resetScript,d=t.handlePause,h=t.handleResume,p=t.addOptionManagers,O=Object(n.useState)(Object(g.jsx)(g.Fragment,{})),f=Object(i.a)(O,2),x=f[0],m=f[1],v=Object(n.useState)((function(){return w})),k=Object(i.a)(v,2),y=k[0],S=k[1],T=Object(n.useRef)(0),I=Object(n.useRef)("10vw"),P=Object(n.useRef)(setTimeout((function(){}),1e6)),M=Object(n.useCallback)((function(e){I.current=e}),[]),L=Object(n.useCallback)((function(e){T.current=e}),[]),z=Object(n.useCallback)((function(e){a.current.splice(r.current+2,0,"","<halt=".concat(e,">"))}),[r,a]),F=Object(n.useCallback)((function(e){d(),clearTimeout(P.current),P.current=setTimeout((function(){h()}),1e3*e)}),[d,h]);return Object(n.useEffect)((function(){p({wpm:l,halt:F,break:z,fontsize:M})}),[p,z,F,M,l]),Object(n.useEffect)((function(){!o&&0!==T.current&&c>=a.current.length&&(T.current=T.current-1,b(),u())}),[c,j,u,b,a,o]),Object(n.useEffect)((function(){m(Object(g.jsx)("div",{className:"h-100 w-100",style:{fontSize:I.current},children:y(s)}))}),[s,y]),Object(C.a)(Object(C.a)({},t),{},{index:c,element:x,setWPM:l,breakFor:z,setLoops:L,setPivotFunction:S})},I=function(){var e=Object(n.useState)(!0),t=Object(i.a)(e,2),c=t[0],s=t[1],r=Object(n.useState)("howTo"),a=Object(i.a)(r,2),m=a[0],v=a[1],y=Object(n.useState)("This is an example how to use this app. <break=1>\nSet the speed by using the wpm option to have <wpm=600> really fast speed or <wpm=100> very slow speed. <wpm=300, break=1>\nYou can also put multiple options in the tags separated by a comma. <break=1>\n"),C=Object(i.a)(y,2),R=C[0],N=C[1],E=Object(n.useState)(0),I=Object(i.a)(E,2),P=I[0],M=I[1],L=Object(n.useState)(!1),z=Object(i.a)(L,2),F=z[0],W=z[1],A=Object(n.useState)(!1),K=Object(i.a)(A,2),B=K[0],J=K[1],q=T(R),G=q.script,H=q.index,U=q.element,Y=q.isActive,D=q.handleStart,Q=q.handlePause,V=q.handleResume,X=q.setPivotFunction,Z=q.resetScript,$=q.setLoops,_=q.setScript;Object(n.useEffect)((function(){$(P)}),[P,$]),Object(n.useEffect)((function(){var e=function(e){"Escape"===e.key&&(Q(),s(!0)),"p"===e.key&&Y&&(B?(V(),J(!1)):(Q(),J(!0)))};return document.addEventListener("keydown",e),function(){return document.removeEventListener("keydown",e)}}),[Q,V,Y,B]);return Object(g.jsxs)(o.a,{className:"h-100 w-100 p-0",fluid:!0,children:[Object(g.jsx)("div",{style:{fontSize:"10vw"},children:Y&&U}),Object(g.jsx)(l.a,{className:"p-3",position:"bottom-center",children:Object(g.jsx)(u.a,{show:!c&&B,children:Object(g.jsx)(u.a.Body,{children:"Script is paused"})})}),Object(g.jsxs)(j.a,{show:c,backdrop:!1,fullscreen:"lg-down",size:"lg",scrollable:!0,centered:!0,dialogClassName:"align-items-stretch",children:[Object(g.jsx)(b.a,{bg:"light",children:Object(g.jsxs)(o.a,{children:[Object(g.jsxs)(d.a,{className:"me-auto",onSelect:function(e,t){null!==e&&v(e)},defaultActiveKey:m,children:[Object(g.jsx)(d.a.Link,{eventKey:"editor",children:"Editor"}),Object(g.jsx)(d.a.Link,{eventKey:"settings",children:"Settings"}),Object(g.jsx)(d.a.Link,{eventKey:"howTo",children:"How to use"})]}),Object(g.jsx)("button",{className:"btn-close",onClick:function(){return s(!1)}})]})}),Object(g.jsx)(j.a.Body,{children:Object(g.jsxs)(h.a.Content,{className:"h-100",children:[Object(g.jsx)(h.a.Pane,{active:"editor"===m,className:"h-100",children:Object(g.jsx)("div",{className:"d-flex flex-column h-100",children:Object(g.jsx)(p.a.Control,{as:"textarea",value:R,style:{resize:"none",flexGrow:1},autoFocus:!0,onChange:function(e){N(e.target.value)}})})}),Object(g.jsx)(h.a.Pane,{active:"settings"===m,children:Object(g.jsx)(O.a,{className:"mb-4 border-0",children:Object(g.jsxs)(f.a,{children:[Object(g.jsxs)(f.a.Item,{children:[Object(g.jsx)(p.a.Label,{children:"Number of Loops"}),Object(g.jsx)(p.a.Control,{type:"number",value:P,onChange:function(e){e.target.validity.valid&&M(Number(e.target.value))},max:10,min:0}),Object(g.jsx)(p.a.Text,{children:"Number of times the script should be repeated."})]}),Object(g.jsx)(f.a.Item,{children:Object(g.jsx)(p.a.Check,{type:"checkbox",id:"use-pivot",label:"Use pivot centering",checked:F,onChange:function(e){W(e.target.checked),X((function(){return e.target.checked?k:w}))}})})]})})}),Object(g.jsx)(h.a.Pane,{active:"howTo"===m,children:Object(g.jsx)(S,{})})]})}),Object(g.jsxs)(j.a.Footer,{children:[Object(g.jsx)(x.a,{variant:G===R?"secondary":"success",onClick:function(){_(R)},children:G===R?"Script processed":"Process Script"}),Object(g.jsx)(x.a,{variant:"primary",onClick:function(){s(!1),J(!1),Y?V():(0!==H&&Z(),D())},children:Y?"Resume":"Start"})]})]})]})};a.a.render(Object(g.jsx)(s.a.StrictMode,{children:Object(g.jsx)(I,{})}),document.getElementById("root"))}},[[84,1,2]]]);