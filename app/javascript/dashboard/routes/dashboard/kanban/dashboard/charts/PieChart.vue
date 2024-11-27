<template>
  <div class="pie-chart">
    <div class="pie" :style="pieStyle"></div>
    <div class="legend">
      <div v-for="(item, index) in data" :key="index" class="legend-item">
        <span class="color-dot" :style="{ backgroundColor: colors[index] }"></span>
        <span class="label">{{ item.label }}: {{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PieChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
    }
  },
  computed: {
    pieStyle() {
      const total = this.data.reduce((sum, item) => sum + item.value, 0);
      let cumulativePercentage = 0;
      const colorStops = this.data.map((item, index) => {
        const startPercentage = cumulativePercentage;
        const itemPercentage = (item.value / total) * 100;
        cumulativePercentage += itemPercentage;
        return `${this.colors[index]} ${startPercentage}% ${cumulativePercentage}%`;
      });
      return {
        background: `conic-gradient(${colorStops.join(', ')})`
      };
    }
  }
}
</script>

<style scoped>
.pie-chart {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.pie {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.legend {
  flex-grow: 1;
  margin-left: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.label {
  font-size: 14px;
  color: var(--s-700);
}
</style>