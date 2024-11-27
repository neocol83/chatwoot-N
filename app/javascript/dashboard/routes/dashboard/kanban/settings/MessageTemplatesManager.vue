<template>
  <div class="message-templates-manager">
    <h2>Modelos de mensagens</h2>
    <div class="templates-list">
      <div v-for="(template, index) in templates" :key="index" class="template-item">
        <div class="template-info">
          <strong>{{ template.name }}</strong>
          <p>{{ template.preview }}</p>
          <span class="template-stage">Etapa: {{ template.stage }}</span>
        </div>
        <div class="template-actions">
          <button @click="editTemplate(index)" class="edit-button">Editar</button>
          <button @click="deleteTemplate(index)" class="delete-button">Excluir</button>
        </div>
      </div>
    </div>
    <button @click="showAddTemplate = true" class="add-template-button">+ Adicionar modelo</button>

    <!-- Modal para adicionar/editar template -->
    <div v-if="showAddTemplate || editingIndex !== null" class="template-modal">
      <div class="modal-content">
        <h3>{{ editingIndex !== null ? 'Editar' : 'Adicionar' }} modelo</h3>
        <input v-model="currentTemplate.name" placeholder="Nome do modelo" />
        <textarea v-model="currentTemplate.preview" placeholder="Conteúdo da mensagem"></textarea>
        <select v-model="currentTemplate.stage">
          <option value="">Selecione a etapa</option>
          <option value="pendente">Aguardando confirmação</option>
          <option value="preparacao">Em preparação</option>
          <option value="pronto">Pronto para entrega</option>
          <option value="a-caminho">A caminho</option>
        </select>
        <div class="modal-actions">
          <button @click="cancelEdit" class="cancel-button">Cancelar</button>
          <button @click="saveTemplate" class="save-button">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageTemplatesManager',
  data() {
    return {
      templates: [],
      showAddTemplate: false,
      editingIndex: null,
      currentTemplate: { name: '', preview: '', stage: '' },
    };
  },
  mounted() {
    this.loadTemplates();
  },
  methods: {
    loadTemplates() {
      const savedTemplates = localStorage.getItem('messageTemplates');
      this.templates = savedTemplates ? JSON.parse(savedTemplates) : [];
    },
    saveTemplates() {
      localStorage.setItem('messageTemplates', JSON.stringify(this.templates));
    },
    editTemplate(index) {
      this.editingIndex = index;
      this.currentTemplate = { ...this.templates[index] };
    },
    deleteTemplate(index) {
      if (confirm('Tem certeza que deseja excluir este modelo?')) {
        this.templates.splice(index, 1);
        this.saveTemplates();
      }
    },
    cancelEdit() {
      this.showAddTemplate = false;
      this.editingIndex = null;
      this.currentTemplate = { name: '', preview: '', stage: '' };
    },
    saveTemplate() {
      if (!this.currentTemplate.name || !this.currentTemplate.preview || !this.currentTemplate.stage) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
      if (this.editingIndex !== null) {
        this.templates[this.editingIndex] = { ...this.currentTemplate };
      } else {
        this.templates.push({ ...this.currentTemplate });
      }
      this.saveTemplates();
      this.cancelEdit();
    },
  },
};
</script>

<style lang="scss" scoped>
.message-templates-manager {
  padding: 20px;
}

.templates-list {
  margin-bottom: 20px;
}

.template-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #e0e0e0;
  margin-bottom: 10px;
  border-radius: 4px;
}

.template-info {
  flex-grow: 1;
}

.template-actions {
  display: flex;
  gap: 10px;
}

.edit-button, .delete-button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button {
  background-color: #4CAF50;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.add-template-button {
  background-color: #FF5500;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.template-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;

  input, textarea {
    width: 100%;
    margin-bottom: 10px;
    padding: 5px;
  }

  textarea {
    height: 100px;
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button, .save-button {
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background-color: #f0f0f0;
}

.save-button {
  background-color: #FF5500;
  color: white;
}

.template-stage {
  font-size: 12px;
  color: #666;
}

select {
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
}

</style>