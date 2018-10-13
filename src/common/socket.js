// Connect to the websocket server.
const socket = io.connect("/")

// create a listener for each group.
// Listens for events being passed to the user from a group.
function addGroupsListener(user,state) {
    _.forEach(user.groups,item => {
        socket.on(item,({from,data}) => {
            if(data.type) return
            if(item === state.currentRoom._id) {
                state.messages.push(data)
            } else {
                if(_.isString(state.count)) {
                    state.count = {[item]: 1}
                } else {
                    let count = state.count[item]
                    state.count = _.assign(state.count,{
                        [item]: count ? ++count : 1
                    })
                }
            }
        })
    })
}

// create a listener for each user.
// passes events from user's friends to the user.
function addUserListener(user,state) {
    let old = state.user
    socket.removeAllListeners(old._id)
    socket.on(user._id,({from,data}) => {

        if(from === state.currentRoom._id) {
            state.messages.push(data)
        } else {
            if(_.isString(state.count)) {
                state.count = {[from]: 1}
            } else {
                let count = state.count[from]
                state.count = _.assign(state.count,{
                    [from]: count ? ++count : 1
                })
            }
        }
    })
}

// remove the group and user listeners from a client.
function removeGroupAndUserListeners(user) {
    socket.removeAllListeners(user._id)
    _.forEach(user.groups,item => {
        socket.removeAllListeners(item)
    })
}

// add a single group listener for when a user adds a single room.
function addSingleGroupListener(groupId,state) {
    socket.on(groupId,({from,data}) => {
        if(data.type) return

        if(groupId === state.currentRoom._id) {
            state.messages.push(data)
        } else {
            if(_.isString(state.count)) {
                state.count = {[groupId]: 1}
            } else {
                let count = state.count[groupId]
                state.count = _.assign(state.count,{
                    [groupId]: count ? ++count : 1
                })
            }
        }
    })
}

// remove a single group listener for when user removes a single group.
function removeSingleGroupListener(groupId) {
    socket.removeAllListeners(groupId)
}

export {
    socket,
    addGroupsListener,
    addUserListener,
    removeGroupAndUserListeners,
    addSingleGroupListener,
    removeSingleGroupListener
}
