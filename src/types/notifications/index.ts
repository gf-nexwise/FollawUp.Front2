export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id?: string;
  type: NotificationType;
  message: string;
  duration?: number;
  autoClose?: boolean;
}

export interface NotificationOptions extends Omit<Notification, 'id'> {
  duration?: number;
  autoClose?: boolean;
}

export interface UseNotificationReturn {
  notifications: Notification[];
  showNotification: (options: NotificationOptions) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}