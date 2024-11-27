<template>
  <div class="select-orders-popup">
    <h3 class="popup-title">Selecione os pedidos para avançar</h3>
    <div class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-item">
        <label :for="order.id" class="order-label">
          <div class="custom-checkbox">
            <input type="checkbox" :id="order.id" v-model="selectedOrders" :value="order.id">
            <span class="checkmark"></span>
          </div>
          <div class="order-content">
            <div class="order-header">
              <span class="order-id">#{{ order.id }}</span>
              <span class="order-time">{{ getElapsedTime(order) }}</span>
            </div>
            <div class="customer-name">{{ order.sender.name }}</div>
            <div class="order-details">
              <span class="order-total">R$ {{ order.custom_attributes.total_do_pedido || '0,00' }}</span>
              <span class="order-address">{{ order.custom_attributes.endereo_de_entrega || 'Endereço não informado' }}</span>
            </div>
          </div>
        </label>
      </div>
    </div>
    <div class="popup-actions">
      <button @click="selectAll" class="select-all-button">
        {{ selectedOrders.length === orders.length ? 'Desmarcar Todos' : 'Selecionar Todos' }}
      </button>
      <div class="action-buttons">
        <button @click="advanceSelectedOrders" class="advance-button" :disabled="selectedOrders.length === 0">
          Avançar Selecionados ({{ selectedOrders.length }})
        </button>
        <button @click="$emit('close')" class="cancel-button">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectOrdersPopup',
  props: {
    orders: {
      type: Array,
      required: true
    },
    itemTimers: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedOrders: []
    }
  },
  methods: {
    advanceSelectedOrders() {
      if (this.selectedOrders.length > 0) {
        this.$emit('advance', this.selectedOrders);
        this.selectedOrders = []; // Limpa a seleção após avançar
      }
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
    selectAll() {
      if (this.selectedOrders.length === this.orders.length) {
        this.selectedOrders = [];
      } else {
        this.selectedOrders = this.orders.map(order => order.id);
      }
    }
  }
}
</script>

<style scoped>
.select-orders-popup {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 560px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.popup-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.order-list {
  margin-top: 1rem;
  max-height: 50vh;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #ffffff;
  scrollbar-width: thin;
  scrollbar-color: #FF5500 #e2e8f0;
}

.order-list::-webkit-scrollbar {
  width: 8px;
}

.order-list::-webkit-scrollbar-track {
  background: #e2e8f0;
}

.order-list::-webkit-scrollbar-thumb {
  @apply bg-woot-500;
  border-radius: 4px;
  border: 2px solid #e2e8f0;
}

.order-item {
  border-bottom: 1px solid #e2e8f0;
}

.order-item:last-child {
  border-bottom: none;
}

.order-label {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.order-label:hover {
  @apply bg-woot-50;
}

.custom-checkbox {
  position: relative;
  width: 20px;
  height: 20px;
  margin-right: 12px;
}

.custom-checkbox input {
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

.custom-checkbox input:checked ~ .checkmark {
  @apply bg-woot-500 border-woot-500;
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

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.order-content {
  flex-grow: 1;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.order-id {
  @apply text-woot-500;
}

.order-time {
  font-size: 0.8rem;
  color: #64748b;
}

.customer-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: #1e293b;
  margin-bottom: 2px;
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

.popup-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.select-all-button, .advance-button, .cancel-button {
  @apply bg-woot-500 text-white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.select-all-button:hover, .advance-button:hover:not(:disabled) {
  @apply bg-woot-600;
}

.advance-button {
  background-color: #FF5500;
  color: white;
  border: none;
}

.advance-button:hover:not(:disabled) {
  background-color: #e64a00;
}

.advance-button:disabled {
  background-color: #ffa07a;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #f1f5f9;
  color: #64748b;
  border: 1px solid #cbd5e1;
}

.cancel-button:hover {
  background-color: #e2e8f0;
}
</style>