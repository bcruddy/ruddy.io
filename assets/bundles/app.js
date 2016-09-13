"use strict";function $(selector){return document.querySelector(selector)}function $$(selector){var elements={nodeList:document.querySelectorAll(selector),arr:[]};for(var i=0;i<elements.nodeList.length;i++){elements.arr.push(elements.nodeList[i])}return elements.arr}function noop(){}HTMLElement.prototype.on=HTMLElement.prototype.addEventListener;var bcr=window.bcr||{};bcr={debug:true,log:function(){if(this.debug&&window.console&&window.log){console.log(arguments)}},init:function(){bcr.events.global();bcr.views.detect()}};bcr.utils={call:function(endpoint,options){options.method="POST";var req=this.promise(endpoint,options);req.then(options.success,options.error)},callGet:function(endpoint,options){options.method="GET";var req=this.promise(endpoint,options);req.then(options.success,options.error)},promise:function(endpoint,options){if(options===void 0){options={}}var data=this.toKeyValue(options.data)||"";var method=options.method||"GET";return new Promise(function(resolve,reject){var req=new XMLHttpRequest;req.open(method,endpoint);req.onload=function(){if(req.status==200){resolve(req.response)}else{reject(Error(req.statusText))}};req.onerror=function(){reject(Error("Something went wrong ... "))};req.send(data)})},toKeyValue:function(obj){if(typeof obj!=="object"||Object.keys(obj).length===0){return""}var qs="";for(var key in obj){var val=obj[key];if(!qs.length){qs+=encodeURIComponent(key)+"="+encodeURIComponent(val)}else{qs+="&"+encodeURIComponent(key)+"="+encodeURIComponent(val)}}return qs},isFn:function(fnLike){return Object.prototype.toString.call(fnLike)==="[object Function]"},toArray:function(arrayLike){var arr=[];for(var i=0;i<arrayLike.length;i++){arr.push(arrayLike[i])}return arr},once:function(fn,context){var result;return function(){if(fn){result=fn.apply(context||this,arguments);fn=null}return result}}};bcr.events={global:function(){$$(".view-update").forEach(function(element){element.on("click",function(){bcr.views.render(this.dataset.view)},false)})},index:bcr.utils.once(function(){bcr.log("events.index")},bcr.events),about:bcr.utils.once(function(){bcr.log("events.about")})};bcr.views={detect:function(){if(window.location.hash){this.render(window.location.hash.slice(1))}else{bcr.events.index()}},render:function(view){if(view===void 0){view=""}var options={data:{isPartial:true},success:function(res){$("#view-wrapper").innerHTML=res;if(view===""){view="index"}if(bcr.events[view]&&bcr.utils.isFn(bcr.events[view])){bcr.events[view]()}},error:function(err){bcr.log(err)}};bcr.utils.callGet("/"+view+"?isPartial=true",options)}};bcr.init();