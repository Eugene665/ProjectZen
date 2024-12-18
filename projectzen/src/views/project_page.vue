<template>
  <div class="project-editor">
    <!-- Верхняя панель инструментов -->
    <div class="toolbar">
      <select v-model="fontSize" class="toolbar-item" @change="updateFontSize">
        <option value="32px">Большой заголовок</option>
        <option value="24px">Заголовок</option>
        <option value="16px">Текст</option>
      </select>
      <button class="toolbar-item" @click="applyStyle('bold')">B</button>
      <button class="toolbar-item" @click="applyStyle('italic')">I</button>
      <button class="toolbar-item" @click="applyStyle('underline')">U</button>
      <button class="toolbar-item" @click="addOrderedList">1.</button>
      <button class="toolbar-item" @click="addUnorderedList">•</button>
      <button class="toolbar-item" @click="addLink">Ссылка</button>
      <button class="toolbar-item" @click="alignText('center')">Центр</button>
      <button class="toolbar-item" @click="alignText('justify')">По ширине</button>
    </div>

    <!-- Поле для ввода названия проекта -->
    <div class="input-section">
      <input
        v-model="project.title"
        class="project-title"
        placeholder="Введите название проекта"
      />
    </div>

    <!-- Поле для описания проекта -->
    <div class="input-section">
      <textarea
        v-model="project.description"
        class="project-description"
        placeholder="Введите описание проекта"
      ></textarea>
    </div>

    <!-- Блоки содержимого проекта -->
    <div class="content-blocks">
      <div
        v-for="(block, index) in project.blocks"
        :key="index"
        class="content-block"
        :style="{ fontSize: block.fontSize }"
        contenteditable="true"
        @input="updateBlockContent($event, index)"
        @mouseup="handleBlockSelection(index)"
        @keyup="handleBlockSelection(index)"
      ></div>
      <div class="add-block-buttons">
        <button @click="addBlock('text')" class="add-block-button">Добавить блок текста</button>
        <button @click="addBlock('photo')" class="add-block-button">Вставить фото</button>
      </div>
    </div>

    <!-- Кнопка сохранения -->
    <div class="save-button">
      <button @click="postProject">Выложить проект</button>
    </div>
  </div>
</template>

<script>
import { addProject, fetchProjects } from "../lib/common_methods.js";
import { inject } from "vue";
export default {
  setup() {
    const user = inject('user');
        return {
      user,
    };
    console.log(user);
  },
  data() {
    return {
      fontSize: "16px",
      selection: null,
      selectedBlockIndex: null,
      project: {
        title: "",
        description: "",
        blocks: [
          {type: "text", content: "", fontSize: "16px"},
        ],
      },
    };
  },
  methods: {
    applyStyle(style) {
      if (!this.selection || this.selectedBlockIndex === null) return;
      const range = this.selection.getRangeAt(0);
      const span = document.createElement("span");

      if (style === "bold") {
        span.style.fontWeight =
            this.selection.focusNode.parentElement.style.fontWeight === "bold"
                ? "normal"
                : "bold";
      }
      if (style === "italic") {
        span.style.fontStyle =
            this.selection.focusNode.parentElement.style.fontStyle === "italic"
                ? "normal"
                : "italic";
      }
      if (style === "underline") {
        span.style.textDecoration =
            this.selection.focusNode.parentElement.style.textDecoration === "underline"
                ? "none"
                : "underline";
      }
      range.surroundContents(span);
    },
    saveSelection(index) {
      this.selection = window.getSelection();
      this.selectedBlockIndex = index;
    },
    handleBlockSelection(index) {
      this.saveSelection(index);
      this.fontSize = this.project.blocks[index].fontSize;
    },
    updateBlockContent(event, index) {
      this.project.blocks[index].content = event.target.innerHTML;
    },
    addBlock(type) {
      const fontSize = type === "text" ? "16px" : "";
      this.project.blocks.push({type, content: "", fontSize});
    },
    updateFontSize(event) {
      if (this.selectedBlockIndex !== null) {
        this.project.blocks[this.selectedBlockIndex].fontSize = event.target.value;
      }
    },
    addOrderedList() {
      document.execCommand("insertOrderedList");
    },
    addUnorderedList() {
      document.execCommand("insertUnorderedList");
    },
    addLink() {
      const url = prompt("Введите URL:");
      if (url) {
        document.execCommand("createLink", false, url);
      }
    },
    alignText(alignment) {
      document.execCommand("justify" + alignment.charAt(0).toUpperCase() + alignment.slice(1));
    },
    saveProject() {
      console.log(this.project);
    },
    async postProject() {
      console.log(this.project);
      console.log(JSON.stringify(this.project));
        const error = await addProject(JSON.stringify(this.project), this.user.id);
        const data = await fetchProjects();
        console.log(JSON.parse(data[0].project_data));
        console.log(data);
        if (error)
          throw error;
      
  },
},
};
</script>

<style scoped>
.project-editor {
  background-color: #f5f5f5;
  color: #333;
  padding: 20px;
  max-width: 800px;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.toolbar-item {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.input-section {
  margin-bottom: 20px;
}

.project-title,
.project-description {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.content-blocks {
  margin-bottom: 20px;
}

.content-block {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  width: 100%;
}

.add-block-buttons {
  display: flex;
  gap: 10px;
}

.add-block-button {
  background-color: #333;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  text-align: center;
}

.save-button button {
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
