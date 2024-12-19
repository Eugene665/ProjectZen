<template>
    <div class="header_container">
        <div class="logo">LOGOTIP: ITAKSOIDET.com</div>
        <div class="search_container">
            <div class="search_bar">
    <input v-model="searchQuery" class="search_input"  @blur="handleBlur" @focus="handleFocus" @input="search" placeholder="Найти проект"/>
</div>
  <ul class="search_results" v-if="showResults && searchQuery != ''">
    <li v-for="project in projectResults" :key="project.id" class="search_result_element">
      <router-link class="link search_project_link" :to="`/project/${project.id}`" active-class="active-link">
      {{project.data.title}} <br>
      <span class="artist">company: {{ project.company_name }}</span>
    </router-link>
    </li>
  </ul>
  <ul v-else-if="showResults" class="search_results" style="color: #000;">
    Проектов не найдено
  </ul>
</div>
    <router-link v-if="!isAuthenticated" to="/login" class="link">Вход/Регистрация</router-link>
    <div v-else>Hello user <button @click="logout">Выйти</button></div>
    <router-link to="/profile">
      <button>Профиль</button>
    </router-link>
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
      const searchQuery = ref('');
      const showResults = ref(false);
      const projectResults = ref([]);

      const search = async () => {
        console.log(showResults);
        console.log(searchQuery.value);
        if (searchQuery.value != '') {
            projectResults.value = [];
        try {
            const dataToParse = await searchProjects(searchQuery.value);
            console.log(dataToParse);
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

<style>
.header_container {
    display: flex;
    justify-content: space-around;

}

input::placeholder {
  text-align: center;
  color: rgb(194, 194, 194);
}

input:focus {
  text-align: center;
  border: 1px solid;
  border-radius: 12px;
  border-color: rgb(36, 36, 36);
  outline: none;
}

.search_container {
  position: relative;
}

.search_bar {
  display: flex;
  gap: 5px;
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

.search_input {
  background: none;
  border: 1px solid #161616;
  border-radius: 5px;
  color: #000;
  padding: 5px 10px;
  transition: 0.5s;
  text-align: center;
}

.search_project_link {
  color: #000;
}

.search_result_element {
  border-bottom: 1px solid #000;
  margin-bottom: 10px;
  transition: 0.3s;
  text-decoration: none;
}

.search_result_element:hover {
  margin-left: 5px;
}
.search_project_link {
    text-decoration: none;
}

router-link {
    text-decoration: none;
}
</style>