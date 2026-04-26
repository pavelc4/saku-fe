import { apiClient } from './client';

export const notificationsApi = {
  list: () => apiClient.get('/notifications'),
  
  unreadCount: () => apiClient.get('/notifications/unread-count'),
  
  markRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  
  markAllRead: () => apiClient.patch('/notifications/read-all'),
  
  delete: (id: string) => apiClient.delete(`/notifications/${id}`),
};