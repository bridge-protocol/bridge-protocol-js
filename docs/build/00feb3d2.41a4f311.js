(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{164:function(e,t,r){"use strict";r.d(t,"a",(function(){return m})),r.d(t,"b",(function(){return f}));var a=r(0),n=r.n(a);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},i=Object.keys(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=n.a.createContext({}),p=function(e){var t=n.a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o({},t,{},e)),r},m=function(e){var t=p(e.components);return n.a.createElement(s.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return n.a.createElement(n.a.Fragment,{},t)}},u=Object(a.forwardRef)((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),m=p(r),u=a,f=m["".concat(c,".").concat(u)]||m[u]||b[u]||i;return r?n.a.createElement(f,o({ref:t},s,{components:r})):n.a.createElement(f,o({ref:t},s))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,c=new Array(i);c[0]=u;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:a,c[1]=o;for(var s=2;s<i;s++)c[s]=r[s];return n.a.createElement.apply(null,c)}return n.a.createElement.apply(null,r)}u.displayName="MDXCreateElement"},98:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return c})),r.d(t,"metadata",(function(){return o})),r.d(t,"rightToc",(function(){return l})),r.d(t,"default",(function(){return p}));var a=r(1),n=r(6),i=(r(0),r(164)),c={id:"sdk-utils-claim",title:"Claim",sidebar_label:"Claim"},o={id:"sdk-utils-claim",title:"Claim",description:"Utility functions for interacting with one or more <a href='sdk-models-claimpackage'>ClaimPackage</a>\r",source:"@site/docs\\sdk-utils-claim.md",permalink:"/docs/sdk-utils-claim",sidebar_label:"Claim",sidebar:"gettingStarted",previous:{title:"Token Swap",permalink:"/docs/sdk-services-tokenswap"},next:{title:"Bridge REST Integration Microservice",permalink:"/docs/integration"}},l=[{value:"Functions",id:"functions",children:[{value:"createClaimPackagesFromClaims()",id:"createclaimpackagesfromclaims",children:[]},{value:"verifyClaimPackagesForImport()",id:"verifyclaimpackagesforimport",children:[]}]}],s={rightToc:l};function p(e){var t=e.components,r=Object(n.a)(e,["components"]);return Object(i.b)("wrapper",Object(a.a)({},s,r,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"Utility functions for interacting with one or more ",Object(i.b)("a",{href:"sdk-models-claimpackage"},"ClaimPackage")),Object(i.b)("h2",{id:"functions"},"Functions"),Object(i.b)("h3",{id:"createclaimpackagesfromclaims"},"createClaimPackagesFromClaims()"),Object(i.b)("p",null,"Creates encrypted claim packages from the provided claims"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),"async createClaimPackagesFromClaims(claims, targetPublicKey, passportPublicKey, passportPrivateKey, password)\n")),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"claims")," (",Object(i.b)("a",{href:"sdk-models-claim"},"Claim"),"[]) - claims to create claim packages from"),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"targetPublicKey")," - the public key of the passport the claims will be signed and encrypted for"),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"passportPublicKey")," - the public key of the signing and encrypting passport"),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"passportPrivateKey")," - the private key of the signing and encrypting passport"),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"password")," - the password to unlock the private key of the signing and encrypting passport")),Object(i.b)("hr",null),Object(i.b)("h3",{id:"verifyclaimpackagesforimport"},"verifyClaimPackagesForImport()"),Object(i.b)("p",null,"Verifies the integrity of claim packages to ensure they are suitable for import to the passport"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),"async verifyClaimPackagesForImport(passport, password, claimPackages)\n")),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"passport")," (",Object(i.b)("a",{href:"sdk-models-passport"},"Passport"),") - The passport receiving the claim packages for import"),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"password")," (string) - the password to unlock the private key of the receiving passport"),Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"claimPackages")," (",Object(i.b)("a",{href:"sdk-models-claimpackage"},"ClaimPackage"),"[]) - the claim packages to be imported")))}p.isMDXComponent=!0}}]);