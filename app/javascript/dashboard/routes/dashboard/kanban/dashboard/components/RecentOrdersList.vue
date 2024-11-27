<template>
  <div class="recent-orders-list">
    <div v-for="order in orders" :key="order.id" class="order-item">
      <div class="order-header">
        <span class="order-id">#{{ order.id }}</span>
        <span class="order-status" :class="order.status.toLowerCase()">{{ order.status }}</span>
      </div>
      <div class="order-details">
        <span class="order-time">{{ order.time }}</span>
        <span class="order-total">R$ {{ order.total.toFixed(2) }}</span>
      </div>
      <div class="order-items">
        {{ order.items.join(', ') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecentOrdersList',
  props: {
    orders: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.recent-orders-list {
  display: flex;
  flex-direction: column;
}

.order-item {
  border-bottom: 1px solid var(--s-100);
  padding: 10px 0;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.order-id {
  font-weight: bold;
}

.order-status {
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 12px;
}

.order-details {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--s-600);
  margin-bottom: 5px;
}

.order-items {
  font-size: 12px;
  color: var(--s-500);
}

.pendente { background-color: var(--y-100); color: var(--y-800); }
.preparacao { background-color: var(--o-100); color: var(--o-800); }
.pronto { background-color: var(--g-100); color: var(--g-800); }
.a-caminho { background-color: var(--b-100); color: var(--b-800); }
</style>