// Mutations which mutate the store state based on the actions being called.
export default {
  setUser(state,{user}) {
    state.user = user
  },
  // reset state when user is signed out.
  removeUser(state) {
    _.assign(state,{
      user: '',
      list: '',
      activeList: 'friends',
      currentRoom: '',
      shouldChange: true,
      messages: [],
      count: '',
    })
  },
  setActiveList(state,{type}) {
    state.shouldChange = true
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
    state.shouldChange = true
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
    state.shouldChange = false
  },
  pullMsg(state,messages) {
    if(state.shouldChange) {
      state.messages = messages
    } else {
      state.messages = messages.concat(state.messages)
    }
  },
  pushMsg(state,msg) {
    state.messages.push(msg)
  },
}
