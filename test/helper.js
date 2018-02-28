import test from 'ava';
import Vue from 'vue';
import Revuejs, { Modules, mergeActions, mergeProps } from '../dist/index';

let counter;
let modules;

test.beforeEach(t => {
    Vue.use(Revuejs);
    counter = {
        namespace: 'counter',
        state: {
            count: 0,
            title: 'test count'
        },
        actions: {
            increase (state, payload) {
                let newCount = state.count + 1;
                return Object.assign({}, state, {
                    count: newCount
                });
            },
            decrease (state, payload) {
                let newCount = state.count - 1;
                return {
                    count: newCount
                };
            }
        }
    };
    modules = new Modules({
        counter
    });
});

test('mergeProps(Array)', (t) => {
    t.plan(2);
    const vm = new Vue({
        modules,
        computed: mergeProps(['counter.count', 'counter.title'])
    });
    t.is(vm.count, counter.state.count);
    t.is(vm.title, counter.state.title);
});

test('mergeProps(Object)', (t) => {
    t.plan(2);
    const vm = new Vue({
        modules,
        computed: mergeProps({
            ct: 'counter.count',
            tl: 'counter.title'
        })
    });
    t.is(vm.ct, counter.state.count);
    t.is(vm.tl, counter.state.title);
});

test('mergeActions(Array)', (t) => {
    t.plan(5);
    const vm = new Vue({
        modules,
        computed: mergeProps(['counter.count']),
        methods: mergeActions(['counter.increase', 'counter.decrease'])
    });

    t.is(vm.count, 0);
    t.is(typeof vm.increase, 'function');
    t.is(typeof vm.decrease, 'function');

    vm.increase();

    t.is(vm.count, counter.state.count);

    vm.decrease();
    vm.decrease();

    t.is(vm.count, counter.state.count);
});

test('mergeActions(Object)', (t) => {
    t.plan(5);
    const vm = new Vue({
        modules,
        computed: mergeProps(['counter.count']),
        methods: mergeActions({
            inc: 'counter.increase',
            dec: 'counter.decrease'
        })
    });

    t.is(vm.count, 0);
    t.is(typeof vm.inc, 'function');
    t.is(typeof vm.dec, 'function');

    vm.inc();

    t.is(vm.count, counter.state.count);

    vm.dec();
    vm.dec();

    t.is(vm.count, counter.state.count);
});
