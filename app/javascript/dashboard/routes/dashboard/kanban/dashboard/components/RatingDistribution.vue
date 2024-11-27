<template>
  <div class="rating-distribution">
    <div v-for="rating in ratings" :key="rating.rating" class="rating-bar">
      <span class="stars" :style="{ color: titleColor }">{{ rating.rating }} ★</span>
      <div class="bar">
        <div class="fill" :style="{ width: getPercentage(rating.count) + '%', backgroundColor: colors[5 - rating.rating] }"></div>
      </div>
      <span class="count">{{ rating.count }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RatingDistribution',
  props: {
    ratings: {
      type: Array,
      required: true
    },
    colors: {
      type: Array,
      required: true
    },
    titleColor: {
      type: String,
      default: 'var(--s-800)'
    }
  },
  computed: {
    totalRatings() {
      return this.ratings.reduce((sum, rating) => sum + rating.count, 0)
    }
  },
  methods: {
    getPercentage(count) {
      return (count / this.totalRatings) * 100
    }
  }
}
</script>

<style scoped>
.rating-distribution {
  display: flex;
  flex-direction: column;
}

.rating-bar {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.stars {
  width: 40px;
  text-align: left;
  color: var(--s-700);
}

.bar {
  flex-grow: 1;
  height: 12px;
  background-color: var(--s-100);
  border-radius: 6px;
  overflow: hidden;
  margin: 0 8px;
}

.fill {
  height: 100%;
}

.count {
  width: 30px;
  text-align: right;
  font-size: 12px;
  color: var(--s-700);
}
</style>