import { SEP, normalizeMap, assert, isObject } from './utils';
import { _root } from './modules';

export const mergeActions = (actions) => {
    const _validActions = Object.keys(_root._namespaceActions);
    let actionsVals;
    let res = {};

    if (Array.isArray(actions)) {
        actionsVals = actions;
    } else {
        assert(isObject(actions), 'the parameter of mergeActions must be a array or plain object');
        actionsVals = Object.values(actions);
    }

    // empty parameter
    if (!actionsVals.length) {
        return res;
    }

    // decide all action is valid
    actionsVals.forEach((action) => {
        assert(_validActions.includes(action), `the ${action} action is invalid`);
    });

    normalizeMap(actions).forEach(({ key, val }) => {
        const k = key.split(SEP)[1];
        res[k] = function mappedAction (...args) {
            return _root._namespaceActions[val].apply(_root, [].concat(args));
        };
    });

    return res;
};

export const mergeProps = (props) => {
    const _validProps = Object.keys(_root._namespaceStates);
    let propsVals;
    let res = {};

    if (Array.isArray(props)) {
        propsVals = props;
    } else {
        assert(isObject(props), 'the parameter of mergeProps must be a array or plain object');
        propsVals = Object.values(props);
    }

    // empty parameter
    if (!propsVals.length) {
        return res;
    }

    // decide all prop is valid
    propsVals.forEach((prop) => {
        assert(_validProps.includes(prop), `the ${prop} prop is invalid`);
    });

    normalizeMap(props).forEach(({ key, val }) => {
        const k = key.split(SEP)[1];
        res[k] = function mappedProps () {
            return _root._namespaceStates[val];
        };
    });

    return res;
};
