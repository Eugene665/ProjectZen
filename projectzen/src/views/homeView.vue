<template>
  <Header></Header>
    <div class="main_container">
      <div v-for="(project) in paginatedData" :key="project.id" :value="project.id">
        <router-link :to="`/project/${project.id}`">
        title: {{ project.project_data.title }}
        <br>
        added: {{ project.created_at }}
        <br>
        description: {{ project.project_data.description }}
      </router-link>
      </div>
      <div class="buttons">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
       <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
      <p>Page {{ currentPage }} of {{ totalPages }}</p>
    </div>
</template>

<script>
import Header from "../components/header.vue";
import { ref, inject } from "vue";
import { fetchProjects } from "../lib/common_methods";
export default {
  components: {
    Header
  },
  data () {
    return {
         currentPage: 1,
         itemsPerPage: 5
       };
  },
    setup() {
      
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
        projects
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.projects.length / this.itemsPerPage);
      },
      paginatedData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
         const end = start + this.itemsPerPage;
         return this.projects.slice(start, end);
      }
    },
    methods: {
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      prevPage() {
         if (this.currentPage > 1) {
           this.currentPage--;
         }
       }
    }

}


</script>

