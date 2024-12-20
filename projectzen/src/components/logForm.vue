<template>
    <div class="login-container">
      <h2 class="login-title">Вход</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="text" placeholder="Email" required class="input-field" />
        <input v-model="password" type="password" placeholder="Пароль" required class="input-field" />
        <div class="radio-container">
        <input type="radio" name="isUser" @click="radioChoice = true;" id="Company" class="radio-input">
        <label for="Company">Компания</label>
        <input type="radio" name="isUser" @click="radioChoice = false;" id="User" checked class="radio-input">
        <label for="User">Пользователь</label>
      </div>
        <button type="submit" class="submit-btn">Войти</button>
        <router-link to="/register" class="register-link">Нет аккаунта? Зарегистрироваться</router-link>
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
            this.login({ email: usr.email, id: usr.id, username: usr.company_name, about: usr.about, icon: usr.profile_icon_path, type: "company" });
          }
          
          this.$router.push('/');
        } catch (error) {
          alert(error.message);
        }
      }
    }
  };
  </script>
  
  <style scoped>

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #d8f88d;
  padding: 20px; 
}

.login-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px; 
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box; 
}

.input-field {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box; 
}

.input-field:focus {
  outline: none;
  border-color: #4CAF50;
}

.radio-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
}

.radio-input {
  margin-right: 5px;
}

.radio-container label {
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #1aadda;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0a9dcaa4;
}

.register-link {
  margin-top: 10px;
  font-size: 14px;
  text-decoration: none;
  text-align: center;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
