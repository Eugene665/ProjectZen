<template>
    <div v-if="project" class="project_info">
        title: {{ project.project_data.title }}
        <br>
        description: {{ project.project_data.description }}
        <br>
        <div class="likes">
        {{likes }}   
        <button @click="likeProject">like</button>
      </div>
        <br>
        <div v-if="project && project.project_data && project.project_data.blocks" class="blocks">
            <div v-for="(block, index) in project.project_data.blocks" :key="index">
                <div
          class="content-block"
          :style="block.type === 'text' ? { fontSize: block.fontSize, paddingRight: '10px' } : { paddingRight: '10px' }"
        >
          <template v-if="block.type === 'text'"> {{ block.content }}</template>
          <template v-else-if="block.type === 'photo'" >
            <img :src="block.content" alt="Фото" class="photo" />
          </template>
        </div>
            </div>
            
        </div>
        <div v-else>loading...</div>
    </div>
    <div v-else>loading...</div>
</template>

<script>
 import { ref, inject } from 'vue';
 import { useRoute } from 'vue-router';
 import { fetchProject, addLikeToProject, fetchLikesForProject } from "../lib/common_methods";
 export default {
    setup () {
        const isAuthenticated = inject('isAuthenticated');
      const user = inject('user');
            const route = useRoute();
            const projectId = route.params.id;
            const project = ref(null);
            const likes = ref(0);
        const fetch = async () => {
            try {
                const dataToParse = await fetchProject(projectId);
                console.log(dataToParse);
                const date = new Date(dataToParse.created_at);
            dataToParse.created_at = `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')} ${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, '0')}.${String(date.getUTCDate()).padStart(2, '0')}`; 
            dataToParse.project_data = JSON.parse(dataToParse.project_data); 
            project.value = dataToParse;
            await fetchLikes();
            console.log(project);
            } catch (error) {
                console.log(error);
            }
        }

        const fetchLikes = async () => {
        try {
          const data = await fetchLikesForProject(projectId);
            likes.value = data;
        } catch (error) {
          console.log(error);
        }
      }
      const likeProject = async () => {
        try {
          const data = await addLikeToProject(projectId, user.value.id);
          await fetchLikes(projectId);
        } catch (error) {
          console.log(error);
        }
      }

        fetch();
        return {
            project,
            likeProject,
            likes
        }
    }
 }
</script>

<style>
.photo {
    width: 300px;
    height: 300px;
}
</style>