// state inside of the client store.

export default {
  // the active user
  user: '',
  // list of groups or friends.
  list: '',
  // defines if should be looking at the group or friend lists.
  activeList: 'friends',
  // the current chat room that is being focused on.
  currentRoom: '',
  // result of searching actions
  result: '',
  // should change group/list/private message
  shouldChange: true,
  // messages in memory.
  messages: [],
  // counts for users, messages and groups
  count: '',
}
