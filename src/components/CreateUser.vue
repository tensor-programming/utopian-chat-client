<template v-else>
  <div class="upInOut">
    <el-tabs type="border-card">
      <el-tab-pane label="sign in form" name="signin">
        <el-form ref="form" :model="params" label-width="80px">
          <el-form-item label="name">
            <el-input type="name" v-model="params.name"></el-input>
          </el-form-item>
          <el-form-item label-width="40px">
            <el-button class="fullBtn" type="primary" @click="signIn()">Sign In</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog class="text-center" v-model="errorTip" size="tiny">
      <span>{{error.msg}}</span>
      <span slot="footer" class="clearfix">
        <el-button type="primary" @click="errorTip = false">Errors</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

// allows a user to sign in or be created.

export default {
  data() {
    return {
      params: {
        name: ''
      },
      errorTip: false,
      error: ''
    }
  },
  methods: {
    // take the instance of the data state and pass it to the 'createUser' action.
    signIn() {
      let data = this.params

      this.$store
        .dispatch('createUser', { data })
        .catch(err => {
          this.errorTip = true
          this.error = err
        })
    },
  }
}
</script>

<style>
.upInOut {
  height: 100%;
  width: 380px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.upInOut .el-form {
  padding: 30px 30px 30px 0;
  border-radius: 5px;
}

.upInOut .el-button:last-child {
  float: right;
}

.fullBtn {
  width: 100%;
}
</style>
