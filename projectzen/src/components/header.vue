<template>
  <div class="header_container">
    <div class="logo">LOGOTIP: ITAKSOIDET.com</div>
    <div class="search_container">
      <div class="search_bar">
        <input v-model="searchQuery" class="search_input" @blur="handleBlur" @focus="handleFocus" @input="search" placeholder="Найти проект"/>
      </div>
      <ul class="search_results" v-if="showResults && searchQuery != ''">
        <li v-for="project in projectResults" :key="project.id" class="search_result_element">
          <router-link class="link search_project_link" :to="`/project/${project.id}`" active-class="active-link">
            {{ project.data.title }} <br>
            <span class="artist">company: {{ project.company_name }}</span>
          </router-link>
        </li>
      </ul>
      <ul v-else-if="showResults" class="search_results" style="color: #000;">
        Проектов не найдено
      </ul>
    </div>
    <router-link v-if="!isAuthenticated" to="/login" class="link">Вход/Регистрация</router-link>
    <div v-else>
      <h2 class="company-name" v-if="user && user.username">Hello {{ user.username }}</h2>
      <router-link to="/profile"><button>Профиль</button></router-link>
      <button class="logout-btn" @click="logout">Выйти</button>
      </div>
  </div>
</template>

<script>
import { ref, inject } from "vue";
import { searchProjects } from "../lib/common_methods";

export default {
  setup () {
    const login = inject('login');
    const isAuthenticated = inject('isAuthenticated');
    const logout = inject('logout');
    const user = inject('user');
    const searchQuery = ref('');
    const showResults = ref(false);
    const projectResults = ref([]);

    const search = async () => {
      if (searchQuery.value != '') {
        projectResults.value = [];
        try {
          const dataToParse = await searchProjects(searchQuery.value);
          if (dataToParse) {
            for (let i = 0; i < dataToParse.length; i++) {
              dataToParse[i].data = JSON.parse(dataToParse[i].data);
            }
            projectResults.value = dataToParse;
          }
        } catch (error) {
          console.error('Error fetching projectResults:', error);  
        }
      }
    };

    const handleFocus = () => {
      showResults.value = true;
    }

    const handleBlur = () => {
      setTimeout(() => {
        showResults.value = false;
      }, 200);
    }

    return {
      login,
      isAuthenticated,
      logout,
      user, 
      search,
      handleBlur,
      handleFocus,
      showResults,
      searchQuery,
      projectResults
    }
  }
}
</script>

<style scoped>
.header_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #F4F4F9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #FF9F00;
  text-transform: uppercase;
}

.search_container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search_bar {
  display: flex;
  gap: 5px;
}

.search_input {
  background: none;
  border: 1px solid #161616;
  border-radius: 5px;
  color: #000;
  padding: 5px 15px;
  font-size: 16px;
  transition: 0.3s ease;
  width: 250px;
}

.search_input::placeholder {
  color: rgb(194, 194, 194);
  text-align: center;
}

.search_input:focus {
  outline: none;
  border-color: #FF9F00;
  box-shadow: 0 0 5px rgba(255, 159, 0, 0.7);
}

.search_results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 50vh;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  padding: 10px;
  z-index: 1000;
}

.search_result_element {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search_result_element:hover {
  background-color: #f7f7f7;
}

.search_project_link {
  color: #000;
  text-decoration: none;
}

.search_project_link:hover {
  color: #FF9F00;
}

button {
  padding: 10px 20px;
  font-size: 14px;
  border: none;
  border-radius: 30px;
  background-color: #FF9F00;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 10px;
}

button:hover {
  background-color: #FF7F00;
}

.link {
  color: #FF9F00;
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  margin-left: 20px;
}

.link:hover {
  text-decoration: underline;
}

.company-name {
  font-size: 20px;
  color: #333;
}

.search_results ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.search_results li {
  color: #000;
  font-size: 16px;
  text-align: center;
  padding: 10px;
}
.logout-btn {
  background-color: #f44336;
  color: white;
  border-color: #f44336;
}

.logout-btn:hover {
  background-color: #e53935;
}
</style>

