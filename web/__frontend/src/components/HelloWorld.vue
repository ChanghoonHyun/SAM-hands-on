<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      <div style="margin-bottom: 20px">
        <span>api gateway url</span><input v-model="url">
      </div>
      <div style="font-size:0">
        <div style="width:50%; display:inline-table;font-size:12px">
          <div><span>이름 </span><input type="text" v-model="iptName"></div>
          <div><span>주소 </span><input type="text" v-model="iptAddress"></div>
          <div><button @click="register">등록</button></div>
        </div>
        <div style="width:50%; display:inline-table;">
          <div><button @click="findUsers">사용자 목록 조회</button></div>
          <div style="font-size:12px">
            <ul>
              <li v-for="user in users" :key="user.id">
                <div>{{ user }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Serverless Hands On!',
      url: '',
      iptName: '',
      iptAddress: '',
      hasError: false,
      users: []
    }
  },
  methods: {
    async register () {
      const result = await axios.post(this.url + '/users', {
        name: this.iptName,
        address: this.iptAddress
      })
      console.log(result)
      if (result.status === 201) {
        alert('success')
      } else {
        alert('failure. status code : ' + result.status)
      }
    },
    async findUsers () {
      const result = await axios.get(this.url + '/users')
      console.log(result)
      if (result.status === 200) {
        const users = result.data.Items
        this.users = users
      } else {
        alert('failure. status code : ' + result.status)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
