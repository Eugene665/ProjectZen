<template>
  <div class="project-editor">
    <!-- Верхняя панель инструментов -->
    <div class="toolbar">
      <select v-model="fontSize" class="toolbar-item">
        <option value="32px">Большой заголовок</option>
        <option value="24px">Заголовок</option>
        <option value="16px">Текст</option>
      </select>
      <button class="toolbar-item" @click="applyStyle('bold')">B</button>
      <button class="toolbar-item" @click="applyStyle('italic')">I</button>
      <button class="toolbar-item" @click="applyStyle('underline')">U</button>
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
        @mouseup="saveSelection(index)"
        @keyup="saveSelection(index)"
      ></div>
      <button @click="addBlock('text')" class="add-block-button">Добавить блок</button>
    </div>

    <!-- Кнопка сохранения -->
    <div class="save-button">
      <button @click="saveProject">Сохранить проект</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fontSize: "16px",
      selection: null,
      selectedBlockIndex: null,
      project: {
        title: "",
        description: "",
        blocks: [
          { type: "text", content: "", fontSize: "16px" },
        ],
      },
    };
  },
  methods: {
    applyStyle(style) {
      if (!this.selection || this.selectedBlockIndex === null) return;
      const block = this.project.blocks[this.selectedBlockIndex];

      const selectedText = this.selection.toString();
      if (!selectedText) return;

      const styledText = `<span style=\"${style}: ${style === 'bold' ? 'bold' : style};\">${selectedText}</span>`;
      block.content = block.content.replace(selectedText, styledText);
      this.updateContent(block.content, this.selectedBlockIndex);
    },
    saveSelection(index) {
      this.selection = window.getSelection().getRangeAt(0);
      this.selectedBlockIndex = index;
    },
    updateContent(content, index) {
      this.project.blocks[index].content = content;
    },
    updateBlockContent(event, index) {
      this.project.blocks[index].content = event.target.innerHTML;
    },
    addBlock(type) {
      this.project.blocks.push({ type, content: "", fontSize: this.fontSize });
    },
    saveProject() {
      console.log(this.project);
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
