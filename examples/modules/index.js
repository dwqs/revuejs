import Vue from 'vue';
import Revuejs, { Modules } from 'revuejs';

import counter from './counter';
import todo from './todo';
import repos from './repos';

Vue.use(Revuejs);

export default new Modules({
    counter,
    todo,
    repos
});
