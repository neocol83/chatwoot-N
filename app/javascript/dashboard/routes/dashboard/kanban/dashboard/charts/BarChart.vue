<template>
  <div class="bar-chart" :class="{ 'horizontal': horizontal }">
    <div v-for="(item, index) in normalizedData" :key="index" class="bar-container">
      <div class="bar" :style="barStyle(item)">
        <span class="value">{{ data[index].value }}</span>
      </div>
      <span class="label">{{ data[index].label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BarChart',
  props: {
    data: {
      type: Array,
      required: true
    },
    horizontal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    normalizedData() {
      const max = Math.max(...this.data.map(item => item.value));
      return this.data.map(item => item.value / max);
    }
  },
  methods: {
    barStyle(value) {
      const dimension = this.horizontal ? 'width' : 'height';
      return {
        [dimension]: `${value * 100}%`,
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`
      };
    }
  }
}
</script>

<style scoped>
.bar-chart {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.bar-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.bar {
  height: 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
}

.value {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.label {
  margin-left: 10px;
  font-size: 14px;
  color: var(--s-700);
  flex-shrink: 0;
  width: 80px;
}

.horizontal {
  flex-direction: row;
}

.horizontal .bar-container {
  flex-direction: column;
  margin-right: 10px;
  margin-bottom: 0;
  height: 100%;
}

.horizontal .bar {
  width: 100%;
  height: 24px;
}

.horizontal .label {
  margin-left: 0;
  margin-top: 5px;
  text-align: center;
  width: auto;
}
</style>