import { assert } from './utils';

export let _Vue;

export default function install (Vue) {
    const version = Number(Vue.version.split('.')[0]);
    assert(version >= 2, `Only supports Vuejs 2`);

    if (install.installed) {
        return;
    }
    install.installed = true;

    _Vue = Vue;

    Vue.mixin({
        beforeCreate () {
            const options = this.$options;
            if (options.modules) {
                this.$modules = options.modules;
            } else if (options.parent && options.parent.$modules) {
                this.$modules = options.parent.$modules;
            }
        }
    });
};

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Revuejs);
}
