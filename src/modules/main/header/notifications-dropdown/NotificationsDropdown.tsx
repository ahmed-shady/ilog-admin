import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NotificationMenu } from '@app/styles/dropdown-menus';
import { ReduxState, useAppSelector } from '@app/store/store';
import {useState, useEffect, useCallback} from 'react';
import NotificationConnector, { useNotifications } from './NotificationConnector';
import NotificationType from '@app/types/NotificationType';
import Notification from '@app/types/Notification';
import { formatDateTime } from '@app/utils/DateUtil';
import './notification.scss';

const notificationIcons: Partial<Record<NotificationType, string>> = {
  [NotificationType.NEW_MESSAGES]: "fa-envelope",
  [NotificationType.NEW_USERS]: "fa-users",
  [NotificationType.NEW_DOCUMENTS]: "fa-file"
};

const NotificationsDropdown = () => {
  const currentUser = useAppSelector((state: ReduxState) => state.auth.currentUser);
  const [notificationsCount, setNotificationsCount] = useState(0);

  if(!currentUser){
    return null;
  }

  return (
    <NotificationMenu className='notification-menu' isOpen={false}>
      <div slot="head">
        <i className="far fa-bell" />
        {notificationsCount > 0 &&
          <span className="badge badge-warning navbar-badge">{notificationsCount}</span>
        }
      </div>
      <div slot="body">
      <NotificationConnector userId={currentUser.id}>
                <NotificationDisplay setNotificationsCount={setNotificationsCount} />
            </NotificationConnector>
      </div>
    </NotificationMenu>
  );
};


  interface NotificationItemProps {
    notification: Notification,
    markAsRead: any
  }

  const NotificationItem: React.FC<NotificationItemProps> = ({ notification, markAsRead }) => {

  const iconClasses = `fas mr-2 ${notificationIcons[notification.type] || 'fa-cog'}`;
  const navigate = useNavigate();

  const navigateToNotification = useCallback(() => {
    markAsRead(notification.id);
    let navigateTo = "";
    let navigateOptions = {};
    switch (notification.type) {
      case NotificationType.NEW_MESSAGES:
        navigateTo = `/contactus-messages`;
        break;
      case NotificationType.NEW_USERS:
        navigateTo = `/doctors`;
        break;
      case NotificationType.NEW_DOCUMENTS:
        navigateTo = `/doctors`;
        navigateOptions = { state: { hasPendingDocuments: true } }
        break;
      default:
        break;
    }
    navigateTo && navigate(navigateTo, navigateOptions);
  }, [markAsRead, notification]);

  const clicked = () => {
    navigateToNotification();
  }

  const notificationFormatDateTime = useCallback(() => {

  }, [notification]);
  return (
    <>
      <div className="dropdown-divider" />
      <div className="dropdown-item" onClick={clicked}>
        <i className={iconClasses} />
        <span>
          {notification.title}
        </span>
        <span className="float-right text-muted text-sm">
          {formatDateTime(new Date(notification.createdAt))}
        </span>
      </div>
    </>
  )
}

interface NotificationDisplayProps {
  setNotificationsCount: (count: number) => void;
}

const NotificationDisplay: React.FC<NotificationDisplayProps> = ({ setNotificationsCount }) => {
  const { notifications, markAsRead } = useNotifications();  // Use the context to get notifications

  const [t] = useTranslation();

  useEffect(() => {
    const nonReadCount: number = notifications.filter(n => !n.read).length || 0;
    setNotificationsCount(nonReadCount);

  }, [notifications]);



  return (
    <>
      <span className="dropdown-item dropdown-header">
        {t('header.notifications.count', { quantity: notifications.length })}
      </span>

      {notifications.map((notification, idx) => <NotificationItem key={idx} notification={notification} markAsRead={markAsRead}/>)}
    </>
  )
}

export default NotificationsDropdown;