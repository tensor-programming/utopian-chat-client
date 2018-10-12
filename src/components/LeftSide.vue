<template>
  <div class="left-side">
    <ul class="list">
      <li class="item">
        <img :src="user.avatar" class="avatar link">
        <span class="name text-white">
          {{upperFirst(user.name.replace('@', ''))}}
          <i @click="signOut" class="el-icon-circle-cross text-red" title="Sign Out"></i>
        </span>
      </li>
      <li class="item">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="text-center link" @click="changeActiveList('friends')">
              <i :class="activeList=='friends'?'text-green icon-user':'text-white icon-friend'" class="iconfont"></i>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="text-center link" @click="changeActiveList('groups')">
              <i :class="activeList=='groups'?'text-green icon-main-group':'text-white icon-group'" class="iconfont"></i>
            </div>
          </el-col>
        </el-row>
      </li>
      <li class="item text-center">
        <el-button class="addBtn" type="success" size="small" @click="addDialog">
          Find {{activeList=='friends'?'Friends':'Group'}}
        </el-button>
      </li>
      <li class="item link hover-black" :class="{active: currentRoom._id == item._id}" v-for="item in list" @click="changeActiveRoom(item)">
        <img v-if="!count[item._id]" :src="item.avatar" class="avatar">
        <el-badge :value="count[item._id]" :max="99" v-else>
          <img :src="item.avatar" class="avatar">
        </el-badge>
        <span :title="item.name" class="name text-white">{{upperFirst(item.name.replace('@', ''))}}</span>
      </li>
    </ul>

    <el-dialog size="tiny" class="text-center" v-model="groupDialog" title="Search For Groups">
      <el-input placeholder="Group name" icon="search" v-model="keyword" @change="searchGroups"></el-input>
      <div class="padding-10">
        <p class="padding-5">Could not find what you wanted</p>
        <el-button :disabled="!keyword" class="addBtn" type="success" size="small" @click="createGroup">
          Create group
        </el-button>
      </div>
      <ul class="search-result" v-if="isArray(result) && result.length > 0">
        <li class="padding-top-bottom-8 text-left clearfix" v-for="item in result">
          <img :src="item.avatar" class="avatar">
          <span :title="item.name" class="name">{{upperFirst(item.name.replace('@', ''))}}</span>

          <el-button v-if="isExist.indexOf(item._id) < 0" type="info" class="pull-right text-init link" @click="joinGroup(item)">Join</el-button>
          <el-button :disabled="true" class="pull-right text-init link" v-else>Join</el-button>
        </li>
      </ul>
      <p v-if="isArray(result) && result.length < 1" class="padding-10">No related Groups</p>
    </el-dialog>

    <el-dialog size="tiny" class="text-center" v-model="friendDialog" title="Search for Users">
      <el-input placeholder="user name" icon="search" v-model="keyword" @change="searchUsers"></el-input>
      <ul class="search-result" v-if="isArray(result) && result.length > 0">
        <li class="padding-top-bottom-8 text-left clearfix" v-for="item in result">
          <img :src="item.avatar" class="avatar">
          <span :title="item.name" class="name">{{upperFirst(item.name.replace('@', ''))}}</span>
          <el-button v-if="isExist.indexOf(item._id) < 0" type="info" class="pull-right text-init link" @click="addFriend(item)">Add to List</el-button>
          <el-button :disabled="true" class="pull-right text-init link" v-else>Add to List</el-button>
        </li>
      </ul>
      <p v-if="isArray(result) && result.length < 1" class="padding-10">No related users</p>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import Vue from 'vue'

  export default {
    created() {
      this.$store.dispatch('getList')
      this.userParams = _.pick(this.$store.state.user, ['avatar', 'name', 'password'])
    },
    data() {
      return {
        groupDialog: false,
        friendDialog: false,
        modifyDialog: false,
        keyword: '',
        userParams: ""
      }
    },
    computed: {
      ...mapState(['list', 'user', 'result', 'activeList', 'currentRoom', 'count'])
    },
    methods: {
      isArray: _.isArray,
      upperFirst: _.upperFirst,
      addDialog(){
        if ('friends' === this.activeList) {
          this.friendDialog = true
        } else {
          this.groupDialog = true
        }
      },
      changeActiveRoom(item) {
        let cur = this.currentRoom
        if (cur && cur._id === item._id) return
        this.$store.dispatch('changeCurrentRoom', item)
      },
      changeActiveList(type) {
        if (type === this.activeList) return

        this.$store.dispatch('setActiveList', type)
        this.$store.dispatch('getList')
      },
      createGroup() {
        if (!this.keyword) return
        this.$store.dispatch('createGroup', this.keyword.toLowerCase()).then(() => this.groupDialog = false)
      },
      searchGroups() {
        if (!this.keyword) return
        this.$store.dispatch('searchGroups', this.keyword.toLowerCase())
      },
      searchUsers() {
        if (!this.keyword) return
        this.$store.dispatch('searchUsers', this.keyword.toLowerCase())
      },
      joinGroup(item) {
        this.$store.dispatch('joinGroup', item._id).then(() => this.groupDialog = false)
      },
      addFriend(item) {
        this.$store.dispatch('addFriend', item._id).then(() => this.friendDialog = false)
      },

      ...mapActions(['signOut']),
    },
    watch: {
      keyword(val) {
        if (!val) {
          this.$store.dispatch('removeResult')
        }
        return
      },
      groupDialog(val){
        if(val === false) this.keyword = ''
        return
      },
      friendDialog(val){
        if(val === false) this.keyword = ''
        return
      },
      list(val) {
          this.isExist = _.map(val, '_id')
      }
    }
  }
</script>

<style>
.left-side {
  width: 280px;
  flex: none;
}
.item {
  padding: 12px;
}
.item .el-col:first-child {
  border-right: 1px solid #292c33;
}

.search-result .el-icon-plus {
  line-height: 40px;
  font-size: 20px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 2px;
}
.name {
  margin-left: 12px;
  vertical-align: top;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
  display: inline-block;
}
.addBtn {
  padding-left: 60px;
  padding-right: 60px;
}
</style>
