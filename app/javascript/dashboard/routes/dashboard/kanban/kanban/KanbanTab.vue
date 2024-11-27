<template>
  <div id="kanban-tab" class="tab-content active" :class="{ 'light-theme': currentTheme === 'light' }">
    <div class="kanban-board" :class="{ 'expanded-view': expandedColumn }">
      <div
        v-for="column in columns"
        :key="column.id"
        class="kanban-column"
        :id="column.id"
        :class="{ 'expanded': expandedColumn === column.id, 'hidden': expandedColumn && expandedColumn !== column.id }"
        :style="getColumnStyle(column.id)"
      >
        <div class="kanban-column-content">
          <div class="column-header" :style="getHeaderStyle(column.id)">
            <svg class="column-icon" viewBox="0 0 24 24" width="18" height="18">
              <path :d="getColumnIcon(column.id)" :fill="getIconColor(column.id)" />
            </svg>
            <h2 :style="{ color: getIconColor(column.id) }">{{ column.title }}</h2>
            <div class="count-badges">
              <span class="count-badge">{{ column.items.length }}</span>
              <span v-if="getPriorityCount(column.items) > 0" class="priority-badge">
                <svg class="star-icon" viewBox="0 0 24 24" width="12" height="12">
                  <path :d="dashboardIcons['star-fill']" fill="currentColor" />
                </svg>
                {{ getPriorityCount(column.items) }}
              </span>
            </div>
            <button @click="openBulkActionsPopup(column)" class="bulk-actions-button" :style="{ color: getIconColor(column.id), borderColor: getIconColor(column.id) }">
              <svg class="icon" viewBox="0 0 24 24" width="16" height="16">
                <path :d="dashboardIcons['thunder']" :fill="getIconColor(column.id)" />
              </svg>
              <span v-if="expandedColumn === column.id" class="button-text">Ações em massa</span>
            </button>
            <div class="column-actions">
              <button @click="openFilterPopup(column)" class="filter-button" :title="'Filtrar ' + column.title">
                <svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="none" :stroke="getIconColor(column.id)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </button>
              <button @click="toggleColumnExpand(column.id)" class="expand-button" :title="expandedColumn === column.id ? 'Fechar' : 'Expandir'">
                <svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="none" :stroke="getIconColor(column.id)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path :d="expandedColumn === column.id ? dashboardIcons['close-outline'] : 'M3 7V5a2 2 0 0 1 2-2h2 M17 3h2a2 2 0 0 1 2 2v2 M21 17v2a2 2 0 0 1-2 2h-2 M7 21H5a2 2 0 0 1-2-2v-2 M7 8h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z'" />
                </svg>
              </button>
            </div>
          </div>
          <div v-if="column.id === 'pendente'" class="fixed-estimates" :class="{ 'expanded': expandedColumn === column.id }">
            <div class="estimates-content">
              <div class="estimate-box">
                <div class="estimate-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path :d="dashboardIcons['store-icon']" fill="currentColor" />
                  </svg>
                </div>
                <div class="estimate-content">
                  <span class="estimate-label">Balcão</span>
                  <span class="estimate-value">{{ estimativas.balcao }} min</span>
                </div>
              </div>
              <div class="estimate-box">
                <div class="estimate-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path :d="dashboardIcons['delivery-icon']" fill="currentColor" />
                  </svg>
                </div>
                <div class="estimate-content">
                  <span class="estimate-label">Delivery</span>
                  <span class="estimate-value">{{ estimativas.delivery }} min</span>
                </div>
              </div>
              <div v-if="expandedColumn === column.id" class="estimate-box">
                <div class="estimate-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path :d="dashboardIcons['clock-outline']" fill="currentColor" />
                  </svg>
                </div>
                <div class="estimate-content">
                  <span class="estimate-label">Limite aceitável de atraso</span>
                  <span class="estimate-value">{{ estimativas.limiteAtraso }} min</span>
                </div>
              </div>
              <div v-if="expandedColumn === column.id" class="estimate-box">
                <div class="estimate-icon">
                  <svg viewBox="0 0 32 32" width="20" height="20">
                    <path d="M12.05,24.192a1,1,0,0,1-1.414-1.414l2.829-2.829a1,1,0,0,1,1.414,1.414Zm0-7.071a1,1,0,0,0-1.414,0L7.808,19.95a1,1,0,1,0,1.414,1.414l2.828-2.828A1,1,0,0,0,12.05,17.122ZM10.809,28.607,3.392,21.191A1.672,1.672,0,0,1,3.541,18.7L9.234,14.22a3.341,3.341,0,0,1,4.421.263l.16.16L22.681,5.17a2.915,2.915,0,0,1,2.1-.929A3,3,0,0,1,26.9,5.1a2.934,2.934,0,0,1-.07,4.218l-9.473,8.865.159.159a3.339,3.339,0,0,1,.264,4.423L13.3,28.459a1.677,1.677,0,0,1-1.217.635l-.1,0A1.669,1.669,0,0,1,10.809,28.607Zm4.422-12.548.711.711,9.521-8.911a.935.935,0,0,0,.022-1.344.875.875,0,0,0-.677-.273.931.931,0,0,0-.668.3ZM5.068,20.04l6.893,6.891,4.246-5.4a1.339,1.339,0,0,0-.105-1.773l-.89-.889h0l-2.079-2.079v0l-.889-.889a1.337,1.337,0,0,0-1.771-.105Z" fill="currentColor" />
                  </svg>
                </div>
                <div class="estimate-content">
                  <span class="estimate-label">Capacidade máxima</span>
                  <span class="estimate-value">{{ estimativas.capacidadeMaxima }} pedidos</span>
                </div>
              </div>
            </div>
            <div class="estimate-actions">
              <button @click="editarEstimativas" class="edit-estimates-button" :title="expandedColumn === column.id ? '' : 'Editar estimativas'">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path :d="dashboardIcons['edit-outline']" fill="currentColor" />
                </svg>
                <span v-if="expandedColumn === column.id" class="button-text">Editar estimativas</span>
              </button>
              <div class="switch-container" :title="expandedColumn === column.id ? '' : 'Confirmação automática'">
                <span v-if="expandedColumn === column.id" class="switch-label">Confirmação automática</span>
                <label class="switch">
                  <input
                    type="checkbox"
                    :checked="confirmacaoAutomatica"
                    @change="toggleConfirmacaoAutomatica"
                  >
                  <span class="slider round">
                    <svg class="slider-icon" viewBox="0 0 24 24" width="16" height="16">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                    </svg>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div class="kanban-items" :id="`${column.id}-items`" :class="{ 'grid-view': expandedColumn === column.id }">
          <transition-group name="kanban-item" tag="div" :class="{ 'grid-container': expandedColumn === column.id }">
            <div
              v-for="item in column.items"
              :key="item.id"
              class="kanban-item"
              :class="{ expanded: !item.collapsed, priority: item.priority, 'slide-in': item.isMoving }"
              :data-id="item.id"
              :data-labels="item.labels ? item.labels.join(',') : ''"
              draggable="true"
              @dragstart="dragStart($event, item)"
                @dragend="dragEnd"
              >
                <div 
                  class="item-header" 
                  :class="{ priority: item.priority, 'no-border': item.collapsed }"
                  @click="toggleItemCollapse(item)"
                >
                  <div class="item-id">#{{ item.id }}</div>
                  <div class="item-header-right">
                    <span class="item-time">
                      <svg class="clock-icon" viewBox="0 0 24 24" width="12" height="12">
                        <path :d="dashboardIcons['clock-outline']" fill="currentColor" />
                      </svg>
                      {{ getElapsedTime(item) }}
                    </span>
                    <div class="header-actions">
                      <button class="print-button" @click.stop="printOrder(item)">
                        <svg class="print-icon" viewBox="0 0 24 24" width="16" height="16">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V11C20.6569 11 22 12.3431 22 14V18C22 19.6569 20.6569 21 19 21H5C3.34314 21 2 19.6569 2 18V14C2 12.3431 3.34315 11 5 11V5ZM5 13C4.44772 13 4 13.4477 4 14V18C4 18.5523 4.44772 19 5 19H19C19.5523 19 20 18.5523 20 18V14C20 13.4477 19.5523 13 19 13V15C19 15.5523 18.5523 16 18 16H6C5.44772 16 5 15.5523 5 15V13ZM7 9V12V14H17V12V9H7ZM9 9C9 8.44772 9.44772 8 10 8H14C14.5523 8 15 8.44772 15 9C15 9.55228 14.5523 10 14 10H10C9.44772 10 9 9.55228 9 9ZM9 12C9 11.4477 9.44772 11 10 11H14C14.5523 11 15 11.4477 15 12C15 12.5523 14.5523 13 14 13H10C9.44772 13 9 12.5523 9 12Z" fill="currentColor"/>
                        </svg>
                      </button>
                      <button class="chat-button" @click.stop="openChat(item)">
                        <svg class="chat-icon" viewBox="0 0 24 24" width="16" height="16">
                          <path :d="dashboardIcons['chat-outline']" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div v-show="!item.collapsed" class="item-body">
                  <div class="item-content">
                    <div class="item-details">
                      <div class="customer-info">
                        <span>{{ item.sender.name }}</span>
                      </div>
                      <div class="order-info">
                        <span>Total: R$ {{ item.custom_attributes.total_do_pedido || '0,00' }}</span>
                        <span class="payment-badge" :class="{ 'not-informed': !item.custom_attributes.metodo_de_pagamento }">
                          {{ item.custom_attributes.metodo_de_pagamento || 'Pagamento não informado' }}
                        </span>
                      </div>
                      <div class="address-info">
                        <span>{{ item.custom_attributes.endereo_de_entrega || 'Endereço não informado' }}</span>
                        <span class="distance-badge">
                          {{ item.custom_attributes.distancia_km ? `${item.custom_attributes.distancia_km} km` : '0 km' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="item-footer">
                    <button class="star-button" @click.stop="togglePriority(item)">
                      <svg class="icon" viewBox="0 0 24 24" width="16" height="16">
                        <path :d="item.priority ? dashboardIcons['star-fill'] : dashboardIcons['star-outline']" :fill="item.priority ? '#FF5500' : 'currentColor'" />
                      </svg>
                    </button>
                    <button class="cancel-button" @click.stop="cancelarPedido(item)" title="Cancelar pedido">
                      <svg class="icon" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill="currentColor" />
                      </svg>
                    </button>
                    <button 
                      @click.stop="avancarPedido(item)" 
                      class="action-button"
                      :class="{ 'confirmar-pedido': getColumnIdForItem(item) === 'pendente', 'entrega-concluida': isLastColumn(item) }"
                    >
                      {{ getButtonText(item) }}
                      <svg class="icon" viewBox="0 0 24 24" width="16" height="16">
                        <path :d="getButtonIcon(item)" :stroke="getColumnIdForItem(item) === 'pendente' || isLastColumn(item) ? 'none' : 'currentColor'" :fill="getColumnIdForItem(item) === 'pendente' || isLastColumn(item) ? 'currentColor' : 'none'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Substitua o popup de ações em massa existente por este novo design -->
    <div v-if="showBulkActionsPopup" class="bulk-actions-popup-overlay" @click="closeBulkActionsPopup">
      <div class="bulk-actions-popup" @click.stop>
        <div class="popup-header">
          <div class="header-content">
            <h3>Ações em Massa</h3>
            <span 
              class="stage-tag" 
              :style="{ 
                backgroundColor: getColumnColor(currentColumn.id) + '20', 
                color: getColumnColor(currentColumn.id),
                borderColor: getColumnColor(currentColumn.id)
              }"
            >
              {{ currentColumn.title }}
            </span>
          </div>
          <button @click="closeBulkActionsPopup" class="close-popup">
            <svg class="icon" viewBox="0 0 24 24" width="24" height="24">
              <path :d="dashboardIcons['close-outline']" fill="currentColor" />
            </svg>
          </button>
        </div>
        <div class="bulk-actions-list">
          <button 
            v-for="action in bulkActions" 
            :key="action.id" 
            @click="action.handler" 
            class="bulk-action-item"
          >
            <div class="action-icon">
              <svg class="icon" viewBox="0 0 24 24" width="24" height="24">
                <path :d="dashboardIcons[action.icon]" fill="currentColor" />
              </svg>
            </div>
            <span class="action-label">{{ action.label }}</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" width="24" height="24">
              <path :d="dashboardIcons['chevron-right-outline']" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <MessageTemplatePopup
      v-if="showMessageTemplatePopup"
      :stageColor="currentStageColor"
      :stageIcons="stageIcons"
      :currentStage="currentStage"
      :isBulkAction="isBulkAction"
      :orders="currentColumn ? currentColumn.items : []"
      :itemTimers="itemTimers"
      @close="closeMessageTemplatePopup"
      @select="sendSelectedTemplate"
    />
    
    <!-- Popup de Seleção de Pedidos -->
    <div v-if="showSelectOrdersPopup" class="select-orders-popup-overlay">
      <SelectOrdersPopup
        :orders="currentColumn.items"
        :itemTimers="itemTimers"
        @advance="advanceSelectedOrders"
        @close="closeSelectOrdersPopup"
      />
    </div>
  </div>
</template>

<script>
import MessageTemplatePopup from './MessageTemplatePopup.vue';
import dashboardIcons from 'shared/components/FluentIcon/dashboard-icons.json';
import { mapGetters } from 'vuex';
import conversationAPI from '../../../../api/inbox/conversation';
import SelectOrdersPopup from './SelectOrdersPopup.vue';
import messageAPI from '../../../../api/inbox/message';

export default {
  name: 'KanbanTab',
  components: {
    MessageTemplatePopup,
    SelectOrdersPopup,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    estimativas: {
      type: Object,
      required: true,
    },
    currentTheme: {
      type: String,
      required: true,
    },
    itemTimers: {
      type: Object,
      required: true,
    },
    confirmacaoAutomatica: {
      type: Boolean,
      required: true,
    },
    funnel: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
      labels: 'labels/getLabels',
    }),
    bulkActions() {
      const commonActions = [
        { id: 'advance', label: 'Avançar pedidos', icon: 'chevron-right-outline', handler: this.avancarTodosPedidos },
        { id: 'message', label: 'Mensagem rápida', icon: 'chat-outline', handler: this.openBulkMessageTemplate }
      ];
      
      const columnSpecificActions = {
        preparacao: [
          { id: 'notify-missing', label: 'Notificar falta de itens', icon: 'close-outline', handler: this.notificarFaltaItens }
        ],
        pronto: [
          { id: 'notify-delay', label: 'Notificar atraso', icon: 'clock-outline', handler: this.notificarAtraso }
        ],
        pendente: [
          { id: 'confirm-all', label: 'Confirmar todos', icon: 'checkmark-outline', handler: this.confirmAll },
          { id: 'cancel-all', label: 'Cancelar todos', icon: 'close-outline', handler: this.cancelAll }
        ]
      };
      
      return [...commonActions, ...(columnSpecificActions[this.currentColumn.id] || [])];
    }
  },
  data() {
    return {
      dashboardIcons: {
        'thunder': dashboardIcons['thunder'],
        'delivery-icon': dashboardIcons['car-outline'],
        'store-icon': dashboardIcons['store-outline'],
        'edit-outline': dashboardIcons['edit-outline'],
        'clock-outline': dashboardIcons['clock-outline'],
        'chat-outline': dashboardIcons['chat-outline'],
        'star-fill': dashboardIcons['star-fill'],
        'star-outline': dashboardIcons['star-outline'],
        'checkmark-outline': dashboardIcons['checkmark-outline'],
        'chevron-right-outline': dashboardIcons['chevron-right-outline'],
        'close-outline': 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z',
        'list-outline': 'M3 17h18a1 1 0 0 1 .117 1.993L21 19H3a1 1 0 0 1-.117-1.993L3 17h18H3Zm0-6l18-.002a1 1 0 0 1 .117 1.993l-.117.007L3 13a1 1 0 0 1-.117-1.993L3 11l18-.002L3 11Zm0-6h18a1 1 0 0 1 .117 1.993L21 7H3a1 1 0 0 1-.117-1.993L3 5h18H3Z',
        'task-outline': 'M10 2a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm12 0a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm-1 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-12 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
      },
      stageIcons: {
        'pendente': dashboardIcons['clock-outline'],
        'preparacao': dashboardIcons['wrench-outline'],
        'pronto': dashboardIcons['checkmark-circle-outline'],
        'a-caminho': dashboardIcons['car-outline'],
      },
      showMessageTemplatePopup: false,
      currentItem: null,
      currentStageColor: '',
      currentStage: '',
      bulkMessageColumn: null,
      showBulkActionsPopup: false,
      currentColumn: null,
      showSelectOrdersPopup: false,
      isBulkAction: false,
      expandedColumn: null,
    };
  },
  methods: {
    initializeTimers() {
      // Não faça nada aqui, pois os timers serão gerenciados pelo componente pai
    },

    getColumnIcon(columnId) {
      return this.stageIcons[columnId] || '';
    },
    getColumnColor(columnId) {
      const label = this.labels.find(label => label.title.toLowerCase() === columnId);
      return label ? label.color : '#000000'; // Cor padrão se não encontrar
    },
    getPriorityCount(items) {
      return items.filter(item => item.priority).length;
    },
    editarEstimativas() {
      this.$emit('editar-estimativas');
    },
    getElapsedTime(item) {
      const timer = this.itemTimers[item.id];
      return timer ? this.formatDuration(timer.elapsedTime) : '00:00';
    },
    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    dragStart(event, item) {
      event.dataTransfer.setData('text/plain', JSON.stringify(item));
      this.$emit('drag-start', event, item);
    },
    dragEnd(event) {
      this.$emit('drag-end', event);
    },
    toggleItemCollapse(item) {
      if (!item.hasOwnProperty('collapsed')) {
        this.$set(item, 'collapsed', true);
      } else {
        item.collapsed = !item.collapsed;
      }
    },
    togglePriority(item) {
      this.$emit('toggle-priority', item);
      const priorityStatus = item.priority ? 'marcado como prioritário' : 'removido da prioridade';
      this.$emit('show-toast', {
        message: `Pedido #${item.id} ${priorityStatus}`,
        type: 'success'
      });
    },
    isLastColumn(item) {
      const columnIndex = this.columns.findIndex(column => column.items.includes(item));
      return columnIndex === this.columns.length - 1;
    },
    async avancarPedido(item) {
      const currentColumnIndex = this.columns.findIndex(column => column.items.includes(item));
      if (currentColumnIndex < this.columns.length - 1) {
        const nextColumn = this.columns[currentColumnIndex + 1];
        item.isMoving = true;
        await this.moveItemToNextColumn(item, nextColumn);
        
        // Emite o evento para o componente pai lidar com o toast
        this.$emit('item-moved', {
          item,
          fromStage: this.columns[currentColumnIndex].id,
          toStage: nextColumn.id,
          funnel: this.funnel
        });

        // Remove a classe de animação após um curto período
        setTimeout(() => {
          item.isMoving = false;
        }, 500);
      } else {
        await this.marcarComoEntregue(item);
        
        // Emite o evento para o componente pai lidar com o toast
        this.$emit('item-delivered', item);
      }
    },

    async moveItemToNextColumn(item, nextColumn) {
      try {
        const currentColumn = this.columns.find(column => column.items.includes(item));
        const itemIndex = currentColumn.items.findIndex(i => i.id === item.id);
        
        if (itemIndex !== -1) {
          currentColumn.items.splice(itemIndex, 1);
          nextColumn.items.push(item);

          const newLabel = this.getNewLabelFromStage(nextColumn.id);
          await this.updateItemLabels(item.id, [newLabel]);
          
          item.labels = [newLabel];

          // Reinicia o timer quando o item é movido para uma nova coluna
          this.$emit('start-new-timer', { itemId: item.id, columnId: nextColumn.id, funnel: this.funnel });

          if (this.quickReplyEnabled) {
            await this.sendQuickMessage(item.id);
          }
        }
      } catch (error) {
        console.error(`Erro ao atualizar o pedido ${item.id}:`, error);
        this.$emit('show-toast', {
          message: `Erro ao atualizar o pedido ${item.id}`,
          type: 'error'
        });
      }
    },

    async marcarComoEntregue(item) {
      try {
        await conversationAPI.updateStatus({ conversationId: item.id, status: 'resolved' });
        item.status = 'resolved';
      } catch (error) {
        console.error('Erro ao marcar pedido como entregue:', error);
        this.$emit('show-toast', {
          message: 'Erro ao marcar pedido como entregue',
          type: 'error'
        });
      }
    },

    
    async updateItemLabels(conversationId, newLabels) {
      try {
        await conversationAPI.updateLabels(conversationId, newLabels);
      } catch (error) {
        console.error('Erro ao atualizar etapas:', error);
        this.$emit('show-toast', {
          message: 'Erro ao atualizar etapas',
          type: 'error'
        });
        throw error;
      }
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

    openBulkActionsPopup(column) {
      this.currentColumn = column;
      this.showBulkActionsPopup = true;
    },
    
    closeBulkActionsPopup() {
      this.showBulkActionsPopup = false;
    },
    
    avancarTodosPedidos() {
      this.showBulkActionsPopup = false;
      this.showSelectOrdersPopup = true;
    },
    
    closeSelectOrdersPopup() {
      this.showSelectOrdersPopup = false;
    },
    
    async advanceSelectedOrders(selectedOrderIds) {
      for (const orderId of selectedOrderIds) {
        const item = this.currentColumn.items.find(i => i.id === orderId);
        if (item) {
          await this.avancarPedido(item);
          // Aguarda um curto intervalo entre cada avanço para evitar sobrecarga
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      this.closeSelectOrdersPopup();
      this.$emit('show-toast', {
        message: `${selectedOrderIds.length} pedidos avançados com sucesso!`,
        type: 'success'
      });
    },

    openChat(item) {
      this.currentItem = item;
      this.currentStage = this.getColumnIdForItem(item);
      this.currentStageColor = this.getColumnColor(this.currentStage);
      this.isBulkAction = false;
      this.currentColumn = this.columns.find(col => col.id === this.currentStage);
      this.showMessageTemplatePopup = true;
    },
    getColumnIdForItem(item) {
      return this.columns.find(column => column.items.includes(item))?.id || 'pendente';
    },
    openBulkMessageTemplate() {
      this.currentStage = this.currentColumn.id;
      this.currentStageColor = this.getColumnColor(this.currentColumn.id);
      this.isBulkAction = true;
      this.showMessageTemplatePopup = true;
      this.closeBulkActionsPopup();
    },
    closeMessageTemplatePopup() {
      this.showMessageTemplatePopup = false;
      this.currentItem = null;
      this.isBulkAction = false;
      this.currentColumn = null;
    },
    sendSelectedTemplate({ template, selectedOrderIds }) {
      if (this.isBulkAction && selectedOrderIds && selectedOrderIds.length > 0) {
        selectedOrderIds.forEach(orderId => {
          const item = this.currentColumn.items.find(i => i.id === orderId);
          if (item) {
            this.$emit('send-message', item, template.content);
          }
        });
        this.$emit('show-toast', {
          message: `Mensagem rápida enviada para ${selectedOrderIds.length} pedidos`,
          type: 'success'
        });
      } else if (!this.isBulkAction && this.currentItem) {
        this.$emit('send-message', this.currentItem, template.content);
        this.$emit('show-toast', {
          message: `Mensagem rápida enviada para o pedido #${this.currentItem.id}`,
          type: 'success'
        });
      }
      this.closeMessageTemplatePopup();
    },
    handleDrop(event, targetColumn) {
      const itemData = event.dataTransfer.getData('text/plain');
      const item = JSON.parse(itemData);
      const sourceColumn = this.columns.find(column => column.items.includes(item));

      if (sourceColumn) {
        const itemIndex = sourceColumn.items.indexOf(item);
        if (itemIndex !== -1) {
          sourceColumn.items.splice(itemIndex, 1);
          targetColumn.items.push(item);
          this.updateItemLabels(item.id, [this.getNewLabelFromStage(targetColumn.id)]);
          this.$emit('start-new-timer', { itemId: item.id, columnId: targetColumn.id, funnel: this.funnel });
        }
      }
    },
    getButtonText(item) {
      const columnId = this.getColumnIdForItem(item);
      if (columnId === 'pendente') {
        return 'Confirmar pedido';
      } else if (this.isLastColumn(item)) {
        return 'Entrega concluída';
      } else {
        return 'Avançar pedido';
      }
    },
    getButtonIcon(item) {
      const columnId = this.getColumnIdForItem(item);
      if (columnId === 'pendente' || this.isLastColumn(item)) {
        return this.dashboardIcons['checkmark-outline'];
      } else {
        return 'M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8 M3 3v5h5 M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16 M16 16h5v5v5h-5v-5h-5v-5h5z';
      }
    },
    
    notificarFaltaItens() {
      // Implementar lógica para notificar falta de itens
      this.$emit('show-toast', {
        message: `Notificação de falta de itens enviada para a etapa ${this.currentColumn.title}`,
        type: 'success'
      });
      this.closeBulkActionsPopup();
    },
    
    notificarAtraso() {
      // Implementar lógica para notificar atraso
      this.$emit('show-toast', {
        message: `Notificação de atraso enviada para os pedidos da etapa ${this.currentColumn.title}`,
        type: 'success'
      });
      this.closeBulkActionsPopup();
    },
    
    async sendQuickMessage(conversationId, message) {
      try {
        await messageAPI.create({
          conversationId,
          message,
          private: false,
          contentAttributes: {},
        });
        
        this.updateConversationWithNewMessage(conversationId, message);
        return true;
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        throw error;
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

    toggleConfirmacaoAutomatica() {
      this.confirmacaoAutomatica = !this.confirmacaoAutomatica;
      localStorage.setItem('confirmacaoAutomatica', JSON.stringify(this.confirmacaoAutomatica));
      this.$emit('toggle-confirmacao-automatica', this.confirmacaoAutomatica);
    },
    cancelarPedido(item) {
      // Implemente a lógica de cancelamento do pedido aqui
      console.log(`Cancelar pedido ${item.id}`);
      // Você pode emitir um evento para o componente pai lidar com o cancelamento
      this.$emit('cancelar-pedido', item);
    },
    toggleColumnExpand(columnId) {
      if (this.expandedColumn === columnId) {
        this.expandedColumn = null;
      } else {
        this.expandedColumn = columnId;
      }
    },
    openFilterPopup(column) {
      // Implemente a lógica para abrir o popup de filtro aqui
      console.log(`Abrir filtro para a coluna ${column.title}`);
    },
    printOrder(item) {
      // Implemente a lógica de impressão aqui
      console.log(`Imprimir pedido #${item.id}`);
    },
    getDarkerColor(columnId) {
      const color = this.getColumnColor(columnId);
      return this.darkenColor(color, 0.4); // 40% mais escuro
    },
    darkenColor(color, amount) {
      return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.max(0, Math.min(255, parseInt(color, 16) - amount * 255)).toString(16)).substr(-2));
    },
    getColumnStyle(columnId) {
      if (this.currentTheme === 'color') {
        return { backgroundColor: this.getColumnColor(columnId) + '40' };
      } else {
        return { 
          backgroundColor: this.getLighterColor(this.getColumnColor(columnId), 0.9),
          border: `1px solid ${this.getLighterColor(this.getColumnColor(columnId), 0.7)}`
        };
      }
    },
    getHeaderStyle(columnId) {
      if (this.currentTheme === 'color') {
        return { backgroundColor: this.getColumnColor(columnId) + 'B3' };
      } else {
        return { backgroundColor: this.getLighterColor(this.getColumnColor(columnId), 0.8) };
      }
    },
    getIconColor(columnId) {
      if (this.currentTheme === 'color') {
        return this.getDarkerColor(columnId);
      } else {
        return this.getColumnColor(columnId);
      }
    },
    getLighterColor(color, amount) {
      return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount * 255)).toString(16)).substr(-2));
    },
  },
  mounted() {
    this.$store.dispatch('labels/get');
    console.log('KanbanTab mounted for funnel:', this.funnel);
    console.log('Columns:', this.columns);
    this.columns.forEach(column => {
      console.log(`Coluna ${column.id}:`, column.items);
    });
  },
  updated() {
    console.log('KanbanTab updated for funnel:', this.funnel);
    console.log('Columns:', this.columns);
    this.columns.forEach(column => {
      console.log(`Coluna ${column.id}:`, column.items);
    });
  },
};
</script>

<style lang="scss" scoped>
@import '~dashboard/assets/scss/variables';

.kanban-board {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 16px;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 180px);
  transition: all 0.3s ease;

  &.expanded-view {
    .kanban-column {
      flex: 0 0 100%;
      max-width: 100%;

      &.hidden {
        display: none;
      }
    }
  }
}

.kanban-column {
  flex: 1;
  min-width: 0;
  max-width: calc(25% - 12px);
  border-radius: 12px;
  box-shadow: none; // Remove a sombra das etapas
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow: hidden;
}

.kanban-column-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.column-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 0px;
  padding: 10px 16px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  gap: 6px;
}

.column-icon {
  margin-right: 4px;
  font-size: 1.1rem;
}

.kanban-column h2 {
  margin: 0;
  font-weight: $font-weight-bold;
  font-size: $font-size-small;
  flex-grow: 1;
}

.count-badges {
  display: flex;
  gap: 4px;
}

.count-badge {
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 0.8rem;
  font-weight: normal;
}

.priority-badge {
  color: #ffffff;
  background-color: #f97316;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 0.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 2px;

  .star-icon {
    width: 12px;
    height: 12px;
  }
}

.kanban-items {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }

  &.grid-view {
    padding: 16px;
  }
}

#pendente { background-color: #fbbf24; }
#pendente h2 { color: #78350f; }
#preparacao { background-color: #fb923c; }
#preparacao h2 { color: #7c2d12; }
#pronto { background-color: #4ade80; }
#pronto h2 { color: #14532d; }
#a-caminho { background-color: #60a5fa; }
#a-caminho h2 { color: #1e3a8a; }

.kanban-item {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding-bottom: 12px;
  transition: box-shadow 0.3s ease; // Mantém apenas a transição para o box-shadow

  &.priority {
    border: 1px solid #FF5500;
  }

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &.grid-item {
    margin-bottom: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f3f4f6;
  color: #4b5563;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
  border-bottom: 1px dashed #d1d5db; // Adicionada borda tracejada

  &.priority {
    background-color: #FF5500;
    color: white;
  }

  &:hover {
    background-color: #e5e7eb; // Tom usado no hover (mantido o mesmo)
  }

  .item-time, .chat-button {
    color: inherit;
  }

  .clock-icon, .chat-icon {
    fill: currentColor;
  }
}

.item-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-time {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
  min-width: 60px; // Adicionado para evitar mudanças de largura

  .clock-icon {
    width: 14px;
    height: 14px;
  }
}

.item-content {
  padding: 12px;
}

.item-details {
  font-size: 14px;
  color: #4b5563;

  .customer-info,
  .order-info,
  .address-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .customer-info {
    font-weight: 600; // Adiciona semi-bold ao nome do cliente
  }

  .payment-badge,
  .distance-badge {
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 12px;
    font-weight: 500;
  }

  .payment-badge {
    background-color: #a7f3d0; // Verde mais chamativo
    color: #047857; // Verde escuro para contraste
    border: 1px solid #6ee7b7; // Borda verde um pouco mais escura

    &.not-informed {
      background-color: #e5e7eb; // Cinza mais chamativo
      color: #4b5563; // Cinza escuro para contraste
      border: 1px solid #d1d5db; // Borda cinza um pouco mais escura
    }
  }

  .distance-badge {
    background-color: #bfdbfe; // Azul mais chamativo
    color: #1e40af; // Azul escuro para contraste
    border: 1px solid #93c5fd; // Borda azul um pouco mais escura
  }
}

.item-footer {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 12px;
}

.star-button,
.cancel-button {
  background: none;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #F5F5F5;
  }

  .icon {
    transition: fill 0.3s ease;
  }
}

.cancel-button {
  color: #EF4444; // Cor vermelha para o ícone de cancelamento

  &:hover {
    background-color: #FEE2E2; // Fundo vermelho claro no hover
  }
}

.action-button {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  @apply bg-woot-500; // Cor de fundo principal woot
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  height: 36px;

  &:hover {
    @apply bg-woot-600; // Cor de fundo mais escura no hover
  }

  &.confirmar-pedido {
    @apply bg-green-500; // Verde mais claro para o botão de confirmação

    &:hover {
      @apply bg-green-600; // Verde mais escuro no hover
    }
  }

  &.entrega-concluida {
    @apply bg-green-700; // Verde mais escuro para o botão de entrega concluída

    &:hover {
      @apply bg-green-800; // Verde ainda mais escuro no hover
    }
  }

  .icon {
    margin-left: 8px;
    width: 16px;
    height: 16px;
  }

  &.confirmar-pedido .icon,
  &.entrega-concluida .icon {
    fill: currentColor;
    stroke: none;
  }
}

.fixed-estimates {
  display: flex;
  justify-content: space-between;
  align-items: center;
  @apply bg-woot-50; // Fundo mais claro da cor woot
  border-radius: 8px;
  padding: 8px 16px;
  margin: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.estimates-content {
  display: flex;
  gap: 16px;
}

.estimate-box {
  display: flex;
  align-items: center;
}

.estimate-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  @apply bg-woot-500; // Cor de fundo principal woot
  border-radius: 50%;
  margin-right: 8px;

  svg {
    @apply text-white; // Ícone branco para contraste
  }
}

.estimate-content {
  display: flex;
  flex-direction: column;
}

.estimate-label {
  font-size: 12px;
  @apply text-woot-600; // Cor de texto mais escura da paleta woot
}

.estimate-value {
  font-size: 13px;
  font-weight: 600;
  @apply text-woot-800; // Cor de texto ainda mais escura da paleta woot
}

.estimate-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.edit-estimates-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  @apply text-woot-500; // Cor principal woot para o botão
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    @apply bg-woot-100; // Fundo mais claro ao passar o mouse
  }

  svg {
    width: 16px;
    height: 16px;
  }

  .button-text {
    margin-left: 4px;
  }
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.switch-label {
  font-size: 12px;
  @apply text-woot-600; // Cor de texto mais escura da paleta woot
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
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
  @apply bg-woot-200; // Cor de fundo mais clara quando desativado
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  @apply border-woot-500; // Borda com a cor principal woot
}

input:checked + .slider {
  @apply bg-woot-500; // Cor de fundo principal woot quando ativado
}

input:checked + .slider:before {
  transform: translateX(16px);
}

.slider-icon {
  position: absolute;
  top: 50%;
  left: 4px;
  transform: translateY(-50%);
  transition: .4s;
  @apply text-woot-500; // Cor do ícone
}

input:checked + .slider .slider-icon {
  transform: translateY(-50%) translateX(16px);
  @apply text-white; // Ícone branco quando ativado para contraste
}

.chat-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
}

.chat-icon {
  width: 16px;
  height: 16px;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.kanban-items {
  min-height: 50px; /* Garante que a coluna tenha uma altura mínima para permitir soltar itens */
}

.bulk-actions-button {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid; // A cor será definida dinamicamente
  border-radius: 4px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .icon {
    width: 16px;
    height: 16px;
  }

  .button-text {
    margin-left: 4px;
    margin-right: 4px;
    font-size: 12px;
    white-space: nowrap;
  }
}

.bulk-actions-popup-overlay {
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

.bulk-actions-popup {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  width: 320px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    color: #1F2937;
    font-weight: 600;
  }
}

.bulk-actions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bulk-action-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-size: 14px;
  color: #4B5563;
  background-color: #F3F4F6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #E5E7EB;
    color: #1F2937;
  }

  .icon {
    margin-right: 12px;
    color: #6B7280;
  }

  span {
    flex-grow: 1;
    text-align: left;
  }
}

.close-popup {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  .icon {
    width: 24px;
    height: 24px;
  }
}

.light-theme {
  #pendente { 
    background-color: #fff7ed; // Versão bem clara do amarelo
    border: 1px solid #fed7aa; // Borda um pouco mais escura
    .column-header {
      background-color: #fef3c7; // Cabeçalho sutilmente mais escuro
    }
  }
  #preparacao { 
    background-color: #fff7ed; // Versão bem clara do laranja
    border: 1px solid #fed7aa; // Borda um pouco mais escura
    .column-header {
      background-color: #fef3c7; // Cabeçalho sutilmente mais escuro
    }
  }
  #pronto { 
    background-color: #f0fdf4; // Versão bem clara do verde
    border: 1px solid #bbf7d0; // Borda um pouco mais escura
    .column-header {
      background-color: #dcfce7; // Cabeçalho sutilmente mais escuro
    }
  }
  #a-caminho { 
    background-color: #eff6ff; // Versão bem clara do azul
    border: 1px solid #bfdbfe; // Borda um pouco mais escura
    .column-header {
      background-color: #dbeafe; // Cabeçalho sutilmente mais escuro
    }
  }

  // Mantenha as cores do texto e outros estilos inalterados
  #pendente h2 { color: #78350f; }
  #preparacao h2 { color: #7c2d12; }
  #pronto h2 { color: #14532d; }
  #a-caminho h2 { color: #1e3a8a; }

  // Estilos específicos para os cards no tema light
  .kanban-item {
    background-color: #ffffff;
    border: 1px solid #d1d5db; // Borda cinza escuro para os cards no tema light
    
    .item-header {
      background-color: #f3f4f6;

      &.priority {
        background-color: #FF5500;
        color: white;
      }
    }

    &:hover {
      background-color: #f9fafb; // Cor de fundo no hover um pouco mais clara para o tema light
    }
  }
}

// Estilos gerais para os cards (aplicados em ambos os temas)
.kanban-item {
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f3f4f6; // Cor de fundo no hover para ambos os temas
  }

  .item-header {
    padding: 8px 12px;
    font-weight: bold;
  }

  .item-content {
    padding: 12px;
  }
}

.select-orders-popup-overlay,
.bulk-actions-popup-overlay {
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

.expand-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.kanban-column {
  /* ... (estilos existentes) ... */
  
  &.expanded {
    flex: 0 0 100%;
    max-width: 100%;
  }

  &.hidden {
    display: none;
  }
}

.switch-label {
  font-size: 12px;
  color: #64748b;
}

.expanded-info {
  width: 100%;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bulk-actions-button {
  /* ... (estilos existentes não alterados) ... */
  
  .button-text {
    margin-left: 8px;
    font-size: 14px;
  }
}

.kanban-board {
  transition: all 0.3s ease;
}

.kanban-column {
  transition: all 0.3s ease;
  
  &.expanded {
    flex: 0 0 100%;
    max-width: 100%;
  }

  &.hidden {
    opacity: 0;
    transform: scale(0.9);
  }
}

.kanban-item {
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

.bulk-actions-button {
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
}

.fade-enter-active, 
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from, 
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Novas animações (com as remoções solicitadas) */

.column-header {
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.count-badge, .priority-badge {
  transition: none; // Remove a animação de hover
}

.expand-button {
  transition: all 0.2s ease;
}

.item-header {
  transition: background-color 0.3s ease;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &.priority {
    background-color: #FF5500;
    color: white;

    &:hover {
      background-color: darken(#FF5500, 5%); // Escurece levemente a cor laranja no hover
    }
  }
}

.action-button {
  transition: all 0.2s ease;

  &:hover {
    background-color: darken(#FF5500, 10%);
  }
}

.star-button, .cancel-button {
  transition: all 0.2s ease;

  &:hover {
    background-color: #F5F5F5;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.kanban-item {
  animation: slideIn 0.3s ease;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &.expanded {
    .item-body {
      max-height: 1000px;
      opacity: 1;
      padding: 8px 12px;
      margin-top: 8px;
    }
    
    .item-footer {
      padding: 8px 12px;
      margin-top: 8px;
    }
  }

  .item-header {
    cursor: pointer;
    padding: 8px 12px;
    
    &.no-border {
      border-bottom: none;
    }
  }

  .item-body {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: all 0.3s ease;
    padding: 0;
    margin: 0;
  }

  .item-footer {
    padding: 0;
    margin: 0;
    transition: all 0.3s ease;
  }
}

.item-content {
  padding: 8px 12px;
  transition: all 0.3s ease;
}

.star-button,
.cancel-button,
.action-button {
  transition: all 0.3s ease;
}

.star-button {
  /* ... (estilos existentes) ... */
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 85, 0, 0.6);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 85, 0, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 85, 0, 0);
    }
  }

  &.priority {
    animation: pulse 2s infinite;
  }
}

.kanban-item {
  /* ... (estilos existentes) ... */
  transition: all 0.3s ease;

  &.priority {
    border: 1px solid #FF5500;
    animation: pulse 2s infinite;
  }
}

.item-header {
  /* ... (estilos existentes) ... */

  &.priority {
    background-color: #FF5500;
    color: white;

    &:hover {
      background-color: darken(#FF5500, 5%); // Escurece levemente a cor laranja no hover
    }
  }
}

.kanban-item-move {
  transition: transform 0.5s ease;
}

.kanban-item-enter-active,
.kanban-item-leave-active {
  transition: all 0.5s ease;
}

.kanban-item-enter-from,
.kanban-item-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.slide-in {
  animation: slideIn 0.5s ease;
}

.filter-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  color: currentColor;

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 16px;
    height: 16px;
  }
}

.column-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.filter-button,
.expand-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  color: inherit;

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 16px;
    height: 16px;
  }
}

.item-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.print-button,
.chat-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 16px;
    height: 16px;
  }
}

.item-details {
  font-size: 13px;
  
  .customer-info,
  .order-info,
  .address-info {
    margin-bottom: 6px;
  }
}

.item-header {
  transition: background-color 0.3s ease;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &.priority {
    background-color: #FF5500;
    color: white;

    &:hover {
      background-color: darken(#FF5500, 5%); // Escurece levemente a cor laranja no hover
    }
  }
}

.kanban-item:not(.expanded) {
  height: 40px;
  
  .item-body, .item-footer {
    display: none;
  }
}

.bulk-actions-popup-overlay {
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

.bulk-actions-popup {
  background-color: white;
  border-radius: 16px;
  width: 400px;
  max-width: 95%;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: popupFadeIn 0.3s ease;
}

@keyframes popupFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.popup-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.stage-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  border: 1px solid;
  background-color: rgba(255, 85, 0, 0.2);
  color: #1f2937;
}

.close-popup {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  .icon {
    width: 24px;
    height: 24px;
  }
}

.bulk-actions-list {
  padding: 16px;
}

.bulk-action-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f9fafb;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 16px;

  .icon {
    width: 24px;
    height: 24px;
    color: #4b5563;
  }
}

.action-label {
  flex-grow: 1;
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

</style>