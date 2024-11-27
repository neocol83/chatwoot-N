<template>
  <div class="kanban-component">
    <div class="kanban-header">
      <div class="tabs">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'kanban' }"
          @click="activeTab = 'kanban'"
          data-tab="kanban"
        >
          Kanban
          <span class="task-count">{{ totalTasks }}</span>
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'dashboard' }"
          @click="activeTab = 'dashboard'"
          data-tab="dashboard"
        >
          Dashboard
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'time-tracking' }"
          @click="activeTab = 'time-tracking'"
          data-tab="time-tracking"
        >
          Rastreio de Tempo
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'settings' }"
          @click="activeTab = 'settings'"
          data-tab="settings"
        >
          Configurações
        </button>
      </div>
      <div class="header-container">
        <div class="header-content">
          <h1 class="header-title">{{ currentTabTitle }}</h1>
          <p class="header-subtitle">{{ currentTabSubtitle }}</p>
        </div>
        <div class="search-and-switch">
          <div class="search-container">
            <input
              ref="searchInput"
              type="text"
              id="search-input"
              placeholder="Buscar pedido..."
              v-model="searchTerm"
              @input="handleSearch"
              :class="{ 'show-search': showSearchInput }"
            />
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" @click="toggleSearch">
              <path :d="dashboardIcons['search-outline']" fill="currentColor" />
            </svg>
          </div>
          <div class="switch-container">
            <span class="switch-label">Resposta rápida</span>
            <label class="switch">
              <input type="checkbox" v-model="quickReplyEnabled" @change="saveQuickReplyState" />
              <span class="slider round">
                <svg class="slider-icon" viewBox="0 0 24 24" width="12" height="12">
                  <path :d="dashboardIcons['thunder']" fill="currentColor" />
                </svg>
              </span>
            </label>
          </div>
          <button class="new-order-button">Novo pedido</button>
        </div>
      </div>
    </div>
    <div class="kanban-content">
      <KanbanTab
        ref="kanbanTab"
        v-if="activeTab === 'kanban'"
        :columns="columns"
        :estimativas="estimativas"
        :itemTimers="itemTimers"
        :currentTheme="currentTheme"
        @start-new-timer="startNewTimer"
        @update-timers="updateTimers"
        @editar-estimativas="editarEstimativas"
        @drag-start="dragStart"
        @drag-end="dragEnd"
        @toggle-item-expand="toggleItemExpand"
        @send-message="sendMessage"
        @toggle-priority="togglePriority"
        @avancar-pedido="avancarPedido"
        @item-moved="handleItemMoved"
        @item-delivered="handleItemDelivered"
      />
      <div v-if="activeTab === 'dashboard'" class="dashboard-container">
        <kanban-dashboard :columns="columns" :estimativas="estimativas"></kanban-dashboard>
      </div>
      <div v-if="activeTab === 'settings'" class="settings-container">
        <div class="settings-tabs">
          <button
            v-for="tab in settingsTabs"
            :key="tab.id"
            class="settings-tab-button"
            :class="{ active: activeSettingsTab === tab.id }"
            @click="activeSettingsTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="settings-content">
          <!-- Configurações do Kanban -->
          <div v-if="activeSettingsTab === 'kanban'" class="kanban-settings">
            <h2 class="settings-title">Configurações do Kanban</h2>
            <div class="settings-section">
              <h3 class="section-title">Estimativas de Tempo</h3>
              <div class="estimate-settings">
                <div class="estimate-input" v-for="(value, key) in estimativas" :key="key">
                  <label :for="key">{{ getEstimateLabel(key) }}:</label>
                  <input 
                    :id="key" 
                    v-model="estimativas[key]" 
                    type="number" 
                    min="0" 
                    @change="salvarEstimativas"
                  />
                </div>
              </div>
            </div>
            <div class="settings-section">
              <h3 class="section-title">Confirmação Automática</h3>
              <div class="switch-container">
                <label class="switch">
                  <input type="checkbox" v-model="confirmacaoAutomatica" @change="toggleConfirmacaoAutomatica">
                  <span class="slider round">
                    <svg class="slider-icon" viewBox="0 0 24 24" width="12" height="12">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                    </svg>
                  </span>
                </label>
                <span class="switch-label">Ativar confirmação automática de pedidos</span>
              </div>
            </div>
          </div>

          <!-- Configurações de Modelos de Mensagens -->
          <div v-if="activeSettingsTab === 'message-templates'" class="message-templates-settings">
            <div class="message-templates-header">
              <h2 class="settings-title">Modelos de Mensagens</h2>
              <div class="stage-filter-buttons">
                <button 
                  v-for="stage in stages" 
                  :key="stage.value"
                  @click="filterTemplatesByStage(stage.value)"
                  :class="{ active: currentStageFilter === stage.value }"
                  class="stage-filter-button"
                >
                  {{ stage.label }} <!-- Removido o ícone -->
                </button>
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

          <!-- Aba Personalizar -->
          <div v-if="activeSettingsTab === 'personalizar'" class="personalizar-tab">
            <h2 class="settings-title">Personalizar Tema</h2>
            <div class="theme-options">
              <div 
                class="theme-option"
                :class="{ 'theme-option-active': currentTheme === 'color' }"
                @click="setTheme('color')"
              >
                <div class="theme-preview color-theme" :style="{ backgroundColor: previewColor }">
                  <span class="theme-title">Color Theme</span>
                  <span class="theme-description">Tema colorido e vibrante</span>
                  <div class="color-palette">
                    <div v-for="shade in colorShades" :key="shade" :style="{ backgroundColor: shade }" class="color-shade"></div>
                  </div>
                </div>
                <span class="theme-label">Color</span>
                <button @click.stop="openColorPicker" class="custom-color-button">
                  <span class="color-preview" :style="{ backgroundColor: selectedColor || defaultWootColor }"></span>
                  Escolher cor personalizada
                </button>
                <input 
                  ref="colorPicker"
                  type="color" 
                  :value="selectedColor || defaultWootColor"
                  @input="handleColorChange"
                  class="color-picker-input"
                  style="position: absolute; opacity: 0; pointer-events: none;"
                >
              </div>
              <div 
                class="theme-option"
                :class="{ 'theme-option-active': currentTheme === 'light' }"
                @click="setTheme('light')"
              >
                <div class="theme-preview light-theme">
                  <span class="theme-title">Light Theme</span>
                  <span class="theme-description">Tema claro e minimalista</span>
                </div>
                <span class="theme-label">Light</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'time-tracking'" class="time-tracking-container">
        <time-tracking></time-tracking>
      </div>
    </div>
    
    <div class="toast-container">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import conversationAPI from '../../../api/conversations';
import messageAPI from '../../../api/inbox/message';
import labelsAPI from '../../../api/labels';
import inboxMixin from 'shared/mixins/inboxMixin';
import dashboardIcons from 'shared/components/FluentIcon/dashboard-icons.json';
import KanbanDashboard from './dashboard/KanbanDashboard.vue';
import TimeTracking from './time-tracking/TimeTracking.vue';
import KanbanTab from './kanban/KanbanTab.vue';
import MessageTemplatesManager from './settings/MessageTemplatesManager.vue';
import WootColorPicker from '../../../components/widgets/ColorPicker.vue'; // Corrigido o caminho de importação
import { updateThemeColor, setColorTheme, loadSavedThemeColor } from '../../../helper/themeHelper';
import { colors } from '../../../../../../theme/colors';

export default {
  name: 'KanbanBoard',
  mixins: [inboxMixin],
  components: {
    KanbanDashboard,
    TimeTracking,
    KanbanTab,
    MessageTemplatesManager,
    WootColorPicker,
  },
  data() {
    return {
      activeTab: 'kanban',
      activeSettingsTab: 'kanban',
      columns: [
        { id: 'pendente', title: 'Confirmação', items: [] },
        { id: 'preparacao', title: 'Em preparação', items: [] },
        { id: 'pronto', title: 'Pronto para entrega', items: [] },
        { id: 'a-caminho', title: 'A caminho', items: [] },
      ],
      searchTerm: '',
      quickReplyEnabled: false,
      dashboardIcons: dashboardIcons,
      estimativas: {
        balcao: 15,
        delivery: 30,
        limiteAtraso: 10,
        capacidadeMaxima: 20
      },
      tempoRastreio: {},
      intervalId: null,
      itemTimers: {},
      timerInterval: null,
      currentTheme: 'color', // Tema padrão
      toasts: [], // Adicione isso se ainda não existir
      tabInfo: {
        kanban: {
          title: 'Gestão de pedidos',
          subtitle: 'Gerencie seus pedidos de forma eficiente com nosso Kanban.'
        },
        dashboard: {
          title: 'Dashboard',
          subtitle: 'Visualize métricas e estatísticas importantes.'
        },
        'time-tracking': {
          title: 'Rastreio de Tempo',
          subtitle: 'Acompanhe o tempo gasto em cada etapa do processo.'
        },
        settings: {
          title: 'Configurações',
          subtitle: 'Personalize as opções do seu Kanban e outras configurações.'
        }
      },
      showSearchInput: false,
      confirmacaoAutomatica: false,
      settingsTabs: [
        { id: 'kanban', label: 'Kanban' },
        { id: 'message-templates', label: 'Modelos de mensagens' },
        { id: 'personalizar', label: 'Personalizar' },
      ],
      themes: [
        { value: 'color', label: 'Color', previewColor: '#369eff', textColor: '#FFFFFF' },
        { value: 'light', label: 'Light', previewColor: '#F3F4F6', textColor: '#1F2937' },
      ],
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
      selectedColor: null,
      defaultWootColor: colors.woot[500],
      showColorPicker: false,
      colorShades: [],
    };
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
      inboxes: 'inboxes/getInboxes',
    }),
    currentTabTitle() {
      return this.tabInfo[this.activeTab]?.title || 'Título Padrão';
    },
    currentTabSubtitle() {
      return this.tabInfo[this.activeTab]?.subtitle || 'Subtítulo Padrão';
    },
    totalTasks() {
      return this.columns.reduce((total, column) => total + column.items.length, 0);
    },
    filteredMessageTemplates() {
      if (this.currentStageFilter === '') {
        return this.messageTemplates;
      }
      return this.messageTemplates.filter(template => template.stage === this.currentStageFilter);
    },
    previewColor() {
      return this.selectedColor || this.defaultWootColor;
    },
    taskCountBackgroundColor() {
      // Usa um tom muito mais claro da cor do tema
      return this.adjustColor(this.selectedColor || this.defaultWootColor, 0.8);
    }
  },
  created() {
    this.initializeTimers();
    this.startTimerUpdates();
  },
  beforeDestroy() {
    this.stopTimerUpdates();
  },
  mounted() {
    this.fetchConversations();
    this.loadQuickReplyState();
    this.carregarEstimativas();
    this.iniciarRastreioTempo();
    const savedTheme = localStorage.getItem('kanbanTheme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }
    // Adicione esta linha para configurar o drag and drop na inicialização
    this.$nextTick(() => this.setupKanbanDragAndDrop());
    const savedConfirmacao = localStorage.getItem('confirmacaoAutomatica');
    if (savedConfirmacao !== null) {
      this.confirmacaoAutomatica = JSON.parse(savedConfirmacao);
    }
    this.loadMessageTemplates();
    this.loadSavedTheme();
    loadSavedThemeColor(); // Carrega e aplica a cor salva
    this.generateColorShades(this.selectedColor || this.defaultWootColor);
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'kanban') {
        this.$nextTick(() => this.setupKanbanDragAndDrop());
      }
    }
  },
  methods: {
    async fetchConversations() {
      try {
        const response = await conversationAPI.get({
          accountId: this.currentUser.account_id,
          headers: {
            'Authorization': `Bearer ${this.currentUser.access_token}`
          }
        });
        if (response.data && response.data.data && response.data.data.payload) {
          this.populateKanban(response.data.data.payload);
        } else {
          console.error('Formato de resposta inesperado:', response);
        }
      } catch (error) {
        console.error('Erro ao buscar conversas:', error);
      }
    },
    populateKanban(conversations) {
      if (!Array.isArray(conversations)) {
        console.error('As conversas recebidas não são um array:', conversations);
        return;
      }

      this.columns.forEach((column) => {
        column.items = conversations.filter((conv) => {
          return Array.isArray(conv.labels) && this.getColumnIdFromLabels(conv.labels) === column.id;
        }).map(conv => ({
          id: conv.id,
          sender: {
            name: conv.meta.sender ? conv.meta.sender.name : 'Desconhecido',
            avatar_url: conv.meta.sender ? conv.meta.sender.avatar_url : null
          },
          inbox: this.inboxes.find(inbox => inbox.id === conv.inbox_id),
          custom_attributes: conv.custom_attributes || {},
          labels: conv.labels || [],
          expanded: false,
          showTimeTracking: false,
          priority: false
        }));
      });

      console.log('Colunas populadas:', this.columns);
    },
    getColorFromName(name) {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const c = (hash & 0x00ffffff).toString(16).toUpperCase();
      return '#' + '00000'.substring(0, 6 - c.length) + c;
    },
    getInitials(name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    },
    getChannelIcon(inbox) {
      if (!inbox) return this.dashboardIcons['question-circle-outline'];
      
      const channelType = inbox.channel_type;
      const icons = {
        'Channel::Whatsapp': this.dashboardIcons['brand-whatsapp-outline'],
        'Channel::WebWidget': this.dashboardIcons['globe-outline'],
        'Channel::Api': this.dashboardIcons['code-outline'],
        // Adicione mais tipos de canal conforme necessrio
      };
      return icons[channelType] || this.dashboardIcons['inbox-outline'];
    },
    getInboxName(inbox) {
      return inbox ? inbox.name : 'Canal Desconhecido';
    },
    openConversation(conversationId) {
      window.location.href = `${this.$chatwoot.baseUrl}/app/accounts/${this.currentUser.account_id}/conversations/${conversationId}`;
    },
    async moveItemToColumn(item, newColumnId) {
      const oldColumnId = this.getColumnIdFromLabels(item.labels);
      if (oldColumnId === newColumnId) return;

      try {
        const oldColumn = this.columns.find(col => col.id === oldColumnId);
        oldColumn.items = oldColumn.items.filter(i => i.id !== item.id);

        const newColumn = this.columns.find(col => col.id === newColumnId);
        newColumn.items.push(item);

        const newLabel = this.getNewLabelFromStage(newColumnId);
        await this.updateItemLabels(item, [newLabel]);

        item.labels = [newLabel];

        this.updateColumnCounts();

        if (this.quickReplyEnabled) {
          await this.sendQuickMessage(item.id);
        }

        // Reinicia o timer quando o item é movido para uma nova coluna
        this.startNewTimer({ itemId: item.id, columnId: newColumnId });
      } catch (error) {
        console.error('Erro ao mover item:', error);
        this.showToast('Erro ao mover item', 'error');
        this.revertItemMove(item, oldColumnId);
      }
    },
    async updateItemLabels(item, newLabels) {
      try {
        await conversationAPI.updateLabels(item.id, newLabels);
        this.showToast('Etapas atualizadas com sucesso', 'success');
      } catch (error) {
        console.error('Erro ao atualizar etapas:', error);
        throw error;
      }
    },
    async sendQuickMessage(conversationId) {
      const item = this.columns.flatMap(col => col.items).find(i => i.id === conversationId);
      if (!item) return;

      const columnId = this.columns.find(col => col.items.includes(item)).id;
      let message;
      switch (columnId) {
        case 'pendente':
          message = "Olá! Seu pedido foi recebido e está sendo processado.";
          break;
        case 'preparacao':
          message = "Seu pedido está em preparo! Em breve estará pronto para entrega.";
          break;
        case 'pronto':
          message = "Ótimas notícias! Seu pedido está pronto para entrega.";
          break;
        case 'a-caminho':
          message = "Seu pedido saiu para entrega! Em breve chegará até você.";
          break;
        default:
          message = "Obrigado pelo seu pedido. Estamos processando as informações.";
      }

      try {
        await messageAPI.create({
          conversationId,
          message,
          private: false,
          contentAttributes: {},
        });
        
        this.updateConversationWithNewMessage(conversationId, message);
        this.showToast(`Mensagem enviada para ${item.sender.name}`, 'success');
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        this.showToast('Erro ao enviar mensagem. Por favor, tente novamente.', 'error');
      }
    },
    updateConversationWithNewMessage(conversationId, messageContent) {
      const conversation = this.columns.flatMap(col => col.items).find(i => i.id === conversationId);
      if (conversation) {
        if (!conversation.messages) {
          conversation.messages = [];
        }
        conversation.messages.push({
          content: messageContent,
          sender: this.currentUser,
          created_at: new Date().toISOString(),
        });
        this.$forceUpdate();
      }
    },
    showToast(message, type = 'info') {
      // Se você já tem um sistema de toast implementado, use-o aqui
      // Caso contrário, você pode implementar um sistema básico assim:
      const toast = {
        id: Date.now(),
        message,
        type
      };
      this.toasts.push(toast);
      setTimeout(() => {
        const index = this.toasts.findIndex(t => t.id === toast.id);
        if (index !== -1) {
          this.toasts.splice(index, 1);
        }
      }, 3000);
    },
    dragStart(event, item) {
      event.dataTransfer.setData('text/plain', JSON.stringify(item));
      event.target.classList.add('dragging');
    },
    dragEnd(event) {
      event.target.classList.remove('dragging');
    },
    setupKanbanDragAndDrop() {
      const kanbanBoard = this.$el.querySelector('.kanban-board');
      if (kanbanBoard) {
        kanbanBoard.removeEventListener('dragover', this.dragOver);
        kanbanBoard.removeEventListener('drop', this.drop);
        kanbanBoard.addEventListener('dragover', this.dragOver);
        kanbanBoard.addEventListener('drop', this.drop);
      }
    },
    dragOver(event) {
      event.preventDefault();
    },
    async drop(event) {
      event.preventDefault();
      const itemData = JSON.parse(event.dataTransfer.getData('text/plain'));
      const targetColumn = event.target.closest('.kanban-column');
      if (targetColumn) {
        const newColumnId = targetColumn.id;
        await this.moveItemToColumn(itemData, newColumnId);
      }
    },
    revertItemMove(item, oldColumnId) {
      const newColumn = this.columns.find(col => col.items.includes(item));
      newColumn.items = newColumn.items.filter(i => i.id !== item.id);

      const oldColumn = this.columns.find(col => col.id === oldColumnId);
      oldColumn.items.push(item);

      this.updateColumnCounts();
    },
    getColumnIdFromLabels(labels) {
      if (labels.includes('pendente')) return 'pendente';
      if (labels.includes('preparacao')) return 'preparacao';
      if (labels.includes('pronto')) return 'pronto';
      if (labels.includes('a-caminho')) return 'a-caminho';
      return 'pendente';
    },
    getNewLabelFromStage(columnId) {
      const labelMap = {
        'pendente': 'pendente',
        'preparacao': 'preparacao',
        'pronto': 'pronto',
        'a-caminho': 'entrega'
      };
      return labelMap[columnId] || 'pendente';
    },
    updateColumnCounts() {
      this.columns.forEach(column => {
        column.count = column.items.length;
      });
    },
    handleSearch() {
      const searchTerm = this.searchTerm.toLowerCase();
      this.columns.forEach((column) => {
        column.items.forEach((item) => {
          const text = `${item.sender.name} ${item.custom_attributes.endereo_de_entrega} ${item.custom_attributes.mtodo_de_pagamento}`.toLowerCase();
          this.$set(item, 'hidden', !text.includes(searchTerm));
        });
      });
    },
    saveQuickReplyState() {
      localStorage.setItem('quickReplyEnabled', this.quickReplyEnabled);
    },
    loadQuickReplyState() {
      const savedState = localStorage.getItem('quickReplyEnabled');
      this.quickReplyEnabled = savedState === 'true';
    },
    editarEstimativas() {
      // Aqui você pode abrir um modal ou mudar para a aba de configurações
      this.activeTab = 'settings';
      this.activeSettingsTab = 'kanban';
    },
    salvarEstimativas() {
      localStorage.setItem('estimativas', JSON.stringify(this.estimativas));
      this.$toast.success('Estimativas salvas com sucesso');
    },
    carregarEstimativas() {
      const savedEstimates = localStorage.getItem('estimativas');
      if (savedEstimates) {
        this.estimativas = JSON.parse(savedEstimates);
      }
    },
    toggleItemExpand(item) {
      this.$set(item, 'expanded', !item.expanded);
    },
    async sendMessage(item, message) {
      try {
        await messageAPI.create({
          conversationId: item.id,
          message,
          private: false,
          contentAttributes: {},
        });
        
        this.updateConversationWithNewMessage(item.id, message);
        this.showToast(`Mensagem enviada para ${item.sender.name}`, 'success');
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        this.showToast('Erro ao enviar mensagem. Por favor, tente novamente.', 'error');
      }
    },
    togglePriority(item) {
      item.priority = !item.priority;
      // Aqui você pode adicionar lógica para salvar o estado de prioridade no backend, se necessário
    },
    avancarPedido(item) {
      // Lógica para avançar o pedido para a próxima etapa
    },
    iniciarRastreioTempo() {
      this.intervalId = setInterval(() => {
        this.atualizarTempoRastreio();
      }, 1000);
    },
    atualizarTempoRastreio() {
      this.columns.forEach(column => {
        column.items.forEach(item => {
          if (!this.tempoRastreio[item.id]) {
            this.tempoRastreio[item.id] = {};
          }
          if (!this.tempoRastreio[item.id][column.id]) {
            this.tempoRastreio[item.id][column.id] = 0;
          }
          this.tempoRastreio[item.id][column.id]++;
        });
      });
      this.salvarTempoRastreioNoLocalStorage();
    },
    salvarTempoRastreioNoLocalStorage() {
      localStorage.setItem('pedidosTempoRastreio', JSON.stringify(this.tempoRastreio));
    },
    atualizarTempoRastreioAoMover(itemId, oldColumnId, newColumnId) {
      if (!this.tempoRastreio[itemId]) {
        this.tempoRastreio[itemId] = {};
      }
      if (!this.tempoRastreio[itemId][newColumnId]) {
        this.tempoRastreio[itemId][newColumnId] = 0;
      }
      // Zera o tempo na nova coluna
      this.tempoRastreio[itemId][newColumnId] = 0;
      this.salvarTempoRastreioNoLocalStorage();
    },
    formatTempoRastreio(segundos) {
      const minutos = Math.floor(segundos / 60);
      const segundosRestantes = segundos % 60;
      return `${minutos}m ${segundosRestantes}s`;
    },
    initializeTimers() {
      this.columns.forEach(column => {
        column.items.forEach(item => {
          if (!this.itemTimers[item.id]) {
            this.startNewTimer({ itemId: item.id, columnId: column.id });
          }
        });
      });
    },
    startNewTimer({ itemId, columnId }) {
      const startTime = Date.now();
      this.$set(this.itemTimers, itemId, { startTime, columnId, elapsedTime: 0 });
      localStorage.setItem(`timer_${itemId}`, `${startTime},${columnId}`);
    },
    startTimerUpdates() {
      this.stopTimerUpdates();
      this.timerInterval = setInterval(() => {
        this.updateTimers();
      }, 1000);
    },
    stopTimerUpdates() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
    updateTimers() {
      const now = Date.now();
      const fourMinutesInSeconds = 4 * 60; // 4 minutos em segundos
      Object.keys(this.itemTimers).forEach(itemId => {
        const timer = this.itemTimers[itemId];
        const elapsedSeconds = Math.floor((now - timer.startTime) / 1000);
        
        if (elapsedSeconds >= fourMinutesInSeconds) {
          // Reinicia o timer quando atingir 4 minutos
          this.startNewTimer({ itemId, columnId: timer.columnId });
        } else {
          this.$set(this.itemTimers[itemId], 'elapsedTime', elapsedSeconds);
        }
      });
    },
    changeTheme(theme) {
      this.currentTheme = theme;
      localStorage.setItem('kanbanTheme', theme);
      this.showToast(`Tema ${theme === 'light' ? 'Light' : 'Color'} ativado`, 'success');
    },
    toggleSearch() {
      this.showSearchInput = !this.showSearchInput;
      if (this.showSearchInput) {
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      }
    },
    handleItemMoved({ item, fromStage, toStage }) {
      // Lógica para lidar com o item movido
      this.showToast(`Pedido #${item.id} movido de ${fromStage} para ${toStage}`, 'success');
    },

    handleItemDelivered(item) {
      // Lógica para lidar com o item entregue
      this.showToast(`Pedido #${item.id} marcado como entregue`, 'success');
    },
    toggleConfirmacaoAutomatica() {
      localStorage.setItem('confirmacaoAutomatica', JSON.stringify(this.confirmacaoAutomatica));
      this.showToast('Configuração de confirmação automática salva', 'success');
    },
    getEstimateLabel(key) {
      const labels = {
        balcao: 'Balcão (minutos)',
        delivery: 'Delivery (minutos)',
        limiteAtraso: 'Limite aceitável de atraso (minutos)',
        capacidadeMaxima: 'Capacidade máxima (pedidos)',
      };
      return labels[key] || key;
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
        // Atualizar o localStorage após a exclusão
        localStorage.setItem('messageTemplates', JSON.stringify(this.messageTemplates));
        this.showToast('Modelo excluído com sucesso', 'success');
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

        // Salvar os templates no localStorage
        localStorage.setItem('messageTemplates', JSON.stringify(this.messageTemplates));

        this.closeTemplatePopup();
        this.showToast(`Modelo ${this.editingTemplate ? 'atualizado' : 'adicionado'} com sucesso`, 'success');
      } else {
        this.showToast('Por favor, preencha todos os campos', 'error');
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
    filterTemplatesByStage(stage) {
      this.currentStageFilter = stage;
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
    setTheme(theme) {
      this.currentTheme = theme;
      localStorage.setItem('kanbanTheme', theme);
      this.applyTheme(theme);
    },
    
    applyTheme(theme) {
      if (theme === 'color') {
        setColorTheme(false);
        updateThemeColor(this.previewColor);
      } else {
        setColorTheme(true);
      }
    },
    
    handleColorChange(event) {
      const color = event.target.value;
      console.log('handleColorChange chamado com cor:', color);
      this.selectedColor = color;
      localStorage.setItem('kanbanColor', color);
      console.log('Cor salva no localStorage');
      updateThemeColor(color);
      this.generateColorShades(color);
      this.$forceUpdate();
      console.log('Componente forçado a atualizar');
    },
    
    loadSavedTheme() {
      const savedTheme = localStorage.getItem('kanbanTheme') || 'color';
      const savedColor = localStorage.getItem('kanbanColor');
      
      this.currentTheme = savedTheme;
      
      if (savedColor) {
        this.selectedColor = savedColor;
        this.generateColorShades(savedColor);
      }
      
      this.applyTheme(this.currentTheme);
    },
    
    toggleColorPicker() {
      this.showColorPicker = !this.showColorPicker;
    },
    
    generateColorShades(baseColor) {
      const shades = [25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900];
      this.colorShades = shades.map(shade => {
        return this.adjustColor(baseColor, (shade - 500) / 1000);
      });
    },
    
    adjustColor(hex, factor) {
      // Remove o # se presente
      hex = hex.replace(/^#/, '');

      // Converte para RGB
      let r = parseInt(hex.slice(0, 2), 16);
      let g = parseInt(hex.slice(2, 4), 16);
      let b = parseInt(hex.slice(4, 6), 16);

      // Ajusta os valores RGB (torna mais claro)
      r = Math.min(255, Math.round(r + (255 - r) * factor));
      g = Math.min(255, Math.round(g + (255 - g) * factor));
      b = Math.min(255, Math.round(b + (255 - b) * factor));

      // Converte de volta para hexadecimal
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    },
    openColorPicker() {
      this.$refs.colorPicker.click();
    },
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~dashboard/assets/scss/variables';

.kanban-component {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: var(--s-50);
  color: $color-body;
  font-family: inherit;
}

.kanban-header {
  flex-shrink: 0;
  padding: $space-normal;
  background-color: var(--white);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.kanban-content {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: none; /* Para Firefox */
  -ms-overflow-style: none;  /* Para Internet Explorer e Edge */
  &::-webkit-scrollbar {
    display: none; /* Para Chrome, Safari e Opera */
  }
}

.dashboard-container,
.settings-container,
.time-tracking-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: $space-normal;
  scrollbar-width: none; /* Para Firefox */
  -ms-overflow-style: none;  /* Para Internet Explorer e Edge */
  &::-webkit-scrollbar {
    display: none; /* Para Chrome, Safari e Opera */
  }
}

.tabs {
  display: flex;
  padding-left: 0px;
  margin-bottom: $space-micro;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
}

.header-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-smaller;
  margin-top: 0;
}

.header-title {
  font-weight: $font-weight-black;
  color: $color-heading;
  font-size: 20px;
  margin-bottom: 0;
}

.header-subtitle {
  font-size: $font-size-small;
  color: $color-light-gray;
  margin-top: $space-micro;
}

.tab-button {
  position: relative;
  display: flex;
  align-items: center;
  padding: $space-small $space-normal;
  border: none;
  background-color: transparent;
  color: $color-light-gray;
  cursor: pointer;
  font-size: $font-size-small;
  font-weight: $font-weight-medium;
  transition: background-color 0.3s, color 0.3s;
  border-radius: 8px;

  &:hover {
    @apply bg-woot-50;
  }
}

.tab-button.active {
  @apply bg-woot-500 text-white;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

#kanban-tab {
  overflow: hidden;
}

.search-and-switch {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 8px;
}

.search-container {
  position: relative;
  
  .search-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: $color-light-gray;
    cursor: pointer;
  }
}

#search-input {
  position: absolute;
  padding: $space-small $space-jumbo $space-small $space-normal;
  border: 1px solid $color-border;
  border-radius: $space-larger;
  font-size: $font-size-small;
  width: 250px;
  height: 40px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  opacity: 0;
  right: 1px;
  top: 50%;
  transform: translateY(-50%);
  visibility: hidden;

  &.show-search {
    opacity: 1;
    visibility: visible;
    @apply border-woot-500;
  }

  &:focus {
    outline: none;
    @apply border-woot-500;
  }
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  content: "";
  position: absolute;
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  @apply border-woot-500;
}

input:checked + .slider {
  background-color: #ff9e6e;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.switch-label {
  white-space: nowrap;
}

.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.search-icon,
.slider-icon {
  width: 20px;
  height: 20px;
}

/* Estilo para o ícone do switch de resposta rápida */
.search-and-switch .slider-icon {
  position: absolute;
  top: 50%;
  left: 28%;
  transform: translate(-50%, -50%);
  transition: .4s;
  z-index: 1;
  @apply text-woot-500;
  width: 12px;
  height: 12px;
}

.search-and-switch input:checked + .slider .slider-icon {
  transform: translate(calc(-50% + 24px), -50%);
  @apply text-woot-500;
}

/* Estilo para o ícone do switch de confirmação automática */
.settings-container .slider-icon {
  position: absolute;
  top: 50%;
  left: 7px;
  transform: translateY(-50%);
  transition: .4s;
  z-index: 1;
  @apply text-woot-500;
  width: 12px;
  height: 12px;
}

.settings-container input:checked + .slider .slider-icon {
  transform: translateX(24px) translateY(-50%);
  @apply text-woot-500;
}

.settings-container {
  width: 100%;
  padding: 24px;
  background-color: #ffffff;
  // Removida a sombra
}

.settings-tabs {
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.settings-tab-button {
  padding: 12px 24px;
  border: none;
  background-color: transparent;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &.active {
    @apply text-woot-500 border-b-2 border-woot-500;
    border-radius: 0;
  }

  &:hover:not(.active) {
    @apply text-woot-500;
  }
}

.settings-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  overflow-y: auto;
  scrollbar-width: none; /* Para Firefox */
  -ms-overflow-style: none;  /* Para Internet Explorer e Edge */
  &::-webkit-scrollbar {
    display: none; /* Para Chrome, Safari e Opera */
  }
}

.settings-title {
  font-size: 24px;
  color: #1F2937;
  margin-bottom: 24px;
  font-weight: 600;
  text-align: left;
}

.settings-section {
  margin-bottom: 32px;
  text-align: left;
}

.section-title {
  font-size: 18px;
  color: #374151;
  margin-bottom: 16px;
  font-weight: 500;
  text-align: left;
}

.estimate-settings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  align-items: start;
}

.estimate-input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  label {
    margin-bottom: 8px;
    font-size: 14px;
    color: #4B5563;
  }
  
  input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #D1D5DB;
    border-radius: 4px;
    font-size: 14px;
    color: #1F2937;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      @apply border-woot-500;
    }
  }
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #D1D5DB;
  transition: .4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
}

input:checked + .slider {
  @apply bg-woot-500;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.switch-label {
  font-size: 14px;
  color: #4B5563;
}

.theme-selector {
  display: flex;
  gap: 24px;
}

.theme-option {
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  
  &.active {
    transform: scale(1.05);
  }
}

.theme-preview {
  width: 200px;
  height: 120px;
  border-radius: $space-smaller;
  margin-bottom: $space-small;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: $font-size-small;
  transition: all 0.3s ease;
  border: 1px solid var(--s-200);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &.color-theme {
    color: white;
  }

  &.light-theme {
    background-color: #F3F4F6;
    color: #1F2937;
  }

  .theme-title {
    font-weight: $font-weight-bold;
    margin-bottom: $space-micro;
  }

  .theme-description {
    font-size: $font-size-mini;
    opacity: 0.8;
  }

  .color-palette {
    display: flex;
    width: 100%;
    height: 20px;
    margin-top: $space-smaller;
    border-radius: $space-micro;
    overflow: hidden;
  }

  .color-shade {
    flex: 1;
  }
}

.theme-label {
  font-size: $font-size-small;
  color: var(--s-700);
  font-weight: $font-weight-medium;
  margin-top: $space-smaller;
  display: block;
}

.custom-color-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: $space-smaller;
  padding: $space-micro $space-small;
  background-color: white;
  border: 1px solid var(--s-200);
  border-radius: $space-smaller;
  font-size: $font-size-mini;
  color: var(--s-700);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--s-100);
  }

  .color-preview {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-right: $space-micro;
    border: 1px solid var(--s-200);
  }
}

.color-picker-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.task-count {
  margin-left: 8px;
  background-color: v-bind(taskCountBackgroundColor);
  color: var(--s-900); // Ajuste a cor do texto para garantir contraste
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 600;
}
</style>