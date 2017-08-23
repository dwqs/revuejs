export default {
    namespace: 'todo',
    state: {
        list: [],
        total: 0
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
            return {
                list: state.list,
                total: state.list.length
            };
        }
    }  
};
