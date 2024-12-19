<template>
<router-link v-if="!isAuthenticated" to="/login" class="link">Вход/Регистрация</router-link>
<div v-else>Hello user <button @click="logout">Выйти</button></div>
<router-link to="/profile">
      <button>Профиль</button>
    </router-link>
    <div class="main_container">
      <div v-for="(project) in projects" :key="project.id" :value="project.id">
        <router-link :to="`/project/${project.id}`">
        title: {{ project.project_data.title }}
        <br>
        added: {{ project.created_at }}
        <br>
        description: {{ project.project_data.description }}
      </router-link>
      </div>
    </div>
</template>

<script>
import { ref, inject } from "vue";
import { fetchProjects } from "../lib/common_methods";
export default {
    setup() {
      const login = inject('login');
      const isAuthenticated = inject('isAuthenticated');
      const logout = inject('logout');
      const projects = ref([]);
      const maxLength = 100;
      const fetch = async () => {
        try {
          let dataToParse = await fetchProjects();
          for (let i = 0; i < dataToParse.length; i++) {
            const date = new Date(dataToParse[i].created_at);
            dataToParse[i].created_at = `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')} ${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}.${String(date.getUTCDate()).padStart(2, '0')}`; 
            dataToParse[i].project_data = JSON.parse(dataToParse[i].project_data); 
            if (dataToParse[i].project_data.description.length > maxLength) {
              dataToParse[i].project_data.description = text.slice(0, maxLength) + '...';
            }
          }
          
          projects.value = dataToParse;
        } catch (error) {
          console.log(error);
        }
      }

      fetch();
      return {
        login,
        isAuthenticated,
        logout,
        projects
      };
    }
}


</script>

