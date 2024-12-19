<template>
    <div>
      <h2>Вход</h2>
      <form @submit.prevent="login">
        <input type="radio" name="isUser" @click="radioChoice = true;" id="Company"> <label for="Company">Компания</label>
        <input type="radio" name="isUser" @click="radioChoice = false;" id="User" checked><label for="User">Пользователь</label>
        <input v-model="email" type="text" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Пароль" required />
        <button type="submit">Войти</button>
        <router-link to="/register">Нет аккаунта? Зарегистрироваться</router-link>
      </form>
    </div>
  </template>
  
  <script>
  import { inject, ref } from 'vue';
  import { authenticateUser, authenticateCompany } from '../lib/common_methods';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        username: '',
      };
    },
    setup() {
      const login = inject('login');
      const radioChoice = ref(false);
      return {
        login,
        radioChoice
      };
    },
    methods: {
      async login() {
        try {
          let usr;
          console.log(this.radioChoice);
          if (!this.radioChoice) {
            usr = await authenticateUser(this.email, this.password);
          this.login({ email: usr.email, id: usr.id, username: usr.username, icon: usr.profile_icon_path, type: "user" });
          }
          else {
            usr = await authenticateCompany(this.email, this.password);
            this.login({ email: usr.email, id: usr.id, company_name: usr.company_name, about: usr.about, icon: usr.profile_icon_path, type: "company" });
          }
          
          this.$router.push('/');
        } catch (error) {
          alert(error.message);
        }
      }
    }
  };
  </script>
  