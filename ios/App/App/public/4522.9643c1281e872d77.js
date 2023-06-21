"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[4522],{4522:(O,E,_)=>{_.r(E),_.d(E,{FilesystemWeb:()=>F});var c=_(5861),R=_(2726),D=_(5346);function v(f){const g=f.split("/").filter(e=>"."!==e),r=[];return g.forEach(e=>{".."===e&&r.length>0&&".."!==r[r.length-1]?r.pop():r.push(e)}),r.join("/")}let F=(()=>{class f extends R.Uw{constructor(){super(...arguments),this.DB_VERSION=1,this.DB_NAME="Disc",this._writeCmds=["add","put","delete"]}initDb(){var r=this;return(0,c.Z)(function*(){if(void 0!==r._db)return r._db;if(!("indexedDB"in window))throw r.unavailable("This browser doesn't support IndexedDB");return new Promise((e,i)=>{const t=indexedDB.open(r.DB_NAME,r.DB_VERSION);t.onupgradeneeded=f.doUpgrade,t.onsuccess=()=>{r._db=t.result,e(t.result)},t.onerror=()=>i(t.error),t.onblocked=()=>{console.warn("db blocked")}})})()}static doUpgrade(r){const i=r.target.result;i.objectStoreNames.contains("FileStorage")&&i.deleteObjectStore("FileStorage"),i.createObjectStore("FileStorage",{keyPath:"path"}).createIndex("by_folder","folder")}dbRequest(r,e){var i=this;return(0,c.Z)(function*(){const t=-1!==i._writeCmds.indexOf(r)?"readwrite":"readonly";return i.initDb().then(n=>new Promise((s,d)=>{const u=n.transaction(["FileStorage"],t).objectStore("FileStorage")[r](...e);u.onsuccess=()=>s(u.result),u.onerror=()=>d(u.error)}))})()}dbIndexRequest(r,e,i){var t=this;return(0,c.Z)(function*(){const n=-1!==t._writeCmds.indexOf(e)?"readwrite":"readonly";return t.initDb().then(s=>new Promise((d,a)=>{const h=s.transaction(["FileStorage"],n).objectStore("FileStorage").index(r)[e](...i);h.onsuccess=()=>d(h.result),h.onerror=()=>a(h.error)}))})()}getPath(r,e){const i=void 0!==e?e.replace(/^[/]+|[/]+$/g,""):"";let t="";return void 0!==r&&(t+="/"+r),""!==e&&(t+="/"+i),t}clear(){var r=this;return(0,c.Z)(function*(){(yield r.initDb()).transaction(["FileStorage"],"readwrite").objectStore("FileStorage").clear()})()}readFile(r){var e=this;return(0,c.Z)(function*(){const i=e.getPath(r.directory,r.path),t=yield e.dbRequest("get",[i]);if(void 0===t)throw Error("File does not exist.");return{data:t.content?t.content:""}})()}writeFile(r){var e=this;return(0,c.Z)(function*(){const i=e.getPath(r.directory,r.path);let t=r.data;const n=r.encoding,s=r.recursive,d=yield e.dbRequest("get",[i]);if(d&&"directory"===d.type)throw Error("The supplied path is a directory.");const a=i.substr(0,i.lastIndexOf("/"));if(void 0===(yield e.dbRequest("get",[a]))){const h=a.indexOf("/",1);if(-1!==h){const b=a.substr(h);yield e.mkdir({path:b,directory:r.directory,recursive:s})}}if(!n&&(t=t.indexOf(",")>=0?t.split(",")[1]:t,!e.isBase64String(t)))throw Error("The supplied data is not valid base64 content.");const u=Date.now(),l={path:i,folder:a,type:"file",size:t.length,ctime:u,mtime:u,content:t};return yield e.dbRequest("put",[l]),{uri:l.path}})()}appendFile(r){var e=this;return(0,c.Z)(function*(){const i=e.getPath(r.directory,r.path);let t=r.data;const n=r.encoding,s=i.substr(0,i.lastIndexOf("/")),d=Date.now();let a=d;const o=yield e.dbRequest("get",[i]);if(o&&"directory"===o.type)throw Error("The supplied path is a directory.");if(void 0===(yield e.dbRequest("get",[s]))){const h=s.indexOf("/",1);if(-1!==h){const b=s.substr(h);yield e.mkdir({path:b,directory:r.directory,recursive:!0})}}if(!n&&!e.isBase64String(t))throw Error("The supplied data is not valid base64 content.");void 0!==o&&(t=void 0===o.content||n?o.content+t:btoa(atob(o.content)+atob(t)),a=o.ctime);const l={path:i,folder:s,type:"file",size:t.length,ctime:a,mtime:d,content:t};yield e.dbRequest("put",[l])})()}deleteFile(r){var e=this;return(0,c.Z)(function*(){const i=e.getPath(r.directory,r.path);if(void 0===(yield e.dbRequest("get",[i])))throw Error("File does not exist.");if(0!==(yield e.dbIndexRequest("by_folder","getAllKeys",[IDBKeyRange.only(i)])).length)throw Error("Folder is not empty.");yield e.dbRequest("delete",[i])})()}mkdir(r){var e=this;return(0,c.Z)(function*(){const i=e.getPath(r.directory,r.path),t=r.recursive,n=i.substr(0,i.lastIndexOf("/")),s=(i.match(/\//g)||[]).length,d=yield e.dbRequest("get",[n]),a=yield e.dbRequest("get",[i]);if(1===s)throw Error("Cannot create Root directory");if(void 0!==a)throw Error("Current directory does already exist.");if(!t&&2!==s&&void 0===d)throw Error("Parent directory must exist");if(t&&2!==s&&void 0===d){const l=n.substr(n.indexOf("/",1));yield e.mkdir({path:l,directory:r.directory,recursive:t})}const o=Date.now(),u={path:i,folder:n,type:"directory",size:0,ctime:o,mtime:o};yield e.dbRequest("put",[u])})()}rmdir(r){var e=this;return(0,c.Z)(function*(){const{path:i,directory:t,recursive:n}=r,s=e.getPath(t,i),d=yield e.dbRequest("get",[s]);if(void 0===d)throw Error("Folder does not exist.");if("directory"!==d.type)throw Error("Requested path is not a directory");const a=yield e.readdir({path:i,directory:t});if(0!==a.files.length&&!n)throw Error("Folder is not empty");for(const o of a.files){const u=`${i}/${o.name}`;"file"===(yield e.stat({path:u,directory:t})).type?yield e.deleteFile({path:u,directory:t}):yield e.rmdir({path:u,directory:t,recursive:n})}yield e.dbRequest("delete",[s])})()}readdir(r){var e=this;return(0,c.Z)(function*(){const i=e.getPath(r.directory,r.path),t=yield e.dbRequest("get",[i]);if(""!==r.path&&void 0===t)throw Error("Folder does not exist.");const n=yield e.dbIndexRequest("by_folder","getAllKeys",[IDBKeyRange.only(i)]);return{files:yield Promise.all(n.map(function(){var d=(0,c.Z)(function*(a){let o=yield e.dbRequest("get",[a]);return void 0===o&&(o=yield e.dbRequest("get",[a+"/"])),{name:a.substring(i.length+1),type:o.type,size:o.size,ctime:o.ctime,mtime:o.mtime,uri:o.path}});return function(a){return d.apply(this,arguments)}}()))}})()}getUri(r){var e=this;return(0,c.Z)(function*(){const i=e.getPath(r.directory,r.path);let t=yield e.dbRequest("get",[i]);return void 0===t&&(t=yield e.dbRequest("get",[i+"/"])),{uri:(null==t?void 0:t.path)||i}})()}stat(r){var e=this;return(0,c.Z)(function*(){const i=e.getPath(r.directory,r.path);let t=yield e.dbRequest("get",[i]);if(void 0===t&&(t=yield e.dbRequest("get",[i+"/"])),void 0===t)throw Error("Entry does not exist.");return{type:t.type,size:t.size,ctime:t.ctime,mtime:t.mtime,uri:t.path}})()}rename(r){var e=this;return(0,c.Z)(function*(){yield e._copy(r,!0)})()}copy(r){var e=this;return(0,c.Z)(function*(){return e._copy(r,!1)})()}requestPermissions(){return(0,c.Z)(function*(){return{publicStorage:"granted"}})()}checkPermissions(){return(0,c.Z)(function*(){return{publicStorage:"granted"}})()}_copy(r,e=!1){var i=this;return(0,c.Z)(function*(){let{toDirectory:t}=r;const{to:n,from:s,directory:d}=r;if(!n||!s)throw Error("Both to and from must be provided");t||(t=d);const a=i.getPath(d,s),o=i.getPath(t,n);if(a===o)return{uri:o};if(function q(f,g){f=v(f),g=v(g);const r=f.split("/"),e=g.split("/");return f!==g&&r.every((i,t)=>i===e[t])}(a,o))throw Error("To path cannot contain the from path");let u;try{u=yield i.stat({path:n,directory:t})}catch{const y=n.split("/");y.pop();const m=y.join("/");if(y.length>0&&"directory"!==(yield i.stat({path:m,directory:t})).type)throw new Error("Parent directory of the to path is a file")}if(u&&"directory"===u.type)throw new Error("Cannot overwrite a directory with a file");const l=yield i.stat({path:s,directory:d}),h=function(){var p=(0,c.Z)(function*(y,m,w){const x=i.getPath(t,y),P=yield i.dbRequest("get",[x]);P.ctime=m,P.mtime=w,yield i.dbRequest("put",[P])});return function(m,w,x){return p.apply(this,arguments)}}(),b=l.ctime?l.ctime:Date.now();switch(l.type){case"file":{const p=yield i.readFile({path:s,directory:d});let y;e&&(yield i.deleteFile({path:s,directory:d})),i.isBase64String(p.data)||(y=D.ez.UTF8);const m=yield i.writeFile({path:n,directory:t,data:p.data,encoding:y});return e&&(yield h(n,b,l.mtime)),m}case"directory":{if(u)throw Error("Cannot move a directory over an existing object");try{yield i.mkdir({path:n,directory:t,recursive:!1}),e&&(yield h(n,b,l.mtime))}catch{}const p=(yield i.readdir({path:s,directory:d})).files;for(const y of p)yield i._copy({from:`${s}/${y.name}`,to:`${n}/${y.name}`,directory:d,toDirectory:t},e);e&&(yield i.rmdir({path:s,directory:d}))}}return{uri:o}})()}isBase64String(r){try{return btoa(atob(r))==r}catch{return!1}}}return f._debug=!0,f})()}}]);