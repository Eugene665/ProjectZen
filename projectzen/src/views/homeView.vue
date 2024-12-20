<template>
    
  
  <Header></Header>
  <div class="main_container">
    <div v-for="(project) in paginatedData" :key="project.id" :value="project.id" class="project_card">
      <router-link :to="`/project/${project.id}`" class="project_link">
        <h2 class="project_title">{{ project.project_data.title }}</h2>
        <p class="project_added">
          <i class="fas fa-clock"></i>
          {{ project.created_at }}
        </p>
        <p class="project_description">{{ project.project_data.description }}</p>
      </router-link>
      <div class="likes" v-if="isAuthenticated && user.type === 'user'">
        <span>{{ projectLikes.find((curProject) => project.id === curProject.id).likes }}</span>
        <button 
          @click="likeProject(project.id)" 
          :class="{'liked': projectLikes.find((curProject) => project.id === curProject.id).likes > 0}" 
          class="like_button">
          <i class="Like"></i>
        </button>
      </div>
    </div>
    <div class="buttons">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination_button">
        <i class="fas fa-arrow-left"></i>
      </button>
      <p class="page_info">Page {{ currentPage }} of {{ totalPages }}</p>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination_button">
        <i class="fas fa-arrow-right"></i>
      </button>
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
  data() {
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
    const isAuthenticated = inject("isAuthenticated");
    console.log(user);
    const fetch = async () => {
      try {
        let dataToParse = await fetchProjects();
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

    fetch();
    return {
      projects,
      likeProject,
      projectLikes,
      isAuthenticated,
      user
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

<style scoped>


.main_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 20px;
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

.like-button font-awesome-icon {
  font-size: 1.2rem;
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
</style>
