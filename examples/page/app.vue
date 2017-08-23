<template>
    <div class="app">
        <h3>Examples for Revuejs: </h3>
        <ul class="examples-list">
            <li>
                <router-link to='counter'>Counter</router-link>
            </li>
            <li>
                <router-link to='todo'>ToDo</router-link>
            </li>
            <li>
                <router-link to='repos'>Repos</router-link>
            </li>
        </ul>
    </div>
</template>

<style lang="less"> 
    .examples-list {
        li {
            margin-top: 10px;
        }
    }
</style>
