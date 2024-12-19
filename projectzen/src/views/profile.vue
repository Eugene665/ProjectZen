<template>
    <div>
        <div>
  <img class="profile_image" :src="profileIconUrl" alt="Profile Icon"/>
</div>
  <input type="file" @change="handleFileChange" accept="image/*" />
    <button @click="uploadPI">Загрузить картинку</button>
  
      <p v-if="user">Привет, {{ user.username }}!</p>
      <p v-if="user">{{ user.email }}</p>
  
      <p v-else>Загрузка...</p>
  
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
      const profileIconUrl = computed(() => user.value.icon);
      const uploadPI = async () => {
        if (!selectedFile) {
        alert('Сначала выберите изображение');
        return;
      }
        try {
        const data = await uploadProfileIcon(selectedFile, user.value.id);
        user.value.icon = data; 
        console.log(user.value.icon);
        localStorage.setItem("userLogin", JSON.stringify(user.value))
      } catch (error) {
          console.error('Ошибка загрузки изображения:', error);  
        }
      }
  
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
  