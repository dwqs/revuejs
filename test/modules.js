import test from 'ava';
import Vue from 'vue';
import awaitTo from 'async-await-error-handling';
import Revuejs, { Modules, mergeActions, mergeProps } from '../dist/index';

let counter;
let todo;
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
                let newCount = state.count + payload;
                return Object.assign({}, state, {
                    count: newCount
                });
            },
            decrease (state, payload) {
                let newCount = state.count - payload;
                return {
                    count: newCount
                };
            },
            resolvedPromise (state, payload) {
                return new Promise(resolve => {
                    let newCount = state.count + payload;
                    resolve({
                        count: newCount
                    });
                });
            },
            rejectedPromise (state, payload) {
                return new Promise((resolve, reject) => {
                    reject(new Error('rejected error'));
                });
            }
        }
    };
    todo = {
        namespace: 'todo',
        state: {
            total: 0,
            list: [],
            title: 'test todo'
        },
        actions: {
            addTodo (state, payload) {
                state.list.push(payload.item);
                return {
                    list: state.list,
                    total: state.list.length
                };
            },
            deleteTodo (state, payload) {
                state.list.splice(payload.index, 1);
                return Object.assign({}, state, {
                    list: state.list,
                    total: state.list.length
                });
            },

            async testAsync (state, payload) {
                let text = await Promise.resolve('testAsync');
                return {
                    item: text
                };
            },

            async asyncAddTodo (state, payload) {
                let { item } = await this.actions.testAsync(state, payload);
                state.list.push(item);
                return {
                    list: state.list,
                    total: state.list.length
                };
            }
        }
    };
    modules = new Modules({
        counter,
        todo
    });
});

test('same prop in module', (t) => {
    t.plan(2);

    const vm = new Vue({
        modules,
        computed: mergeProps({
            'countTitle': 'counter.title',
            'todoTitle': 'todo.title'
        })
    });

    t.is(vm.countTitle, 'test count');
    t.is(vm.todoTitle, 'test todo');
});

test('sync actions', (t) => {
    t.plan(5);
    
    const vm = new Vue({
        modules,
        computed: mergeProps(['counter.count']),
        methods: mergeActions(['counter.increase', 'counter.decrease'])
    });

    t.is(vm.count, 0);

    vm.increase(5);
    
    t.is(vm.count, 5);
    t.is(vm.count, counter.state.count);

    vm.decrease(2);
    vm.decrease(6);

    t.is(vm.count, -3);
    t.is(vm.count, counter.state.count);
});

test('action with object style', (t) => {
    t.plan(11);
    
    const vm = new Vue({
        modules,
        computed: mergeProps(['todo.total', 'todo.list']),
        methods: mergeActions(['todo.addTodo', 'todo.deleteTodo'])
    });

    t.is(vm.total, 0);

    vm.addTodo({
        item: 'item1'
    });
    vm.addTodo({
        item: 'item2'
    });
    
    t.is(vm.total, 2);
    t.is(vm.total, todo.state.total);
    t.deepEqual(vm.list, ['item1', 'item2']);
    t.deepEqual(vm.list, todo.state.list);
    t.deepEqual(vm.list[1], 'item2');

    vm.deleteTodo({
        index: 0
    });

    t.is(vm.total, 1);
    t.is(vm.total, todo.state.total);
    t.deepEqual(vm.list, ['item2']);
    t.deepEqual(vm.list, todo.state.list);
    t.deepEqual(vm.list[0], 'item2');
});

test.serial('action return resolved promise', async t => {
    t.plan(5);
    
    const vm = new Vue({
        modules,
        computed: mergeProps(['counter.count']),
        methods: mergeActions(['counter.resolvedPromise'])
    });

    t.is(vm.count, 0);

    let res = vm.resolvedPromise(100);
    const [err, data] = await awaitTo(res);
    
    t.is(vm.count, 100);
    t.falsy(err, false);
    t.deepEqual({count: 100}, data);
    t.is(typeof res.then, 'function');
});

test.serial('action return rejected promise', async t => {
    t.plan(7);
    
    const vm = new Vue({
        modules,
        computed: mergeProps(['counter.count']),
        methods: mergeActions(['counter.rejectedPromise', 'counter.increase'])
    });

    t.is(vm.count, 0);
    
    vm.increase(50);

    t.is(vm.count, 50);
    
    let res = await t.throws(vm.rejectedPromise(20));
    const [err, data] = await awaitTo(vm.rejectedPromise(20));
    
    t.is(res.message, 'rejected error');
    t.is(err.message, 'rejected error');
    t.is(vm.count, 50);
    t.is(data, null);
});

test.serial('composing actions with async/await', async t => {
    t.plan(5);

    const vm = new Vue({
        modules,
        computed: mergeProps(['todo.total', 'todo.list']),
        methods: mergeActions(['todo.asyncAddTodo'])
    });

    t.is(vm.total, 0);
    t.deepEqual(vm.list, []);

    await vm.asyncAddTodo();

    t.is(vm.total, 1);
    t.deepEqual(vm.list, todo.state.list);
    t.deepEqual(vm.list, ['testAsync']);
});
