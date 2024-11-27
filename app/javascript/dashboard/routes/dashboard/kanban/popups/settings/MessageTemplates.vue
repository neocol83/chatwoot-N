<template>
  <div class="message-templates-settings">
    <div class="message-templates-header">
      <h2 class="settings-title">Modelos de Mensagens</h2>
      <div class="filter-and-add">
        <div class="stage-filter-buttons">
          <button 
            v-for="stage in stages" 
            :key="stage.value"
            @click="filterTemplatesByStage(stage.value)"
            :class="{ active: currentStageFilter === stage.value }"
            class="stage-filter-button"
          >
            {{ stage.label }}
          </button>
        </div>
        <button @click="showAddTemplatePopup = true" class="add-template-button">
          Adicionar Novo Modelo
        </button>
      </div>
    </div>
    <div class="message-templates-grid">
      <div v-for="template in filteredMessageTemplates" :key="template.id" class="message-template-card">
        <div class="template-header">
          <h3>{{ template.name }}</h3>
          <div class="template-actions">
            <button @click="editTemplate(template)" class="edit-button">Editar</button>
            <button @click="deleteTemplate(template)" class="delete-button">Excluir</button>
          </div>
        </div>
        <p class="template-content">{{ template.content }}</p>
        <div class="template-stage-tag" :style="{ backgroundColor: getStageColor(template.stage) }">
          <svg class="stage-icon" viewBox="0 0 24 24" width="16" height="16">
            <path :d="stageIcons[template.stage]" fill="white" />
          </svg>
          {{ getStageLabel(template.stage) }}
        </div>
      </div>
    </div>

    <!-- Popup para adicionar/editar modelo -->
    <div v-if="showAddTemplatePopup" class="popup-overlay">
      <div class="popup-content">
        <h3>{{ editingTemplate ? 'Editar Modelo' : 'Adicionar Novo Modelo' }}</h3>
        <input v-model="currentTemplate.name" placeholder="Nome do modelo" />
        <textarea v-model="currentTemplate.content" placeholder="Conteúdo do modelo"></textarea>
        <div class="template-stage-select">
          <label for="template-stage">Etapa:</label>
          <select id="template-stage" v-model="currentTemplate.stage">
            <option value="">Todas as etapas</option>
            <option value="pendente">Confirmação</option>
            <option value="preparacao">Em preparação</option>
            <option value="pronto">Pronto para entrega</option>
            <option value="a-caminho">A caminho</option>
          </select>
        </div>
        <div class="popup-actions">
          <button @click="saveTemplate" class="save-button">Salvar</button>
          <button @click="closeTemplatePopup" class="cancel-button">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageTemplates',
  data() {
    return {
      messageTemplates: [],
      showAddTemplatePopup: false,
      currentTemplate: { id: null, name: '', content: '', stage: '' },
      editingTemplate: false,
      currentStageFilter: '',
      stages: [
        { value: '', label: 'Todas' },
        { value: 'pendente', label: 'Confirmação' },
        { value: 'preparacao', label: 'Em preparação' },
        { value: 'pronto', label: 'Pronto para entrega' },
        { value: 'a-caminho', label: 'A caminho' },
      ],
      stageIcons: {
        'pendente': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
        'preparacao': 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
        'pronto': 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
        'a-caminho': 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
      },
      hasChanges: false,
    };
  },
  computed: {
    filteredMessageTemplates() {
      if (this.currentStageFilter === '') {
        return this.messageTemplates;
      }
      return this.messageTemplates.filter(template => template.stage === this.currentStageFilter);
    },
  },
  methods: {
    filterTemplatesByStage(stage) {
      this.currentStageFilter = stage;
    },
    getStageLabel(stage) {
      const stageLabels = {
        'pendente': 'Confirmação',
        'preparacao': 'Em preparação',
        'pronto': 'Pronto para entrega',
        'a-caminho': 'A caminho',
        '': 'Todas as etapas'
      };
      return stageLabels[stage] || 'Desconhecida';
    },
    getStageColor(stage) {
      const colors = {
        'pendente': '#78350f',
        'preparacao': '#7c2d12',
        'pronto': '#14532d',
        'a-caminho': '#1e3a8a',
      };
      return colors[stage] || '#000000';
    },
    editTemplate(template) {
      this.currentTemplate = { ...template };
      this.editingTemplate = true;
      this.showAddTemplatePopup = true;
    },
    deleteTemplate(template) {
      const index = this.messageTemplates.findIndex(t => t.id === template.id);
      if (index !== -1) {
        this.messageTemplates.splice(index, 1);
        localStorage.setItem('messageTemplates', JSON.stringify(this.messageTemplates));
        this.$emit('show-toast', 'Modelo excluído com sucesso', 'success');
        this.hasChanges = true;
        this.$emit('settings-changed');
      }
    },
    saveTemplate() {
      if (this.currentTemplate.name && this.currentTemplate.content) {
        const template = {
          id: this.currentTemplate.id || Date.now(),
          name: this.currentTemplate.name,
          content: this.currentTemplate.content,
          stage: this.currentTemplate.stage || ''
        };

        if (this.editingTemplate) {
          const index = this.messageTemplates.findIndex(t => t.id === template.id);
          if (index !== -1) {
            this.$set(this.messageTemplates, index, template);
          }
        } else {
          this.messageTemplates.push(template);
        }

        localStorage.setItem('messageTemplates', JSON.stringify(this.messageTemplates));
        this.closeTemplatePopup();
        this.$emit('show-toast', `Modelo ${this.editingTemplate ? 'atualizado' : 'adicionado'} com sucesso`, 'success');
        this.hasChanges = true;
        this.$emit('settings-changed');
      } else {
        this.$emit('show-toast', 'Por favor, preencha todos os campos', 'error');
      }
    },
    closeTemplatePopup() {
      this.showAddTemplatePopup = false;
      this.currentTemplate = { id: null, name: '', content: '', stage: '' };
      this.editingTemplate = false;
    },
    loadMessageTemplates() {
      const savedTemplates = localStorage.getItem('messageTemplates');
      if (savedTemplates) {
        this.messageTemplates = JSON.parse(savedTemplates);
      }
    },
    getSettings() {
      return {
        messageTemplates: this.messageTemplates,
      };
    },
    saveSettings() {
      localStorage.setItem('messageTemplates', JSON.stringify(this.messageTemplates));
      this.hasChanges = false;
    },
  },
  mounted() {
    this.loadMessageTemplates();
  },
};
</script>

<style lang="scss" scoped>
.message-templates-settings {
  .message-templates-header {
    margin-bottom: 24px;
  }

  .filter-and-add {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
  }

  .stage-filter-buttons {
    display: flex;
    gap: 8px;
  }

  .stage-filter-button {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 20px;
    background-color: white;
    color: #4b5563;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f3f4f6;
      border-color: #9ca3af;
    }

    &.active {
      @apply border-woot-500 bg-woot-50 text-woot-800;
    }
  }

  .message-templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .message-template-card {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s, transform 0.3s;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);
    }

    .template-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      h3 {
        font-size: 16px;
        color: #333;
        font-weight: 600;
      }

      .template-actions {
        display: flex;
        gap: 8px;

        .edit-button, .delete-button {
          @apply bg-woot-500 text-white;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            @apply bg-woot-600;
          }
        }
      }
    }

    .template-content {
      font-size: 14px;
      color: #555;
      margin-bottom: 8px;
    }

    .template-stage-tag {
      @apply bg-woot-500 text-white;
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 12px;
    }
  }
}

.add-template-button {
  padding: 6px 12px;
  @apply bg-woot-500 text-white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    @apply bg-woot-600;
  }
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;

  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 18px;
    color: #1F2937;
  }

  input, textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #D1D5DB;
    border-radius: 4px;
    font-size: 14px;
  }

  textarea {
    height: 100px;
    resize: vertical;
  }
}

.template-stage-select {
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
    color: #4B5563;
  }

  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #D1D5DB;
    border-radius: 4px;
    font-size: 14px;
    color: #1F2937;
    background-color: white;
  }
}

.popup-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  button {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }

  .save-button {
    @apply bg-woot-500 text-white;
    border: none;
  }

  .cancel-button {
    background-color: #EF4444;
    color: white;
    border: none;
  }
}
</style>