(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.revuejs = {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
var SEP = '.';
var isPromise = function isPromise(val) {
    return val && typeof val.then === 'function';
};
var assert = function assert(condition) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    if (!condition) {
        throw new Error('[revuejs]: ' + msg);
    }
};
var isObject = function isObject(obj) {
    return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
};
var normalizeMap = function normalizeMap(map) {
    return Array.isArray(map) ? map.map(function (key) {
        return { key: key, val: key };
    }) : Object.keys(map).map(function (key) {
        return { key: key, val: map[key] };
    });
};
var hasOwn = function hasOwn(target, prop) {
    return {}.hasOwnProperty.call(target, prop);
};

var _Vue = void 0;
function install(Vue) {
    var version = Number(Vue.version.split('.')[0]);
    assert(version >= 2, 'Only supports Vuejs 2');
    if (install.installed) {
        return;
    }
    install.installed = true;
    _Vue = Vue;
    Vue.mixin({
        beforeCreate: function beforeCreate() {
            var options = this.$options;
            if (options.modules) {
                this.$modules = options.modules;
            } else if (options.parent && options.parent.$modules) {
                this.$modules = options.parent.$modules;
            }
        }
    });
}
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(revuejs);
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var _root = void 0;
var Modules = function () {
    function Modules(modules) {
        _classCallCheck(this, Modules);
        assert(_Vue, 'must call Vue.use(revuejs) before creating a modules instance.');
        assert(this instanceof Modules, 'Modules must be called with the new operator.');
        assert(isObject(modules), 'modules must be a plain object');
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
    _createClass(Modules, [{
        key: '_init',
        value: function _init(_root) {
            var _this = this;
            _root.getters = {};
            var computed = {};
            this._modulesNamespaces.forEach(function (namespace) {
                var module = _this._modulesNamespaceMap[namespace];
                var state = module.state;
                _this._rootState[namespace] = state;
                Object.keys(state).forEach(function (key) {
                    _root.getters[key] = function wrappedGetter() {
                        return state[key];
                    };
                });
            });
            _root._vm = new _Vue({
                data: {
                    $$state: this._rootState
                },
                computed: computed
            });
        }
    }, {
        key: '_initNamespacesModules',
        value: function _initNamespacesModules() {
            var _this2 = this;
            Object.keys(this._modules).map(function (key) {
                var namespace = _this2._modules[key].namespace;
                var module = _this2._modules[key];
                assert(!hasOwn(_this2._modulesNamespaceMap, namespace), 'the module key ' + namespace + ' has been duplicate declaration.');
                assert(namespace, 'the namespace of ' + key + ' module must be defined');
                assert(typeof namespace === 'string', 'the namespace of ' + key + ' module must be a string.');
                assert(/^[a-z]+$/.test(namespace), 'the namespace of ' + key + ' module must be defined used lower-case.');
                _this2._modulesNamespaceMap[namespace] = module;
                _this2._modulesNamespaces.push(namespace);
            });
        }
    }, {
        key: '_initNamespaceStates',
        value: function _initNamespaceStates() {
            var _this3 = this;
            this._modulesNamespaces.forEach(function (namespace) {
                var state = _this3._modulesNamespaceMap[namespace].state;
                assert(isObject(state), 'the state of the module named ' + namespace + ' must be a plain object');
                Object.keys(state).forEach(function (key) {
                    assert(!hasOwn(_this3._namespaceStates, '' + namespace + SEP + key), 'the ' + key + ' of the state object in the module named ' + namespace + ' has been duplicate declaration.');
                    _this3._namespaceStates['' + namespace + SEP + key] = state[key];
                });
            });
        }
    }, {
        key: '_initNamespaceActions',
        value: function _initNamespaceActions() {
            var _this4 = this;
            this._modulesNamespaces.forEach(function (namespace) {
                var module = _this4._modulesNamespaceMap[namespace];
                var actions = module.actions,
                    state = module.state;
                assert(isObject(actions), 'the actions of the module named ' + namespace + ' must be a plain object.');
                Object.keys(actions).forEach(function (key) {
                    assert(!hasOwn(_this4._namespaceActions, '' + namespace + SEP + key), 'the ' + key + ' action of the module named ' + namespace + ' has been duplicate declaration.');
                    _this4._namespaceActions['' + namespace + SEP + key] = function wrappedActionHandler(payload) {
                        var _this5 = this;
                        var res = actions[key].call(module, state, payload);
                        if (isPromise(res)) {
                            res.then(function (data) {
                                _this5._changeModuleState(module, data);
                            }).catch(function (e) {
                            });
                        } else {
                            this._changeModuleState(module, res);
                        }
                        return res;
                    };
                });
            });
        }
    }, {
        key: '_changeModuleState',
        value: function _changeModuleState(module, res) {
            var _this6 = this;
            var batchs = [];
            Object.keys(res).forEach(function (key) {
                if (typeof module.state[key] !== 'undefined') {
                    module.state[key] = res[key];
                    batchs.push(key);
                }
            });
            batchs.forEach(function (key) {
                _this6.getters[key]();
            });
        }
    }]);
    return Modules;
}();

var mergeActions = function mergeActions(actions) {
    var _validActions = Object.keys(_root._namespaceActions);
    var actionsVals = void 0;
    var res = {};
    if (Array.isArray(actions)) {
        actionsVals = actions;
    } else {
        assert(isObject(actions), 'the parameter of mergeActions must be a array or plain object');
        actionsVals = Object.values(actions);
    }
    if (!actionsVals.length) {
        return res;
    }
    actionsVals.forEach(function (action) {
        assert(_validActions.includes(action), 'the ' + action + ' action is invalid');
    });
    normalizeMap(actions).forEach(function (_ref) {
        var key = _ref.key,
            val = _ref.val;
        var k = key.indexOf(SEP) > -1 ? key.split(SEP)[1] : key;
        res[k] = function mappedAction() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }
            return _root._namespaceActions[val].apply(_root, [].concat(args));
        };
    });
    return res;
};
var mergeProps = function mergeProps(props) {
    var _validProps = Object.keys(_root._namespaceStates);
    var propsVals = void 0;
    var res = {};
    if (Array.isArray(props)) {
        propsVals = props;
    } else {
        assert(isObject(props), 'the parameter of mergeProps must be a array or plain object');
        propsVals = Object.values(props);
    }
    if (!propsVals.length) {
        return res;
    }
    propsVals.forEach(function (prop) {
        assert(_validProps.includes(prop), 'the ' + prop + ' prop is invalid');
    });
    normalizeMap(props).forEach(function (_ref2) {
        var key = _ref2.key,
            val = _ref2.val;
        var k = key.indexOf(SEP) > -1 ? key.split(SEP)[1] : key;
        var v = val.split(SEP)[1];
        res[k] = function mappedProps() {
            return _root.getters[v]();
        };
    });
    return res;
};

var Revuejs = {
    install: install
};

exports['default'] = Revuejs;
exports.mergeActions = mergeActions;
exports.mergeProps = mergeProps;
exports.Modules = Modules;

Object.defineProperty(exports, '__esModule', { value: true });

})));
