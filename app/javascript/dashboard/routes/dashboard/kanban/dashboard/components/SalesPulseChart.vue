<template>
  <div class="sales-pulse-chart">
    <h3>Visão Geral de Vendas</h3>
    <!-- Implemente o gráfico de pulso de vendas aqui -->
  </div>
</template>

<script>
export default {
  name: 'SalesPulseChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.sales-pulse-chart {
  /* Estilos aqui */
}
</style>
