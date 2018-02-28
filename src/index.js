import install from './install';

export { mergeActions, mergeProps } from './helpers';
export { Modules } from './modules';

const Revuejs = {
    install
};

export default Revuejs;

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Revuejs);
};
