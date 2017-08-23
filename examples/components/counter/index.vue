<template>
    <div class="counter">
        <h3>{{title}}:</h3>
        <div>
            <span class="decrease" @click="sub">-</span>
            <span>{{count}}</span>
            <span class="increase" @click="add">+</span>
        </div>
    </div>
</template>

<script>
    import {mergeActions, mergeProps} from 'revuejs';

    export default {
        data() {
            return {
                title: 'Counter Example'
            }
        },

        computed: {
            ...mergeProps(['counter.count'])
        },

        methods: {
            ...mergeActions(['counter.increase', 'counter.decrease']),
            add () {
                this.increase();
            },

            sub () {
                this.decrease();
            }
        }
    }
    
</script>

<style>
    .counter div {
        margin-left: 20px
    }

    .counter span {
        display: inline-block;
        cursor: pointer;
        width: 30px;
        vertical-align: middle
    }
</style>