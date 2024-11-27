<template>
  <div class="performance-radar-chart">
    <h3>Análise de Desempenho</h3>
    <!-- Implemente o gráfico de radar aqui -->
  </div>
</template>

<script>
export default {
  name: 'PerformanceRadarChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.performance-radar-chart {
  /* Estilos aqui */
}
</style>
