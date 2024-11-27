<template>
  <div class="stat-card" :class="color">
    <div class="icon">
      <i :class="'icon-' + icon"></i>
    </div>
    <h4>{{ title }}</h4>
    <p>{{ value }}</p>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'blue'
    }
  }
}
</script>

<style scoped>
.stat-card {
  border-radius: 8px;
  padding: 16px;
  border: 1px solid var(--s-200);
}

.icon {
  color: var(--white);
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 12px;
  display: inline-block;
}

h4 {
  color: var(--s-700);
  font-size: 12px;
  margin-bottom: 4px;
}

p {
  color: var(--s-900);
  font-size: 20px;
  font-weight: 700;
}

.blue .icon { background-color: var(--b-500); }
.orange .icon { background-color: var(--o-500); }
.green .icon { background-color: var(--g-500); }
.purple .icon { background-color: var(--p-500); }
</style>
