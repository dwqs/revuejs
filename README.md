[![build pass](https://api.travis-ci.org/dwqs/revuejs.svg?branch=master)](https://travis-ci.org/dwqs/vue-mobx) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) ![npm-version](https://img.shields.io/npm/v/revuejs.svg) ![license](https://img.shields.io/npm/l/revuejs.svg) ![bower-license](https://img.shields.io/bower/l/revuejs.svg)

# revuejs
:rabbit2: A tiny, light and handy state management for vuejs 2, writing less verbose code.

## Installation
Install the pkg with npm:
```
npm install revuejs --save
```
or yarn
```
yarn add revuejs
```
or bower
```
bower install revuejs
```
You can also hot-link the CDN version: https://unpkg.com/revuejs/dist/index.js, `Revuejs` is exposed to `window` object.

## Basic Uasage
#### 1. create a module
```js
// hello.js
export default {
    namespace: 'hello',
    state: {
        title: 'hello'
    },
    actions: {
        changeTitle(state, payload) {
            // return a new state
            return Object.assign({}, state, {
                title: payload.title
            });
        },

        async testAsync(state, payload) {
            await Promise.resolve(2);
            if(err) {
               return {
                   msg: '请求出错了'
               }
            }
            return {
                title: 'async test'
            };
        }
    }
}
```

#### 2. create modules using the module you created
```js
// modules/index.js
import Vue from 'vue';
import Revuejs, { Modules } from 'revuejs';

Vue.use(Revuejs);

import hello from 'path/to/hello';
import otherModule from 'path/to/other-module';

const modules = new Modules({
    hello,
    otherModule
    // others
});

export default modules;
```

#### 3. use it with Vue instance
```js
import Vue from 'vue';
import modules from 'path/to/modules/index';

// ...

const app = new Vue({
    // ...
    modules,
    // ...
});
app.$mount('#app');
```

#### 4. combine Revuejs with Vue components
```js
<template>
    <div>
        <h3>{{title}}</h3>
        <button @click="update">update title</button>
    </div>
</template>    
<script>
    import {mergeActions, mergeProps} from 'revuejs';

    export default {
        computed: {
            ...mergeProps(['hello.title', 'hello.info'])
            // or
            // ...mergeProps({
            //    test: 'hello.title',
            // })
        },

        methods: {
            ...mergeActions(['hello.changeTitle']),

            update(){
                this.changeTitle({
                    title: 'will be update title'
                });
            }
        }
    }
</script>   
```

## Docs
[View the docs here](https://github.com/dwqs/revuejs/wiki).

## Examples
Running the examples:

```
npm install
npm run dev # serve examples at localhost:8000
```

## Thanks

Thanks to [vuex](https://github.com/vuejs/vuex) for the head start.

## LICENSE
MIT
