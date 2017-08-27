import { _Vue } from './install';
import { assert, isObject, hasOwn, SEP, isPromise } from './utils';

export let _root;

export class Modules {
    constructor (modules) {
        assert(_Vue, `must call Vue.use(revuejs) before creating a modules instance.`);
        assert(this instanceof Modules, `Modules must be called with the new operator.`);
        assert(isObject(modules), `modules must be a plain object`);

        _root = this;
        this._modules = modules;
        this._modulesNamespaces = [];

        this._rootState = Object.create(null);
        this._modulesNamespaceMap = Object.create(null);
        this._namespaceStates = Object.create(null);
        this._namespaceActions = Object.create(null);

        this._initNamespacesModules();
        this._initNamespaceStates();
        this._initNamespaceActions();
        this._init(_root);
    }

    _init (_root) {
        _root.getters = {};
        const computed = {};

        this._modulesNamespaces.forEach((namespace) => {
            const module = this._modulesNamespaceMap[namespace];
            const { state } = module;
            this._rootState[namespace] = state;
            Object.keys(state).forEach((key) => {
                _root.getters[`${namespace}${SEP}${key}`] = function wrappedGetter () {
                    return state[key];
                };
            });
        });

        // use a Vue instance to store the state tree
        // and initialize the store vm, which is responsible for the reactivity
        _root._vm = new _Vue({
            data: {
                $$state: this._rootState
            },
            computed
        });
    }

    _initNamespacesModules () {
        Object.keys(this._modules).map((key) => {
            const namespace = this._modules[key].namespace;
            const module = this._modules[key];

            assert(!hasOwn(this._modulesNamespaceMap, namespace), `the module key ${namespace} has been duplicate declaration.`);
            assert(namespace, `the namespace of ${key} module must be defined`);
            assert(typeof namespace === 'string', `the namespace of ${key} module must be a string.`);
            assert(/^[a-z]+$/.test(namespace), `the namespace of ${key} module must be defined used lower-case.`);

            this._modulesNamespaceMap[namespace] = module;
            this._modulesNamespaces.push(namespace);
            // _Vue.set(this._modulesNamespaceMap[namespace], namespace, module.state)
        });
    }

    _initNamespaceStates () {
        this._modulesNamespaces.forEach((namespace) => {
            const { state } = this._modulesNamespaceMap[namespace];

            assert(isObject(state), `the state of the module named ${namespace} must be a plain object`);

            Object.keys(state).forEach((key) => {
                assert(!hasOwn(this._namespaceStates, `${namespace}${SEP}${key}`), `the ${key} of the state object in the module named ${namespace} has been duplicate declaration.`);
                this._namespaceStates[`${namespace}${SEP}${key}`] = state[key];
            });
        });
    }

    _initNamespaceActions () {
        this._modulesNamespaces.forEach((namespace) => {
            const module = this._modulesNamespaceMap[namespace];
            const { actions, state } = module;

            assert(isObject(actions), `the actions of the module named ${namespace} must be a plain object.`);

            Object.keys(actions).forEach((key) => {
                assert(!hasOwn(this._namespaceActions, `${namespace}${SEP}${key}`), `the ${key} action of the module named ${namespace} has been duplicate declaration.`);
                this._namespaceActions[`${namespace}${SEP}${key}`] = function wrappedActionHandler (payload) {
                    let res = actions[key].call(module, state, payload);
                    if (isPromise(res)) {
                        res.then((data) => {
                            this._changeModuleState(module, data);
                        }).catch((e) => {
                            // do nothing
                            // assert(false, `async error in _initNamespaceActions: ${e.message}`);
                        });
                    } else {
                        this._changeModuleState(module, res);
                    }
                    return res;
                };
            });
        });
    }

    _changeModuleState (module, res) {
        let batchs = [];
        Object.keys(res).forEach((key) => {
            if (typeof module.state[key] !== 'undefined') {
                module.state[key] = res[key];
                batchs.push(`${module.namespace}${SEP}${key}`);
            }
        });
        batchs.forEach((key) => {
            this.getters[key]();
        });
    }
}
