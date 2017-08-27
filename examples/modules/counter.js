export default {
    namespace: 'counter',
    state: {
        count: 0,
        title: 'Counter'
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
