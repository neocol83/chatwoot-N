<template>
  <div class="settings-popup-overlay">
    <div class="settings-popup-content">
      <h2>Configurações do Dashboard</h2>
      <div class="settings-layout">
        <div class="settings-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id" 
            @click="currentTab = tab.id"
            :class="{ active: currentTab === tab.id }"
            class="tab-button"
          >
            {{ tab.name }}
          </button>
        </div>
        <div class="settings-panel">
          <component :is="currentTabComponent" />
        </div>
      </div>
      <div class="settings-actions">
        <button @click="saveSettings" class="save-button">Salvar</button>
        <button @click="$emit('close')" class="close-button">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
import GeneralSettings from './settings/GeneralSettings.vue';
import VisibilitySettings from './settings/VisibilitySettings.vue';
import ColorSettings from './settings/ColorSettings.vue';

export default {
  name: 'SettingsPopup',
  components: {
    GeneralSettings,
    VisibilitySettings,
    ColorSettings
  },
  data() {
    return {
      currentTab: 'general',
      tabs: [
        { id: 'general', name: 'Geral' },
        { id: 'visibility', name: 'Visibilidade' },
        { id: 'colors', name: 'Cores' }
      ]
    }
  },
  computed: {
    currentTabComponent() {
      const componentMap = {
        general: GeneralSettings,
        visibility: VisibilitySettings,
        colors: ColorSettings
      };
      return componentMap[this.currentTab];
    }
  },
  methods: {
    saveSettings() {
      // Implementar lógica para salvar configurações
      console.log('Salvando configurações...');
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.settings-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.settings-popup-content {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.settings-layout {
  display: flex;
  margin-top: 20px;
}

.settings-tabs {
  width: 200px;
  border-right: 1px solid var(--s-200);
  padding-right: 20px;
}

.settings-panel {
  flex-grow: 1;
  padding-left: 20px;
}

.tab-button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--s-700);
}

.tab-button.active {
  font-weight: bold;
  color: var(--w-500);
  background-color: var(--s-100);
  border-radius: 4px;
}

.settings-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.save-button, .close-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  background-color: var(--w-500);
  color: white;
}

.close-button {
  background-color: var(--s-200);
  color: var(--s-700);
}
</style>
