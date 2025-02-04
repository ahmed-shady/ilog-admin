import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DIRECT_BASE_URL } from '@app/api/axios';
import { listNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@app/api/NotificationService';
import Notification from '@app/types/Notification';
import { NON_REPETITIVE_NOTIFICATIONS } from '@app/types/NotificationType';


// Context to hold the notifications state
const NotificationContext = createContext<{ notifications: Notification[], addNotification: (notificationStr: string) => void, markAsRead: (id: number) => void, markAllAsRead: () => void }>({
    notifications: [],
    addNotification: () => { },
    markAsRead: () => {},
    markAllAsRead: () => {}
});

// Custom hook to use notifications
export const useNotifications = () => {
    return useContext(NotificationContext);
};

const maxReconnectDelay = 5 * 60 * 1000; // Maximum delay (in milliseconds)  (5 minutes)
const initialReconnectDelay = 1000; // Initial delay (in milliseconds)  (1  second)

let currentReconnectDelay = initialReconnectDelay;

const NotificationConnector = ({ userId, children }: { userId: number, children: React.ReactNode }) => {
    const isConnected = useRef(false);  // Ref to track connection status
    const isTabActive = useRef(true);   // Ref to track if the tab is active
    const eventSourceRef = useRef<EventSource | null>(null);  // Ref to store the EventSource instance
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [notifications, setNotifications] = useState<Notification[]>([]);  // State to store the notifications

    const addNotification = (notificationStr: string) => {
        const notification: Notification = JSON.parse(notificationStr);
        notification.createdAt = notification.updatedAt = new Date().toISOString();
        setNotifications((prevNotifications) => {
            let modifiedPrevNotifications = prevNotifications;
            if(NON_REPETITIVE_NOTIFICATIONS.includes(notification.type)){
                modifiedPrevNotifications = prevNotifications.filter(p => p.type !== notification.type);
            }
            
            return [notification, ...modifiedPrevNotifications];
        });
    }

    const markAsRead = useCallback((id: number) => {
        markNotificationAsRead(id);
        setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.id === id ? { ...notification, read: true } : notification
                )
            );
    }, [markNotificationAsRead,setNotifications]);

    const markAllAsRead = () => {
        markAllNotificationsAsRead();
        setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>({ ...notification, read: true })));
    }




    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };


    const connectToNotifications = () => {
        listNotifications()
        .then((notifications) => {
            setNotifications(notifications);

        })
        const source = new EventSource(`${DIRECT_BASE_URL}/messaging/sse/stream?userId=${userId}`);

        source.onopen = () => {
            isConnected.current = true;
            currentReconnectDelay = initialReconnectDelay; // Reset the delay upon successful connection
            console.log("see connection is opened");
        }

    
        source.onmessage = (event) => {
            if (event.data === "Connection closed due to inactivity.") {
                console.log("timeout");
                isConnected.current = false;

            }else{
                isConnected.current = true;
                console.log("new message " + event.data);
                addNotification(event.data);  // Add notification
                playSound();

            }
        };


        source.onerror = (event) => {
            console.error('see Connection error, closing it... ' + isTabActive.current);
            console.error(event);
            source.close(); // Close the current connection
            
            isConnected.current = false;
            if(!isTabActive.current){
                console.log("cancel attempt.. tab is not active")
                return;
            }

            // Attempt to reconnect after a delay
            setTimeout(() => {
                console.log('Attempting to reconnect...');
                connectToNotifications(); // Reconnect
                // Increase the delay using exponential backoff, but cap it at maxReconnectDelay
                currentReconnectDelay = Math.min(currentReconnectDelay * 2, maxReconnectDelay);

            }, currentReconnectDelay);
        };

        eventSourceRef.current = source;
    };


    const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
            // The tab has become active
            isTabActive.current = true;
            console.log("Tab is active and sse connection is " + isConnected.current);
            if(!isConnected.current){
                //
                console.log("connecting again... ")
                connectToNotifications();

            }
        } else {
            // The tab has become inactive
            isTabActive.current = false;
            console.log("Tab is inactive");
        }
    };

    useEffect(() => {
        connectToNotifications(); // Connect when the component mounts
        // Listen for visibility changes
        document.addEventListener("visibilitychange", handleVisibilityChange);
        // Clean up the EventSource on component unmount
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                console.log("SSE connection closed.");
            }
            document.removeEventListener("visibilitychange", handleVisibilityChange);

        };

    }, [userId]);


    return (
        <>
        <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
        <audio ref={audioRef} src="/notification-sound.mp3" />

        </>
    );
};

export default NotificationConnector;
