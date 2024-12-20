<template>
  <div class="register-container">
    <h2 class="register-title">Зарегистрироваться</h2>
    <form @submit.prevent="signUp">
      <div class="input-field">
        <input v-model="username" type="text" placeholder="Ваш логин" required class="input-field"/>
        <input v-model="email" type="email" placeholder="Email" required class="input-field"/>
        <input v-model="password" type="password" placeholder="Пароль" required class="input-field"/>
      </div>
      <div class="radio-container">
        <input type="radio" name="isUser" @click="radioChoice = true;" id="Company">
        <label for="Company" class="radio-input">Компания</label>
        <input type="radio" name="isUser" @click="radioChoice = false;" id="User" checked>
        <label for="User" class="radio-input">Пользователь</label>
      </div>
      <textarea v-if="radioChoice" v-model="about" placeholder="Расскажите о вашей компании" class="input-field"></textarea>
      <button type="submit" class="submit-btn">Зарегистрироваться</button>
      <router-link to="/login" class="login-link">Есть аккаунт? Авторизация</router-link>
    </form>
  </div>
</template>

<script>
  import { inject, ref } from 'vue';
  import { signup } from '../lib/common_methods';

  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        about: ''
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
      async signUp() {
        try {
          await signup(this.email, this.password, this.username, this.radioChoice, this.about);
          this.$router.push('/login');
        } catch (error) {
          alert(error.message);
        }
      }
    }
  };
</script>

<style scoped>

.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #FF9F00;
  padding: 20px; 
}

.register-title {
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

.login-link {
  margin-top: 10px;
  font-size: 14px;
  text-decoration: none;
  text-align: center;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
