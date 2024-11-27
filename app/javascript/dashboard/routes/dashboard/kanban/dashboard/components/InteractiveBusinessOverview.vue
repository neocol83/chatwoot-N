<template>
  <div class="interactive-business-overview">
    <h4>Receita: {{ revenue }}</h4>
    <h4>Pedidos: {{ orders }}</h4>
    <h4>Satisfação do Cliente: {{ customerSatisfaction }}</h4>
  </div>
</template>

<script>
export default {
  name: 'InteractiveBusinessOverview',
  props: {
    revenue: Object,
    orders: Object,
    customerSatisfaction: Object,
  },
};
</script>
