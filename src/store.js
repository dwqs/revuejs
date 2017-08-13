import { _Vue } from './install';
import { assert, isObject } from './utils';

export class Modules {
    constructor (modules) {
        assert(_Vue, `must call Vue.use(revuejs) before creating a modules instance.`);
        assert(this instanceof Modules, `Modules must be called with the new operator.`);
        assert(isObject(modules), `modules must be a plain object`);
        console.log('Store', modules);
        this._init(modules);
    }

    _init (modules) {
        this._modules = modules;
    }
}