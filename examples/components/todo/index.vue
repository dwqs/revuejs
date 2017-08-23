<template>
    <div class="todo">
        <h3>{{title}}:</h3>
        <div class="list">
            <p>
                <input type="text" v-model='todo'>
                <button @click="add">Add</button>
            </p>
            <ul v-if="all">
                <li v-for="(item, index) in todolist" :key="index" @click="del(index)">
                    {{item}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import './index.less';
    import { mergeActions, mergeProps } from 'revuejs';

    export default {
        data() {
            return {
                title: 'ToDo Example',
                todo: ''
            }
        },

        computed: {
            ...mergeProps({
                all: 'todo.total',
                todolist: 'todo.list'
            })
        },

        methods: {
            ...mergeActions(['todo.addTodo', 'todo.deleteTodo']),

            add() {
                if(!this.todo){
                    return;
                }
                this.addTodo({
                    item: this.todo
                });
            },

            del(index) {
                this.deleteTodo({
                    index
                });
            }
        }
    }
    
</script>