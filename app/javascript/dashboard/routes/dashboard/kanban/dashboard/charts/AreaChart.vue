<template>
  <svg :width="width" :height="height" viewBox="0 0 100 60">
    <defs>
      <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#36A2EB" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#36A2EB" stop-opacity="0.1" />
      </linearGradient>
    </defs>
    <path :d="areaPath" fill="url(#areaGradient)" />
    <path :d="linePath" fill="none" stroke="#36A2EB" stroke-width="2" />
    <g v-for="(point, index) in dataPoints" :key="index">
      <circle :cx="point.x" :cy="point.y" r="2" fill="#36A2EB" />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'AreaChart',
  props: {
    data: {
      type: Array,
      required: true,
    },
    width: {
      type: Number,
      default: 500,
    },
    height: {
      type: Number,
      default: 300,
    },
  },
  computed: {
    maxValue() {
      return Math.max(...this.data.map(item => item.value));
    },
    dataPoints() {
      const step = 95 / (this.data.length - 1);
      return this.data.map((item, index) => {
        const x = 2.5 + index * step;
        const y = 55 - (item.value / this.maxValue) * 50;
        return { x, y };
      });
    },
    linePath() {
      return `M${this.dataPoints.map(p => `${p.x},${p.y}`).join(' ')}`;
    },
    areaPath() {
      return `${this.linePath} L${this.dataPoints[this.dataPoints.length - 1].x},55 L2.5,55 Z`;
    },
  },
};
</script>
