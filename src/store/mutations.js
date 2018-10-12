export default {
    setUser(state,{user}) {
        state.user = user
    },
    removeUser(state) {
        _.assign(state,{
            user: '',
            list: '',
            activeList: 'friends',
            currentRoom: '',
            isChange: true,
            messages: [],
            count: '',
        })
    },
    setActiveList(state,{type}) {
        state.isChange = true
        state.activeList = type
    },
    setList(state,list) {
        state.list = list
    },
    setResult(state,{result}) {
        state.result = result
    },
    removeResult(state) {
        state.result = ''
    },
    changeCurrentRoom(state,{item}) {
        state.isChange = true
        if(state.count[item._id]) {
            state.count = _.assign(state.count,{
                [item._id]: 0
            })
        }
        state.currentRoom = item
    },
    removeCurrentRoom(state) {
        state.currentRoom = ''
        state.messages = []
    },
    notChange(state) {
        state.isChange = false
    },
    pullMsg(state,messages) {
        if(state.isChange) {
            state.messages = messages
        } else {
            state.messages = messages.concat(state.messages)
        }
    },
    pushMsg(state,msg) {
        state.messages.push(msg)
    },
}
