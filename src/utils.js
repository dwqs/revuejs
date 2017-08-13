export const isArray = (prame) => {
    return Object.prototype.toString.call(this) === '[object Array]';
};

export const assert = (condition, msg = '') => {
    if (!condition) {
        throw new Error(`[revuejs]: ${msg}`);
    }
};

export const isObject = (obj) => {
    return obj !== null && typeof obj === 'object';
};
