<template>
    <div v-if="company">
        <img :src="company[0].profile_icon_path" alt="company logo">
    company_name: {{ company[0].company_name }}
    about: {{ company[0].about }}
        <div class="like_company">
            {{ companyLikes }}
            <button @click="likeCompany">like</button>
        </div>
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
    <div v-else>loading...</div>
</template>

<script>
import Header from "../components/header.vue";
import { ref, inject } from "vue";
import { fetchCompanyInfo, fetchCompanyProjects, addLikeToProject, fetchLikesForProject, fetchLikesForCompany, addLikeToCompany } from "../lib/common_methods";
import { useRoute } from 'vue-router';

export default {
    data () {
    return {
         currentPage: 1,
         itemsPerPage: 5
       };
  },
    setup () {
        const user = inject('user');
        const company = ref({});
        const projects = ref([]);
        const maxLength = 100;
        const route = useRoute();
        const companyId = route.params.id;
        const projectLikes = ref([]);
        const companyLikes = ref(0);
        const fetchCompany = async () => {
            try {
                const data = await fetchCompanyInfo(companyId);
                
            company.value = data;
            await getCompanyProjects();
            await fetchCompanyLikes();
            console.log(company);
            } catch (error) {
                console.log(error);
            }
            
        }

        const likeCompany = async () => {
            try {
                const data = await addLikeToCompany(companyId, user.value.id);
                await fetchCompanyLikes();
            } catch (error) {
                console.log(error);
            }
        }

        const fetchCompanyLikes = async () => {
            try {
            const data = await fetchLikesForCompany(companyId);
            companyLikes.value = data;
            } catch (error) {
                console.log(error);
            }
        }

        const getCompanyProjects = async () => {
            try {
                const dataToParse = await fetchCompanyProjects(companyId);
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

        fetchCompany();
        return {
            projects,
            company,
            projectLikes,
            likeProject,
            companyLikes,
            likeCompany
        }
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