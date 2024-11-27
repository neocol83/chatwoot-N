<template>
  <div class="stage-time-chart">
    <div v-for="(item, index) in data" :key="index" class="stage-bar">
      <div class="stage-info">
        <span class="stage-label">{{ item.label }}</span>
        <span class="stage-value">{{ item.value }} min</span>
      </div>
      <div class="bar-container">
        <div class="bar" :style="{ width: `${getPercentage(item.value)}%`, backgroundColor: colors[item.label.toLowerCase()] }"></div>
      </div>
    </div>
    <div class="total-time">
      <span>Tempo total médio: {{ totalTime }} min</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StageTimeChart',
  props: {
    data: {
      type: Array,
      required: true
    },
    colors: {
      type: Object,
      required: true
    }
  },
  computed: {
    maxValue() {
      return Math.max(...this.data.map(item => item.value));
    },
    totalTime() {
      return this.data.reduce((sum, item) => sum + item.value, 0);
    }
  },
  methods: {
    getPercentage(value) {
      return (value / this.maxValue) * 100;
    }
  }
}
</script>

<style scoped>
.stage-time-chart {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.stage-bar {
  margin-bottom: 15px;
}

.stage-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.stage-label {
  font-size: 14px;
  color: var(--s-700);
}

.stage-value {
  font-size: 14px;
  font-weight: bold;
  color: var(--s-800);
}

.bar-container {
  height: 12px;
  background-color: var(--s-100);
  border-radius: 6px;
  overflow: hidden;
}

.bar {
  height: 100%;
  transition: width 0.5s ease-in-out;
}

.total-time {
  margin-top: 15px;
  font-weight: bold;
  text-align: right;
}
</style>