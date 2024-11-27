<template>
  <ul class="delayed-orders-list">
    <li v-for="order in orders" :key="order.id" class="order-item">
      <span class="order-id">#{{ order.id }}</span>
      <span class="order-delay">{{ order.delay }}</span>
      <button class="action-button" @click="handleAction(order)">Ação</button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'DelayedOrdersList',
  props: {
    orders: Array,
  },
  methods: {
    handleAction(order) {
      // Implementar ação para lidar com pedidos atrasados
      console.log('Ação para pedido atrasado:', order);
    },
  },
};
</script>

<style lang="scss" scoped>
.delayed-orders-list {
  list-style-type: none;
  padding: 0;

  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--s-200);

    &:last-child {
      border-bottom: none;
    }

    .order-id {
      font-weight: bold;
      color: var(--s-800);
    }

    .order-delay {
      color: var(--r-600);
      font-weight: bold;
    }

    .action-button {
      padding: 4px 8px;
      background-color: var(--w-500);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: var(--w-600);
      }
    }
  }
}
</style>
