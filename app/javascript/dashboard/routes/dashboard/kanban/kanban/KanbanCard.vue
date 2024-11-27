<template>
  <div
    class="kanban-item"
    :class="{ expanded: item.expanded, priority: item.priority }"
    :data-id="item.id"
    :data-labels="item.labels.join(',')"
    draggable="true"
    @dragstart="$emit('drag-start', $event, item)"
    @dragend="$emit('drag-end', $event)"
    @click="$emit('toggle-item-expand', item)"
  >
    <!-- Conteúdo do card -->
    <div class="item-header" :class="{ 'priority': item.priority }">
      <div class="item-type">Pedido #{{ item.id }}</div>
      <div class="item-header-right">
        <span class="item-time">
          <svg class="clock-icon" viewBox="0 0 24 24" width="12" height="12">
            <path :d="dashboardIcons['clock-outline']" fill="currentColor" />
          </svg>
          {{ formattedElapsedTime }}
        </span>
        <button class="chat-button" @click.stop="$emit('open-chat', item)">
          <svg class="chat-icon" viewBox="0 0 24 24" width="16" height="16">
            <path :d="dashboardIcons['chat-outline']" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
    <!-- Resto do conteúdo do card -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import dashboardIcons from 'shared/components/FluentIcon/dashboard-icons.json';

export default {
  name: 'KanbanCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dashboardIcons,
    };
  },
  computed: {
    ...mapGetters('timerStore', ['getElapsedTime']),
    formattedElapsedTime() {
      const seconds = this.getElapsedTime(this.item.id);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
  },
  created() {
    this.initializeTimer({ id: this.item.id });
  },
  methods: {
    ...mapActions('timerStore', ['initializeTimer']),
  },
};
</script>

<style lang="scss" scoped>
@import '~dashboard/assets/scss/variables';

/* Estilos do card */
</style>