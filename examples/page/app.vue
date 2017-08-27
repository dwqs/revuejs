<template>
    <div class="app">
        <h3>Examples for Revuejs: </h3>
        <ul class="examples-list">
            <li>
                <router-link to='counter'>{{countTitle}}</router-link>
            </li>
            <li>
                <router-link to='todo'>{{todoTitle}}</router-link>
            </li>
            <li>
                <router-link to='repos'>{{reposTitle}}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mergeActions, mergeProps} from 'revuejs';

    export default {
        computed: {
            ...mergeProps({
                'countTitle': 'counter.title',
                'todoTitle': 'todo.title',
                'reposTitle': 'repos.title'
            })
        },
    }
</script>

<style lang="less"> 
    .examples-list {
        li {
            margin-top: 10px;
        }
    }
</style>
