define(["./when-4bbc8319"],(function(e){"use strict";return function(t){let r;return function(n){const s=n.data,a=[],i={id:s.id,result:void 0,error:void 0};return e.when(function(t,r,n){let s;try{return s=t(r,n),s}catch(t){return e.when.reject(t)}}(t,s.parameters,a)).then((function(e){i.result=e})).otherwise((function(e){e instanceof Error?i.error={name:e.name,message:e.message,stack:e.stack}:i.error=e})).always((function(){e.defined(r)||(r=e.defaultValue(self.webkitPostMessage,self.postMessage)),s.canTransferArrayBuffer||(a.length=0);try{r(i,a)}catch(t){i.result=void 0,i.error=`postMessage failed with error: ${function(t){let r;const n=t.name,s=t.message;r=e.defined(n)&&e.defined(s)?`${n}: ${s}`:t.toString();const a=t.stack;return e.defined(a)&&(r+=`\n${a}`),r}(t)}\n  with responseMessage: ${JSON.stringify(i)}`,r(i)}}))}}}));