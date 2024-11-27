<template>
  <div class="demand-forecast-chart">
    <h4>Previsão de Demanda</h4>
    <!-- Implemente o gráfico de previsão de demanda aqui -->
  </div>
</template>

<script>
export default {
  name: 'DemandForecastChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.demand-forecast-chart {
  /* Adicione estilos conforme necessário */
}
</style>
