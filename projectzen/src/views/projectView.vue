<template>
    <div v-if="project"><h3>Проект компании <router-link :to="`/company/${project.company_id}`">{{project.company}}</router-link></h3></div>
  
  <router-link to="/">
        <button class="create-back-btn">Главная страница</button>
    </router-link>
  <div v-if="project" class="project_info">
    <div class="project_card">
      <h1 class="project_title">{{ project.project_data.title }}</h1>
      <p class="project_description">{{ project.project_data.description }}</p>

      <div class="likes" v-if="isAuthenticated && user.type === 'user'">
        <button @click="likeProject" class="like-button">
          Like {{ likes }}
        </button>
      </div>

      <div v-if="project && project.project_data && project.project_data.blocks" class="blocks">
        <div v-for="(block, index) in project.project_data.blocks" :key="index">
          <div
            class="content-block"
            :style="block.type === 'text' ? { fontSize: block.fontSize, paddingRight: '10px' } : { paddingRight: '10px' }"
          >
            <template v-if="block.type === 'text'">{{ block.content }}</template>
            <template v-else-if="block.type === 'photo'">
              <img :src="block.content" alt="Фото" class="photo" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>loading...</div>
</template>

<script>
import { ref, inject } from 'vue';
import { useRoute } from 'vue-router';
import { fetchProject, addLikeToProject, fetchLikesForProject } from "../lib/common_methods";

export default {
  setup() {
    const isAuthenticated = inject('isAuthenticated');
    const user = inject('user');
    const route = useRoute();
    const projectId = route.params.id;
    const project = ref(null);
    const likes = ref(0);

    const fetch = async () => {
      try {
        const dataToParse = await fetchProject(projectId);
        const date = new Date(dataToParse[0].created_at);
        dataToParse[0].created_at = `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')} ${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}.${String(date.getUTCDate()).padStart(2, '0')}`;
        console.log(dataToParse[0]);
        dataToParse[0].project_data = JSON.parse(dataToParse[0].project_data);
        project.value = dataToParse[0];
        console.log(project);
        await fetchLikes();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchLikes = async () => {
      try {
        const data = await fetchLikesForProject(projectId);
        likes.value = data;
      } catch (error) {
        console.log(error);
      }
    };

    const likeProject = async () => {
      try {
        await addLikeToProject(projectId, user.value.id);
        await fetchLikes();
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
    return {
      project,
      likeProject,
      likes,
      isAuthenticated,
      user
    };
  },
};
</script>

<style scoped>
.project_info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
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
  text-align: center;
}

.project_card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.project_title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.project_description {
  font-size: 1rem;
  line-height: 1.4;
  color: #555;
  margin-top: 20px; 
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
  margin-bottom: 20px;
}

.like-button:hover {
  background-color: #e0e0e0;
}

.like-count {
  margin-right: 10px;
  font-size: 1rem;
  color: #333;
}

.blocks {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.content-block {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 8px;
}

.photo {
  width: 100%;
  height: auto;
  max-width: 300px;
  border-radius: 8px;
}

h3, h2{
    font-size: 24px;
    font-weight: bold;
    color: #9e6202;
    text-transform: uppercase;
    text-align: center;

}
.create-back-btn{
  display: flex;
  gap: 10px; 
  position: absolute;
  top: 20px; 
  right: 20px;
  padding: 12px 20px; 
  border: none;
  cursor: pointer;
  border-radius: 25px; 
  border: 2px solid;
  background-color: #FF9F00;;
  color: white;
  border-color: #FF9F00;;
}
.create-back-btn:hover {
  background-color: #FF7F00;;
}
</style>
