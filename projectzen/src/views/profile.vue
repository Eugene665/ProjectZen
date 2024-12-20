<template>
    <div class="profile-container">
      <div class="avatar-container">
        <img class="profile_image" :src="profileIconUrl" alt="Profile Icon" />
        <h2 class="company-name">{{ user.username }}</h2> 
        <input type="file" @change="handleFileChange" accept="image/*" />
        <button @click="uploadPI" class="upload-btn">Загрузить картинку</button>
        <button v-if="user.type === 'user'" @click="toggleEditNameModal" class="edit-btn">Изменить имя</button>
        <button v-if="user.type === 'user'" @click="toggleEditPasswordModal" class="edit-btn">Изменить пароль</button>
      </div>

      <button @click="logout" class="logout-btn">Выйти</button>
  
      <div v-if="user.type === 'company'" class="description-block">
        <h3>Описание компании</h3>
        <p v-if="currentDescription" class="current-description">{{ currentDescription }}</p>
        <textarea v-model="companyDescription" placeholder="Введите описание вашей компании"></textarea>
        <button @click="saveDescription" class="save-btn">Добавить описание</button>
  
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
  
      <router-link v-if="user.type === 'company'" to="/project_page">
        <button class="create-project-btn">Создать проект</button>
      </router-link>
    </div>

    <div v-if="showEditNameModal" class="modal">
      <div class="modal-content">
        <h3>Введите новое имя</h3>
        <input v-model="newUsername" type="text" placeholder="Новое имя" />
        <button @click="saveNewUsername" class="save-btn">Сохранить</button>
        <button @click="toggleEditNameModal" class="cancel-btn">Отмена</button>
      </div>
    </div>

    <div v-if="showEditPasswordModal" class="modal">
      <div class="modal-content">
        <h3>Введите новый пароль</h3>
        <input v-model="newPassword" type="password" placeholder="Новый пароль" />
        <button @click="saveNewPassword" class="save-btn">Сохранить</button>
        <button @click="toggleEditPasswordModal" class="cancel-btn">Отмена</button>
      </div>
    </div>

  </template>
  
  <script>
  import { supabase } from "../lib/supabase";
  import { updateCompanyDescription, uploadProfileIcon, changeUsersPassword, changeUsersName } from "../lib/common_methods";
  import { ref, inject, computed, onMounted } from "vue";
  
  export default {
    setup() {
      const user = inject("user");
      const logout = inject("logout");
      const profileIconUrl = computed(() => user.value.icon);
      const companyDescription = ref("");
      const currentDescription = ref("");
      const successMessage = ref("");
      const errorMessage = ref("");
      const showEditNameModal = ref(false);
      const showEditPasswordModal = ref(false);
      const newUsername = ref("");
      const newPassword = ref("");
      let selectedFile = "default";
      
  
      const handleFileChange = (event) => {
        selectedFile = event.target.files[0];
      };
  
      const uploadPI = async () => {
        if (!selectedFile) {
          alert("Сначала выберите изображение");
          return;
        }
        try {
          const data = await uploadProfileIcon(
            selectedFile,
            user.value.id,
            user.value.type
          );
          user.value.icon = data;
          localStorage.setItem("userLogin", JSON.stringify(user.value));
        } catch (error) {
          console.error("Ошибка загрузки изображения:", error);
        }
      };
  
      const saveDescription = async () => {
        if (!companyDescription.value.trim()) {
          errorMessage.value = "Описание не может быть пустым!";
          return;
        }
        try {
          await updateCompanyDescription(user.value.id, companyDescription.value);
  
          successMessage.value = "Описание успешно сохранено!";
          errorMessage.value = "";
          currentDescription.value = companyDescription.value;
  
          alert("Описание компании успешно сохранено!");
        } catch (error) {
          console.error("Ошибка сохранения описания:", error.message);
          errorMessage.value = "Не удалось сохранить описание. Попробуйте снова.";
          successMessage.value = "";
        }
      };
  
      const fetchDescription = async () => {
        try {
          const { data } = await supabase
            .from("companies")
            .select("about")
            .eq("id", user.value.id)
            .single();
  
          if (data) {
            currentDescription.value = data.about;
          }
        } catch (error) {
          console.error("Ошибка загрузки описания:", error.message);
        }
      };

      const toggleEditNameModal = () => {
      showEditNameModal.value = !showEditNameModal.value;
    };

    const toggleEditPasswordModal = () => {
      showEditPasswordModal.value = !showEditPasswordModal.value;
    };

    const saveNewUsername = async () => {
      if (!newUsername.value.trim()) {
        alert("Имя не может быть пустым!");
        return;
      }
      try {
        await changeUsersName(user.value.id, newUsername.value);
        user.value.username = newUsername.value;
        localStorage.setItem("userLogin", JSON.stringify(user.value));

        alert("Имя успешно обновлено!");
        toggleEditNameModal();
      } catch (error) {
        console.error("Ошибка обновления имени:", error);
        alert("Не удалось обновить имя.");
      }
    };

    const saveNewPassword = async () => {
      if (!newPassword.value.trim()) {
        alert("Пароль не может быть пустым!");
        return;
      }
      try {
        console.log(newPassword);
        await changeUsersPassword(user.value.id, newPassword.value);

        alert("Пароль успешно обновлен!");
        toggleEditPasswordModal();
      } catch (error) {
        console.error("Ошибка обновления пароля:", error);
        alert("Не удалось обновить пароль.");
      }
    };

    onMounted(() => {
      if (user.value.type === "company") {
        fetchDescription();
      }
    });
  
      return {
        user,
        logout,
        profileIconUrl,
        companyDescription,
        saveDescription,
        uploadPI,
        handleFileChange,
        successMessage,
        errorMessage,
        currentDescription,
        newUsername,
        newPassword,
        saveNewUsername,
        saveNewPassword,
        showEditNameModal,
        showEditPasswordModal,
        toggleEditNameModal,
        toggleEditPasswordModal,
      };
    },
  };
  </script>
  
  <style scoped>
  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    gap: 20px;
  }
  
  .avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .profile_image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid #7a7a7a;
  }
  
  .company-name {
    margin-top: 10px;
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }
  
  .upload-btn {
    background-color: #4CAF50;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
  }
  
  .upload-btn:hover {
    background-color: #45a049;
  }
  
  .logout-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #f44336;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
  }
  
  .logout-btn:hover {
    background-color: #e53935;
  }
  
  .description-block {
    text-align: center;
    width: 80%;
    max-width: 600px;
  }
  
  textarea {
    width: 100%;
    height: 150px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    margin-bottom: 20px;
  }
  
  .save-btn {
    background-color: #4CAF50;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
  }
  
  .save-btn:hover {
    background-color: #45a049;
  }
  
  .create-project-btn {
    background-color: #2196F3;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
  }
  
  .create-project-btn:hover {
    background-color: #1976D2;
  }
  
  .success {
    color: green;
    font-size: 16px;
  }
  
  .error {
    color: red;
    font-size: 16px;
  }
  
  .current-description {
    margin-top: 20px;
    font-size: 16px;
    color: #555;
  }
  
  textarea:focus {
    outline: none;
    border-color: #4CAF50;
  }
  
  button:focus {
    outline: none;
  }
  .modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.modal input {
  margin-bottom: 10px;
  padding: 8px;
  width: 80%;
  border-radius: 4px;
}
  </style>
  