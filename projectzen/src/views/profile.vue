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

        <router-link v-if ="user.type === 'company'" to="/project_page">
        <button>Создать проект</button>
        </router-link>
        <div v-if="user.type === 'company'" class="description-block">
            <h3>Описание компании</h3>
            <textarea v-model="companyDescription" placeholder="Введите описание вашей компании"></textarea>
            <button>Добавить описание</button>
        </div>
  
        <button @click="logout">Выйти</button>
    </div>
</template>
  
  <script>
  import { ref, inject,computed} from "vue";
  import { uploadProfileIcon} from '../lib/common_methods'; 
  
  export default {
    setup() {
      const user = inject('user');
      const logout = inject('logout');
      const profileIconUrl = computed(() => user.value.icon);
      let selectedFile = 'default';
      const handleFileChange = (event) => {
      selectedFile = event.target.files[0]
      console.log(selectedFile);
    }
      const uploadPI = async () => {
        console.log(selectedFile, user.value.id,user.value.type)
        if (!selectedFile) {
        alert('Сначала выберите изображение');
        return;
      }
        try {
        const data = await uploadProfileIcon(selectedFile, user.value.id,user.value.type);
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
        selectedFile,
        uploadPI,
        handleFileChange,
        profileIconUrl
      };
    }
  }
  </script>
  
  <style scoped>
  .profile_image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid #7a7a7a;
  }
  </style>
  
  