"use strict";function $(e){return document.querySelector(e)}function $$(e){var n={nodeList:document.querySelectorAll(e),arr:[]};for(var t=0;t<n.nodeList.length;t++){n.arr.push(n.nodeList[t])}return n.arr}function noop(){}HTMLElement.prototype.on=HTMLElement.prototype.addEventListener;var bcr=window.bcr||{};bcr={debug:true,log:function(){if(this.debug&&window.console&&window.log){console.log(arguments)}},init:function(){bcr.events.global();bcr.views.detect()}};bcr.utils={call:function(e,n){n.method="POST";var t=this.promise(e,n);t.then(n.success,n.error)},callGet:function(e,n){n.method="GET";var t=this.promise(e,n);t.then(n.success,n.error)},promise:function(e,n){if(n===void 0){n={}}var t=this.toKeyValue(n.data)||"";var r=n.method||"GET";return new Promise(function(n,o){var i=new XMLHttpRequest;i.open(r,e);i.onload=function(){if(i.status==200){n(i.response)}else{o(Error(i.statusText))}};i.onerror=function(){o(Error("Something went wrong ... "))};i.send(t)})},toKeyValue:function(e){if(typeof e!=="object"||Object.keys(e).length===0){return""}var n="";for(var t in e){var r=e[t];if(!n.length){n+=encodeURIComponent(t)+"="+encodeURIComponent(r)}else{n+="&"+encodeURIComponent(t)+"="+encodeURIComponent(r)}}return n},isFn:function(e){return Object.prototype.toString.call(e)==="[object Function]"},toArray:function(e){var n=[];for(var t=0;t<e.length;t++){n.push(e[t])}return n},once:function(e,n){var t;return function(){if(e){t=e.apply(n||this,arguments);e=null}return t}}};bcr.events={global:function(){$$(".view-update").forEach(function(e){e.on("click",function(){bcr.views.render(this.dataset.view)},false)})},index:bcr.utils.once(function(){bcr.log("events.index")},bcr.events),about:bcr.utils.once(function(){bcr.log("events.about")})};bcr.views={detect:function(){if(window.location.hash){this.render(window.location.hash.slice(1))}else{bcr.events.index()}},render:function(e){if(e===void 0){e=""}var n={data:{isPartial:true},success:function(n){$("#view-wrapper").innerHTML=n;if(e===""){e="index"}if(bcr.events[e]&&bcr.utils.isFn(bcr.events[e])){bcr.events[e]()}},error:function(e){bcr.log(e)}};bcr.utils.callGet("/"+e+"?isPartial=true",n)}};bcr.init();