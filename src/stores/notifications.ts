import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notificationsApi } from '../api/notifications';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'alert';
  title: string;
  message: string;
  data: any;
  is_read: number;
  created_at: number;
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const loading = ref(false);

  async function fetchNotifications() {
    loading.value = true;
    try {
      const res = await notificationsApi.list();
      if (res.data.success) {
        notifications.value = res.data.data.notifications;
        unreadCount.value = res.data.data.unreadCount;
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    } finally {
      loading.value = false;
    }
  }

  async function fetchUnreadCount() {
    try {
      const res = await notificationsApi.unreadCount();
      if (res.data.success) {
        unreadCount.value = res.data.data.count;
      }
    } catch (e) {
      console.error('Failed to fetch unread count:', e);
    }
  }

  async function markAsRead(id: string) {
    try {
      await notificationsApi.markRead(id);
      const notif = notifications.value.find(n => n.id === id);
      if (notif && !notif.is_read) {
        notif.is_read = 1;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (e) {
      console.error('Failed to mark as read:', e);
    }
  }

  async function markAllAsRead() {
    try {
      await notificationsApi.markAllRead();
      notifications.value.forEach(n => n.is_read = 1);
      unreadCount.value = 0;
    } catch (e) {
      console.error('Failed to mark all as read:', e);
    }
  }

  async function deleteNotification(id: string) {
    try {
      await notificationsApi.delete(id);
      const idx = notifications.value.findIndex(n => n.id === id);
      if (idx !== -1) {
        if (!notifications.value[idx].is_read) {
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
        notifications.value.splice(idx, 1);
      }
    } catch (e) {
      console.error('Failed to delete notification:', e);
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
});