<template>
  <div class="line-chart">
    <h4 class="chart-title">{{ highestValue }} pedidos</h4>
    <p class="chart-subtitle">Pico de pedidos às {{ peakHour }}</p>
    <div class="chart-area">
      <div v-for="(point, index) in normalizedData" :key="index" class="data-point"
           :style="{ left: `${index / (data.length - 1) * 100}%`, bottom: `${point * 100}%` }">
        <div class="point"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LineChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  computed: {
    normalizedData() {
      const max = Math.max(...this.data.map(item => item.value));
      return this.data.map(item => item.value / max);
    },
    highestValue() {
      return Math.max(...this.data.map(item => item.value));
    },
    peakHour() {
      const maxValue = this.highestValue;
      const peakItem = this.data.find(item => item.value === maxValue);
      return peakItem ? peakItem.label : 'N/A';
    }
  }
}
</script>

<style scoped>
.line-chart {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--s-800);
  margin-bottom: 4px;
}

.chart-subtitle {
  font-size: 14px;
  color: var(--s-600);
  margin-bottom: 16px;
}

.chart-area {
  position: relative;
  flex-grow: 1;
  background-color: rgba(79, 192, 141, 0.1);
}

.data-point {
  position: absolute;
  transform: translate(-50%, 50%);
}

.point {
  width: 8px;
  height: 8px;
  background-color: #4FC08D;
  border-radius: 50%;
}
</style>
