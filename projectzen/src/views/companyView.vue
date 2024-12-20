<template>
  <h3>Профиль компании {{ company[0].company_name }} </h3>
  <div v-if="company" class="main_container">
    <div class="company-info">
      <img :src="company[0].profile_icon_path" alt="company logo" class="company-logo">
        <h1>{{ company[0].company_name }}</h1>
        <p>{{ company[0].about }}</p>
      <div class="like-company">
        <button @click="likeCompany" class="like-button">
          <div class="like-count">{{ companyLikes }}</div>
          Like
        </button>
      </div>
    </div>
    <h2>Проекты компании</h2>
    <div class="projects">
      <div v-for="(project) in paginatedData" :key="project.id" :value="project.id" class="project_card">
        <router-link :to="'/project/' + project.id" class="project_link">
          <h2 class="project_title">{{ project.project_data.title }}</h2>
          <p class="project_added">Added: {{ project.created_at }}</p>
          <p class="project_description">{{ project.project_data.description }}</p>
        </router-link>
        <div class="likes">
          <button @click="likeProject(project.id)" class="like-button">
            <div class="like-count">{{ projectLikes.find((curProject) => project.id === curProject.id).likes }}</div>
            Like
          </button>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination_button">Previous</button>
      <p class="page_info">Page {{ currentPage }} of {{ totalPages }}</p>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination_button">Next</button>
    </div>
    <div class="buttons-container">
      <router-link to="/"> <button class="create-back-btn">Главная страница</button></router-link>
      <button @click="logout" class="logout-btn">Выйти</button>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import { ref, inject } from "vue";
import { useRoute } from 'vue-router';
import { fetchCompanyInfo, fetchCompanyProjects, addLikeToProject, fetchLikesForProject, fetchLikesForCompany, addLikeToCompany } from "../lib/common_methods";

export default {
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 5
    };
  },
  setup() {
    const user = inject('user');
    const logout = inject("logout");
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
            dataToParse[i].project_data.description = dataToParse[i].project_data.description.slice(0, maxLength) + '...';
          }
          projectLikes.value.push({ id: dataToParse[i].id, likes: 0 });
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
      logout,
      company,
      projectLikes,
      likeProject,
      companyLikes,
      likeCompany,
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

<style scoped>
.main_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  gap: 20px;
}

.company-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: 3px solid #ddd;
  padding: 20px;
  border-radius: 15px;
  background-color: #FF9F00;

}

.company-details {
  text-align: center;
  margin-bottom: 20px;
}

.like-company {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;

}

.projects {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.project_card {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: 60%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.project_card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.project_link {
  text-decoration: none;
  color: #333;
}

.project_title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.project_added {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 15px;
}

.project_description {
  font-size: 1rem;
  line-height: 1.4;
  color: #555;
}

.like-button {
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  transition: background-color 0.3s ease;
}

.like-button:hover {
  background-color: #e0e0e0;
}

.like-count {
  margin-right: 10px;
  font-size: 1rem;
  color: #333;
}

.buttons {
  display: flex;
  align-items: center;
  gap: 20px;
}

.pagination_button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  transition: background 0.3s;
}

.pagination_button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination_button:hover:enabled {
  background: #0056b3;
}

.page_info {
  font-size: 1rem;
  font-weight: bold;
}

.buttons-container {
  display: flex;
  gap: 10px; 
  position: absolute;
  top: 20px; 
  right: 20px; 
}

.logout-btn, .create-back-btn {
  padding: 12px 20px; 
  border: none;
  cursor: pointer;
  border-radius: 25px; 
  border: 2px solid;
}

.create-back-btn {
  background-color: #FF9F00;;
  color: white;
  border-color: #FF9F00;;
}

.create-back-btn:hover {
  background-color: #FF7F00;;
}

.logout-btn {
  background-color: #f44336;
  color: white;
  border-color: #f44336; 
}

.logout-btn:hover {
  background-color: #e53935;
}

h3, h2{
    font-size: 24px;
    font-weight: bold;
    color: #FF9F00;
    text-transform: uppercase;
    text-align: center;

}

</style>