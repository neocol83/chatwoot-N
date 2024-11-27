<template>
  <div class="message-template-popup">
    <div class="popup-content">
      <div class="popup-header">
        <h2>{{ showCustomMessage ? 'Escrever mensagem personalizada' : 'Selecionar modelo de mensagem' }}</h2>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>
      
      <div v-if="isBulkAction" class="order-select">
        <h3 class="section-title">Selecione os pedidos:</h3>
        <div class="order-list">
          <div v-for="order in orders" :key="order.id" class="order-item">
            <label :for="order.id" class="order-label">
              <div class="custom-checkbox">
                <input type="checkbox" :id="order.id" v-model="selectedOrderIds" :value="order.id">
                <span class="checkmark"></span>
              </div>
              <div class="order-content">
                <div class="order-header">
                  <span class="order-id-name">
                    <span class="order-id">#{{ order.id }}</span>
                    <span class="customer-name">{{ order.sender.name }}</span>
                  </span>
                  <span class="order-time">{{ getElapsedTime(order) }}</span>
                </div>
                <div class="order-details">
                  <span class="order-total">R$ {{ order.custom_attributes.total_do_pedido || '0,00' }}</span>
                  <span class="payment-method">{{ order.custom_attributes.metodo_de_pagamento || 'Não informado' }}</span>
                </div>
              </div>
            </label>
          </div>
        </div>
        <button @click="selectAllOrders" class="select-all-button">
          {{ allOrdersSelected ? 'Desmarcar Todos' : 'Selecionar Todos' }}
        </button>
      </div>

      <div v-if="!showCustomMessage" class="template-options">
        <div
          v-for="(template, index) in filteredTemplates"
          :key="index"
          class="template-option"
          :class="{ active: selectedTemplate === index }"
          @click="selectTemplate(index)"
        >
          <div class="template-preview">{{ template.content }}</div>
          <div class="template-name">
            <svg class="template-icon" viewBox="0 0 24 24" width="20" height="20">
              <path :d="stageIcons[template.stage]" fill="#FF5500" />
            </svg>
            {{ template.name }}
          </div>
        </div>
      </div>

      <div v-if="showCustomMessage" class="custom-message-input">
        <textarea
          v-model="customMessage"
          placeholder="Digite sua mensagem personalizada aqui..."
          rows="4"
        ></textarea>
      </div>

      <div class="toggle-message-type">
        <a href="#" @click.prevent="toggleMessageType">
          {{ showCustomMessage ? 'Selecionar modelo de mensagem' : 'Escrever mensagem personalizada' }}
        </a>
      </div>

      <div class="popup-footer">
        <button class="cancel-button" @click="$emit('close')">Cancelar</button>
        <button @click="sendTemplate" class="send-button" :disabled="!canSend">
          Enviar mensagem
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageTemplatePopup',
  props: {
    stageColor: {
      type: String,
      required: true
    },
    stageIcons: {
      type: Object,
      required: true
    },
    currentStage: {
      type: String,
      required: true
    },
    isBulkAction: {
      type: Boolean,
      default: false
    },
    orders: {
      type: Array,
      default: () => []
    },
    itemTimers: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedTemplate: null,
      messageTemplates: [],
      customMessage: '',
      selectedOrderIds: [],
      showCustomMessage: false,
    };
  },
  computed: {
    filteredTemplates() {
      return this.messageTemplates.filter(template => template.stage === this.currentStage);
    },
    canSend() {
      return (
        ((this.selectedTemplate !== null && !this.showCustomMessage) || 
         (this.customMessage.trim() !== '' && this.showCustomMessage)) &&
        (!this.isBulkAction || this.selectedOrderIds.length > 0)
      );
    },
    allOrdersSelected() {
      return this.selectedOrderIds.length === this.orders.length;
    }
  },
  mounted() {
    this.loadTemplates();
  },
  methods: {
    loadTemplates() {
      const savedTemplates = localStorage.getItem('messageTemplates');
      this.messageTemplates = savedTemplates ? JSON.parse(savedTemplates) : [];
    },
    selectTemplate(index) {
      this.selectedTemplate = index;
    },
    sendTemplate() {
      const message = this.showCustomMessage
        ? this.customMessage.trim()
        : this.selectedTemplate !== null
        ? this.filteredTemplates[this.selectedTemplate].content
        : '';
      
      if (this.isBulkAction) {
        this.$emit('select', { template: { content: message }, selectedOrderIds: this.selectedOrderIds });
      } else {
        this.$emit('select', { template: { content: message }, selectedOrderIds: null });
      }
      
      this.$emit('close');
    },
    getElapsedTime(order) {
      const timer = this.itemTimers[order.id];
      return timer ? this.formatDuration(timer.elapsedTime) : '00:00';
    },
    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    getTemplateStyle(index) {
      if (this.selectedTemplate === index) {
        return {
          borderColor: this.stageColor,
          backgroundColor: `${this.stageColor}1A` // 1A é 10% de opacidade em hexadecimal
        };
      }
      return { borderColor: '#e5e7eb' };
    },
    selectAllOrders() {
      if (this.allOrdersSelected) {
        this.selectedOrderIds = [];
      } else {
        this.selectedOrderIds = this.orders.map(order => order.id);
      }
    },
    toggleMessageType() {
      this.showCustomMessage = !this.showCustomMessage;
      if (this.showCustomMessage) {
        this.selectedTemplate = null;
      } else {
        this.customMessage = '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.message-template-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;

  h2 {
    margin: 0;
    font-size: 18px;
    color: #1f2937;
  }
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
}

.order-select {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.order-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 8px;
}

.order-item {
  margin-bottom: 8px;
}

.order-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }
}

.custom-checkbox {
  position: relative;
  width: 20px;
  height: 20px;
  margin-right: 12px;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #fff;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  input:checked ~ .checkmark {
    background-color: #FF5500;
    border-color: #FF5500;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  input:checked ~ .checkmark:after {
    display: block;
  }
}

.order-content {
  flex-grow: 1;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.order-id-name {
  display: flex;
  align-items: center;
}

.order-id {
  font-weight: 600;
  font-size: 1rem;
  color: #FF5500;
  margin-right: 8px;
}

.customer-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: #1e293b;
}

.order-time {
  font-size: 0.8rem;
  color: #64748b;
}

.order-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #64748b;
}

.order-total {
  font-weight: 500;
}

.payment-method {
  // Removido o font-style: italic;
}

.template-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.template-option {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover, &.active {
    border-color: #FF5500;
    background-color: rgba(255, 85, 0, 0.1);
  }
}

.template-preview {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 8px;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.template-name {
  font-weight: bold;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.template-icon {
  flex-shrink: 0;
}

.custom-message-input {
  padding: 16px;
  border-top: 1px solid #e5e7eb;

  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #FF5500;
      box-shadow: 0 0 0 2px rgba(255, 85, 0, 0.2);
    }
  }
}

.popup-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.cancel-button, .send-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.cancel-button {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
  margin-right: 8px;
}

.send-button {
  background-color: #FF5500;
  color: white;
  border: none;

  &:hover {
    background-color: darken(#FF5500, 10%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.select-all-button {
  margin-top: 8px;
  padding: 4px 8px;
  font-size: 12px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e5e7eb;
  }
}

.toggle-message-type {
  padding: 8px 16px;
  text-align: center;
  font-size: 14px;

  a {
    color: #FF5500;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: darken(#FF5500, 10%);
    }
  }
}
</style>