<template>
        <div class="repos">
            <h3>{{title}}:</h3>
            <div class="all">
                <p>
                    <input type="text" v-model='username' placeholder="type your github username">
                    <button @click="getRepos" :disabled='disabled'>Get</button>
                </p>
                <p>
                    The total repos you have: {{msg ? msg : all}}
                </p>
            </div>
        </div>
    </template>
    
    <script>
        import { mergeActions, mergeProps } from 'revuejs';
    
        export default {
            data() {
                return {
                    title: 'Repos Example',
                    username: '',
                    disabled: false
                }
            },
    
            computed: {
                ...mergeProps({
                    all: 'repos.all',
                    msg: 'repos.error'
                })
            },
    
            methods: {
                ...mergeActions(['repos.getYourRepos']),
    
                getRepos() {
                    if(!this.username) {
                        return;
                    }
                    if(!this.disabled) {
                        this.disabled = true;
                        this.getYourRepos({
                            username: this.username
                        }).then((res) => {
                            console.log('getRepos', res);
                            this.disabled = false;
                        }).catch((e) => {
                            this.disabled = false;
                        })
                    }
                }
            }
        }
        
    </script>

    <style>
        .all{
            margin-left: 20px;
        }
        input {
            width: 160px
        }
    </style>