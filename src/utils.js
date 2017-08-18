export const SEP = '.';

export const isPromise = (val) => {
    return val && typeof val.then === 'function';
};

export const assert = (condition, msg = '') => {
    if (!condition) {
        throw new Error(`[revuejs]: ${msg}`);
    }
};

export const isObject = (obj) => {
    return obj !== null && typeof obj === 'object';
};

export const normalizeMap = (map) => {
    return Array.isArray(map)
        ? map.map(key => ({ key, val: key }))
        : Object.keys(map).map(key => ({ key, val: map[key] }));
};

export const hasOwn = (target, prop) => {
    return {}.hasOwnProperty.call(target, prop);
};
