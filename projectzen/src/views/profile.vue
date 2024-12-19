<template>
    <div>
      <div v-if="user.avatar" class="avatar-container">
        <img :src="user.avatar" alt="Avatar" class="avatar" />
      </div>
  
      <p v-if="user">Привет, {{ user.username }}!</p>
      <p v-if="user">{{ user.email }}</p>
  
      <p v-else>Загрузка...</p>
  
      <button @click="selectFile">Загрузить аватар</button>
      
      <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none;" />
  
      <router-link to="/project_page">
        <button>Создать проект</button>
      </router-link>
  
      <button @click="logout">Выйти</button>
    </div>
  </template>
  
  <script>
  import { ref, inject } from "vue";
  
  export default {
    setup() {
      const user = inject('user');
      const logout = inject('logout');
      const fileInput = ref(null);
  
      const selectFile = () => {
        fileInput.value.click();
      };
  
      const handleFileUpload = async (event) => {
        const file = event.target.files[0];
  
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {

            user.avatar = reader.result;
            
          };
          reader.readAsDataURL(file);
        }
      };
  
      return {
        user,
        logout,
        selectFile,
        fileInput,
      };
    }
  }
  </script>
  
  <style scoped>
  .avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ddd;
  }
  </style>
  