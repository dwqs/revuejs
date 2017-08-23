import axios from 'axios';

export default {
    namespace: 'repos',
    state: {
        all: 0,
        error: ''
    },
    actions: {
        async getYourRepos (state, payload) {
            let {username} = payload;
            let data = {};
            let error = '';

            try {
                data = await axios.get(`https://api.github.com/users/${username}/repos`);
            } catch (e) {
                error = e.message;
            }

            return {
                all: data.data ? data.data.length : 0,
                error
            };
        }
    }  
};
