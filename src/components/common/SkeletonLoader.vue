<template>
  <div class="skeleton-loader" :class="[`skeleton-${type}`, { 'skeleton-animated': animated }]">
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-header">
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-subtitle"></div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton-chart"></div>
      </div>
      <div class="skeleton-footer">
        <div class="skeleton-line skeleton-small"></div>
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-else-if="type === 'list'" class="skeleton-list">
      <div v-for="i in count" :key="i" class="skeleton-list-item">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-content">
          <div class="skeleton-line skeleton-medium"></div>
          <div class="skeleton-line skeleton-small"></div>
        </div>
      </div>
    </div>

    <!-- Table Skeleton -->
    <div v-else-if="type === 'table'" class="skeleton-table">
      <div class="skeleton-table-header">
        <div v-for="i in columns" :key="i" class="skeleton-line skeleton-medium"></div>
      </div>
      <div v-for="i in rows" :key="i" class="skeleton-table-row">
        <div v-for="j in columns" :key="j" class="skeleton-line skeleton-small"></div>
      </div>
    </div>

    <!-- Chart Skeleton -->
    <div v-else-if="type === 'chart'" class="skeleton-chart">
      <div class="skeleton-chart-header">
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-subtitle"></div>
      </div>
      <div class="skeleton-chart-content">
        <div class="skeleton-chart-bars">
          <div v-for="i in 5" :key="i" class="skeleton-bar" :style="{ height: `${Math.random() * 60 + 20}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Text Skeleton -->
    <div v-else-if="type === 'text'" class="skeleton-text">
      <div v-for="i in lines" :key="i" class="skeleton-line" :class="getLineClass(i)"></div>
    </div>

    <!-- Custom Skeleton -->
    <div v-else class="skeleton-custom">
      <div class="skeleton-line skeleton-large"></div>
      <div class="skeleton-line skeleton-medium"></div>
      <div class="skeleton-line skeleton-small"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['card', 'list', 'table', 'chart', 'text', 'custom'].includes(value)
  },
  count: {
    type: Number,
    default: 3
  },
  lines: {
    type: Number,
    default: 3
  },
  columns: {
    type: Number,
    default: 4
  },
  rows: {
    type: Number,
    default: 5
  },
  animated: {
    type: Boolean,
    default: true
  }
})

const getLineClass = (index) => {
  const classes = ['skeleton-medium', 'skeleton-small', 'skeleton-large']
  return classes[index % classes.length]
}
</script>

<style scoped>
.skeleton-loader {
  width: 100%;
}

.skeleton-animated {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Base skeleton styles */
.skeleton-line {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.skeleton-title {
  height: 20px;
  width: 60%;
}

.skeleton-subtitle {
  height: 16px;
  width: 40%;
}

.skeleton-medium {
  height: 16px;
  width: 80%;
}

.skeleton-small {
  height: 12px;
  width: 60%;
}

.skeleton-large {
  height: 24px;
  width: 100%;
}

/* Card Skeleton */
.skeleton-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.skeleton-header {
  margin-bottom: 1rem;
}

.skeleton-content {
  margin-bottom: 1rem;
}

.skeleton-chart {
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* List Skeleton */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-content {
  flex: 1;
}

/* Table Skeleton */
.skeleton-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.skeleton-table-header {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.skeleton-table-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.skeleton-table-row:last-child {
  border-bottom: none;
}

/* Chart Skeleton */
.skeleton-chart {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.skeleton-chart-header {
  margin-bottom: 1rem;
}

.skeleton-chart-content {
  height: 200px;
  display: flex;
  align-items: end;
  justify-content: space-around;
  padding: 1rem 0;
}

.skeleton-chart-bars {
  display: flex;
  align-items: end;
  gap: 0.5rem;
  height: 100%;
  width: 100%;
}

.skeleton-bar {
  flex: 1;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px 4px 0 0;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  min-height: 20px;
}

/* Text Skeleton */
.skeleton-text {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Custom Skeleton */
.skeleton-custom {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Responsive */
@media (max-width: 768px) {
  .skeleton-card {
    padding: 1rem;
  }
  
  .skeleton-list-item {
    padding: 0.75rem;
  }
  
  .skeleton-chart {
    padding: 1rem;
  }
  
  .skeleton-chart-content {
    height: 150px;
  }
}
</style>





