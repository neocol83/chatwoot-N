<template>
  <div class="top-items-list">
    <div v-for="(item, index) in items" :key="index" class="item">
      <span class="item-rank">{{ index + 1 }}</span>
      <span class="item-name">{{ item.name }}</span>
      <span class="item-quantity">{{ item.quantity }}</span>
      <span class="item-percentage">{{ getPercentage(item.quantity) }}%</span>
    </div>
    <div class="total-items">
      <span>Total de itens vendidos: {{ totalItems }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopItemsList',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  computed: {
    totalItems() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
  },
  methods: {
    getPercentage(quantity) {
      return ((quantity / this.totalItems) * 100).toFixed(1);
    }
  }
}
</script>

<style scoped>
.top-items-list {
  display: flex;
  flex-direction: column;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--s-100);
}

.item-rank {
  font-weight: bold;
  width: 20px;
}

.item-name {
  flex-grow: 1;
}

.item-quantity, .item-percentage {
  margin-left: 10px;
}

.total-items {
  margin-top: 10px;
  font-weight: bold;
}
</style>