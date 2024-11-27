<template>
  <div class="settings-popup-overlay" @click="tryClose">
    <div class="settings-popup-content" @click.stop>
      <div class="settings-popup-header">
        <h2>Configurações do Kanban</h2>
        <button @click="tryClose" class="close-button">
          <svg class="icon" viewBox="0 0 24 24" width="24" height="24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor" />
          </svg>
        </button>
      </div>
      <div class="settings-layout">
        <div class="settings-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id" 
            @click="changeTab(tab.id)"
            :class="{ active: currentTab === tab.id, 'has-changes': tabsWithChanges[tab.id] }"
            class="tab-button"
          >
            <svg class="icon" viewBox="0 0 24 24" width="20" height="20">
              <path :d="tab.icon" fill="currentColor" />
            </svg>
            {{ tab.name }}
          </button>
        </div>
        <div class="settings-panel">
          <component 
            :is="currentTabComponent" 
            @settings-changed="handleSettingsChanged"
            :ref="currentTab"
          />
        </div>
      </div>
      <div class="settings-actions">
        <button @click="saveSettings" class="save-button">Salvar</button>
      </div>
    </div>

    <!-- Popup de confirmação -->
    <div v-if="showConfirmDialog" class="confirm-dialog">
      <p>Há alterações não salvas. Deseja sair sem salvar?</p>
      <button @click="confirmClose">Sim, sair</button>
      <button @click="cancelClose">Não, continuar editando</button>
    </div>
  </div>
</template>

<script>
import KanbanSettings from './settings/KanbanSettings.vue';
import MessageTemplates from './settings/MessageTemplates.vue';
import PersonalizeSettings from './settings/PersonalizeSettings.vue';
import IntegrationsSettings from './settings/IntegrationsSettings.vue';
import AdvancedSettings from './settings/AdvancedSettings.vue';
import DevelopmentSettings from './settings/DevelopmentSettings.vue';
import HelpSettings from './settings/HelpSettings.vue';

export default {
  name: 'SettingsPopup',
  components: {
    KanbanSettings,
    MessageTemplates,
    PersonalizeSettings,
    IntegrationsSettings,
    AdvancedSettings,
    DevelopmentSettings,
    HelpSettings,
  },
  data() {
    return {
      currentTab: 'kanban',
      tabsWithChanges: {},
      showConfirmDialog: false,
      tabs: [
        { id: 'kanban', name: 'Kanban', icon: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 2v10h14V7H5zm2 2h2v6H7V9zm4 0h2v6h-2V9zm4 0h2v6h-2V9z' },
        { id: 'message-templates', name: 'Modelos de Mensagens', icon: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z' },
        { id: 'personalize', name: 'Personalizar', icon: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z' },
        { id: 'integrations', name: 'Integrações', icon: 'M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z' },
        { id: 'advanced', name: 'Avançado', icon: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z' },
        { id: 'development', name: 'Desenvolvimento', icon: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z' },
        { id: 'help', name: 'Ajuda', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z' },
      ]
    }
  },
  computed: {
    currentTabComponent() {
      const componentMap = {
        kanban: KanbanSettings,
        'message-templates': MessageTemplates,
        personalize: PersonalizeSettings,
        integrations: IntegrationsSettings,
        advanced: AdvancedSettings,
        development: DevelopmentSettings,
        help: HelpSettings,
      };
      return componentMap[this.currentTab];
    },
    hasUnsavedChanges() {
      return Object.values(this.tabsWithChanges).some(value => value);
    }
  },
  methods: {
    handleSettingsChanged() {
      this.$set(this.tabsWithChanges, this.currentTab, true);
    },
    changeTab(newTab) {
      if (this.tabsWithChanges[this.currentTab]) {
        // Armazena as alterações atuais
        const currentComponent = this.$refs[this.currentTab];
        if (currentComponent && currentComponent.getSettings) {
          localStorage.setItem(`${this.currentTab}_settings`, JSON.stringify(currentComponent.getSettings()));
        }
      }
      this.currentTab = newTab;
    },
    tryClose() {
      if (this.hasUnsavedChanges) {
        this.showConfirmDialog = true;
      } else {
        this.$emit('close');
      }
    },
    confirmClose() {
      this.showConfirmDialog = false;
      this.$emit('close');
    },
    cancelClose() {
      this.showConfirmDialog = false;
    },
    saveSettings() {
      // Salva as configurações de todas as abas
      Object.keys(this.tabsWithChanges).forEach(tabId => {
        if (this.tabsWithChanges[tabId]) {
          const component = this.$refs[tabId];
          if (component && component.saveSettings) {
            component.saveSettings();
          }
        }
      });

      // Limpa as flags de alterações
      this.tabsWithChanges = {};

      // Emite evento para atualizar a aplicação
      this.$emit('settings-saved');

      // Recarrega a página
      window.location.reload();
    },
  }
}
</script>

<style lang="scss" scoped>
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
  z-index: 1000;
}

.settings-popup-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.settings-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--s-50);
  border-bottom: 1px solid var(--s-200);

  h2 {
    margin: 0;
    font-size: 20px;
    color: var(--s-800);
  }

  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--s-600);
    transition: color 0.3s ease;

    &:hover {
      color: var(--s-800);
    }

    .icon {
      width: 24px;
      height: 24px;
    }
  }
}

.settings-layout {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

.settings-tabs {
  width: 200px;
  border-right: 1px solid var(--s-200);
  padding: 20px 0;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.settings-panel {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-button {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--s-700);
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--s-100);
  }

  &.active {
    font-weight: bold;
    color: var(--w-500);
    background-color: var(--s-100);
  }

  .icon {
    margin-right: 10px;
  }

  &.has-changes::after {
    content: '*';
    color: var(--r-400);
    margin-left: 5px;
  }
}

.settings-actions {
  padding: 16px 24px;
  background-color: var(--s-50);
  border-top: 1px solid var(--s-200);
  display: flex;
  justify-content: flex-end;
}

.save-button {
  padding: 10px 20px;
  background-color: var(--w-500);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--w-600);
  }
}

.confirm-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1100;

  button {
    margin-top: 10px;
    margin-right: 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:first-of-type {
      background-color: var(--r-400);
      color: white;
    }

    &:last-of-type {
      background-color: var(--s-200);
    }
  }
}
</style>