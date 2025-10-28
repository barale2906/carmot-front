<template>
  <div class="notifications-container">
    <TransitionGroup name="notification" tag="div" class="notifications-list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', `notification--${notification.type}`]"
      >
        <div class="notification__icon">
          <span v-if="notification.type === 'success'">✅</span>
          <span v-else-if="notification.type === 'error'">❌</span>
          <span v-else-if="notification.type === 'warning'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>

        <div class="notification__content">
          <div class="notification__header">
            <h4 class="notification__title">{{ notification.title }}</h4>
            <button
              @click="removeNotification(notification.id)"
              class="notification__close"
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
          
          <p class="notification__message">{{ notification.message }}</p>
          
          <div v-if="notification.actions && notification.actions.length > 0" class="notification__actions">
            <button
              v-for="action in notification.actions"
              :key="action.label"
              @click="action.action"
              class="notification__action"
            >
              {{ action.label }}
            </button>
          </div>
        </div>

        <div v-if="!notification.persistent" class="notification__progress">
          <div class="notification__progress-bar"></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useNotifications } from '@/composables/useNotifications'

const { notifications, removeNotification } = useNotifications()
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  pointer-events: none;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
}

.notification {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  pointer-events: auto;
  position: relative;
  overflow: hidden;
}

.notification--success {
  border-left-color: #48bb78;
}

.notification--error {
  border-left-color: #e53e3e;
}

.notification--warning {
  border-left-color: #ed8936;
}

.notification--info {
  border-left-color: #4299e1;
}

.notification__icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.notification__content {
  flex: 1;
  min-width: 0;
}

.notification__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.notification__title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
  line-height: 1.25;
}

.notification__close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #a0aec0;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: 0.5rem;
}

.notification__close:hover {
  color: #4a5568;
}

.notification__message {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.4;
}

.notification__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.notification__action {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.notification__action:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.notification__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
}

.notification__progress-bar {
  height: 100%;
  background: #4299e1;
  animation: progress 5s linear forwards;
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Animaciones */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-container {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
  }

  .notifications-list {
    max-width: none;
  }

  .notification {
    padding: 0.875rem;
  }

  .notification__actions {
    flex-direction: column;
  }

  .notification__action {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .notification {
    padding: 0.75rem;
  }

  .notification__title {
    font-size: 0.8125rem;
  }

  .notification__message {
    font-size: 0.8125rem;
  }
}
</style>
