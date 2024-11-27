<template>
  <div class="product-bubble-chart">
    <h3>Tendências de Produtos</h3>
    <!-- Implemente o gráfico de bolhas aqui -->
  </div>
</template>

<script>
export default {
  name: 'ProductBubbleChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.product-bubble-chart {
  /* Estilos aqui */
}
</style>
