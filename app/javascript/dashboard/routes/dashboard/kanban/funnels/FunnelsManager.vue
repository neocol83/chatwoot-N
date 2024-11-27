<template>
  <div class="funnels-manager">
    <h2 class="funnels-title">Gerenciador de Funis</h2>
    <div class="funnels-list">
      <div v-for="funnel in funnels" :key="funnel.id" class="funnel-item">
        <span class="funnel-name">{{ funnel.name }}</span>
        <div class="funnel-actions">
          <button @click="editFunnel(funnel)" class="edit-button">Editar</button>
          <button @click="deleteFunnel(funnel)" class="delete-button">Excluir</button>
        </div>
      </div>
    </div>
    <button @click="openFunnelPopup" class="add-funnel-button">
      Adicionar Novo Funil
    </button>

    <funnel-popup 
      v-if="showFunnelPopup" 
      :funnel="currentFunnel"
      :is-editing="!!editingFunnel"
      @close="closeFunnelPopup"
      @save="saveFunnel"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FunnelPopup from './FunnelPopup.vue';
import attributesAPI from '../../../../api/attributes';

export default {
  name: 'FunnelsManager',
  components: {
    FunnelPopup,
  },
  data() {
    return {
      showFunnelPopup: false,
      editingFunnel: null,
      currentFunnel: {
        name: '',
        stages: [],
      },
      funnels: [],
    };
  },
  mounted() {
    this.fetchFunnels();
  },
  computed: {
    ...mapGetters({
      funnels: 'kanban/getFunnels',
    }),
  },
  methods: {
    async fetchFunnels() {
      try {
        const response = await attributesAPI.getAttributesByModel();
        const funnelAttribute = response.data.find(attr => attr.attribute_key === 'funil');
        if (funnelAttribute && funnelAttribute.attribute_values) {
          this.funnels = funnelAttribute.attribute_values.map(value => ({ name: value }));
        }
      } catch (error) {
        console.error('Erro ao buscar funis:', error);
      }
    },
    openFunnelPopup() {
      this.showFunnelPopup = true;
      this.currentFunnel = { name: '', stages: [] };
      this.editingFunnel = null;
    },
    closeFunnelPopup() {
      this.showFunnelPopup = false;
      this.currentFunnel = { name: '', stages: [] };
      this.editingFunnel = null;
    },
    editFunnel(funnel) {
      this.editingFunnel = funnel;
      this.currentFunnel = JSON.parse(JSON.stringify(funnel));
      this.showFunnelPopup = true;
    },
    async deleteFunnel(funnel) {
      if (confirm(`Tem certeza que deseja excluir o funil "${funnel.name}"?`)) {
        try {
          const response = await attributesAPI.getAttributesByModel();
          const funnelAttribute = response.data.find(attr => attr.attribute_key === 'funil');
          if (funnelAttribute) {
            const updatedValues = funnelAttribute.attribute_values.filter(value => value !== funnel.name);
            await attributesAPI.update(funnelAttribute.id, {
              attribute_values: updatedValues,
            });
            await this.fetchFunnels();
          }
        } catch (error) {
          console.error('Erro ao excluir funil:', error);
        }
      }
    },
    async saveFunnel(funnel) {
      if (funnel.name) {
        try {
          const response = await attributesAPI.getAttributesByModel();
          const funnelAttribute = response.data.find(attr => attr.attribute_key === 'funil');
          if (funnelAttribute) {
            let updatedValues = [...funnelAttribute.attribute_values];
            if (this.editingFunnel) {
              const index = updatedValues.indexOf(this.editingFunnel.name);
              if (index !== -1) {
                updatedValues[index] = funnel.name;
              }
            } else {
              updatedValues.push(funnel.name);
            }
            await attributesAPI.update(funnelAttribute.id, {
              attribute_values: updatedValues,
            });
            await this.fetchFunnels();
          }
          this.closeFunnelPopup();
        } catch (error) {
          console.error('Erro ao salvar funil:', error);
        }
      } else {
        alert('Por favor, preencha o nome do funil.');
      }
    },
  },
};
</script>

<style scoped>
.funnels-manager {
  padding: 16px;
}

.funnels-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.funnels-list {
  margin-bottom: 16px;
}

.funnel-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.funnel-name {
  font-weight: 500;
}

.funnel-actions {
  display: flex;
  gap: 8px;
}

.edit-button,
.delete-button,
.add-funnel-button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button {
  background-color: #1976D2;
  color: white;
}

.delete-button {
  background-color: #D32F2F;
  color: white;
}

.add-funnel-button {
  background-color: #4CAF50;
  color: white;
  font-weight: 500;
}
</style>
