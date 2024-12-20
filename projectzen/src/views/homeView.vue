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
      <div class="likes">
        {{ projectLikes.find((curProject) => project.id === curProject.id).likes }}   
        <button @click="likeProject(project.id)">like</button>
      </div>
      </div>
      <div class="buttons">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <p>Page {{ currentPage }} of {{ totalPages }}</p>
       <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
</template>

<script>
import Header from "../components/header.vue";
import { ref, inject } from "vue";
import { fetchProjects, addLikeToProject, fetchLikesForProject } from "../lib/common_methods";
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
      const user = inject('user');
      const projects = ref([]);
      const maxLength = 100;
      const projectLikes = ref([]);
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
            projectLikes.value.push({id:dataToParse[i].id, likes: 0});
            await fetchLikes(dataToParse[i].id);
          }
          
          projects.value = dataToParse;
        } catch (error) {
          console.log(error);
        }
      }

      const fetchLikes = async (projectId) => {
        try {
          const data = await fetchLikesForProject(projectId);
          projectLikes.value.find((project) => project.id === projectId).likes = data;
        } catch (error) {
          console.log(error);
        }
      }
      const likeProject = async (projectId) => {
        try {
          const data = await addLikeToProject(projectId, user.value.id);
          await fetchLikes(projectId);
        } catch (error) {
          console.log(error);
        }
      }

      fetch();
      return {
        projects,
        likeProject,
        projectLikes
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

