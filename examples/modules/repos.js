import axios from 'axios';
import awaitTo from 'async-await-error-handling';

export default {
    namespace: 'repos',
    state: {
        all: 0,
        error: ''
    },
    actions: {
        async getYourRepos (state, payload) {
            let {username} = payload;
    
            const [err, data] = await awaitTo(axios.get(`https://api.github.com/users/${username}/repos`));

            return {
                all: data.data ? data.data.length : 0,
                error: !err ? '' : err
            };
        }
    }  
};
