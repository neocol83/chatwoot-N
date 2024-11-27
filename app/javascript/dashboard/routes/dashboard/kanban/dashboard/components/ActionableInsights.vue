<template>
  <div class="actionable-insights">
    <div v-for="insight in insights" :key="insight.title" class="insight-card">
      <h4>{{ insight.title }}</h4>
      <p>{{ insight.description }}</p>
      <button @click="takeAction(insight)">{{ insight.action }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionableInsights',
  props: {
    insights: {
      type: Array,
      required: true
    }
  },
  methods: {
    takeAction(insight) {
      console.log(`Ação tomada: ${insight.action}`);
      // Implemente a lógica da ação aqui
    }
  }
}
</script>

<style scoped>
.actionable-insights {
  /* Estilos aqui */
}
</style>
