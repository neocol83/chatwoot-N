<template>
  <div class="capacity-meter">
    <div class="meter">
      <div class="fill" :style="{ width: fillPercentage + '%' }"></div>
    </div>
    <div class="capacity-info">
      <span>{{ current }} / {{ max }}</span>
      <span>{{ fillPercentage }}%</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CapacityMeter',
  props: {
    current: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  computed: {
    fillPercentage() {
      return Math.min(Math.round((this.current / this.max) * 100), 100)
    }
  }
}
</script>

<style scoped>
.capacity-meter .meter {
  height: 16px;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--s-100);
}

.capacity-meter .meter .fill {
  background-color: var(--b-500);
  height: 100%;
  transition: width 0.5s ease-in-out;
}

.capacity-meter .capacity-info {
  margin-top: 8px;
  font-size: 12px;
  color: var(--s-700);
  display: flex;
  justify-content: space-between;
}
</style>
