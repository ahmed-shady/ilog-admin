import Notification from "../types/Notification";
import { callApi } from "./axios";
import endPoints from "./Endpoints";


export const listNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await callApi(endPoints.getNotifications, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  try {
    await callApi(endPoints.markNotificationAsRead, {
      urlParams: {id: notificationId}
    });
  } catch (error) {
    throw error;
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await callApi(endPoints.markAllNotificationsAsRead, {});
  } catch (error) {
    throw error;
  }
};