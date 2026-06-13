import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationService } from '../services/NotificationService';

export const usePushNotifications = () => {
  const navigate = useNavigate();
  const { authMode } = useAuth();

  useEffect(() => {
    // 2. Platform Check: Only run on mobile devices
    if (Capacitor.getPlatform() === 'web') {
      return;
    }

    const setupPushNotifications = async () => {
      // 3. Android Notification Channel
      if (Capacitor.getPlatform() === 'android') {
        try {
          await PushNotifications.createChannel({
            id: 'dorcas-app-channel',
            name: 'Dorcas Notifications',
            description: 'Important updates and alerts',
            importance: 4, // HIGH
            visibility: 1, // PUBLIC
            vibration: true,
            lights: true,
            lightColor: '#3a58e8',
          });
          console.log('Android notification channel created successfully');
        } catch (error) {
          console.error('Error creating Android notification channel:', error);
        }
      }

      // 4. Permissions
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('Push notification permission denied or not granted.');
        return;
      }

      // 5. Registration
      await PushNotifications.register();
    };

    // 6. Listeners to Implement
    const addListeners = async () => {
      // Listen for successful registration
      await PushNotifications.addListener('registration', async (token) => {
        console.log('Push registration successful, FCM token: ', token.value);
        try {
          await NotificationService.registerDevice(token.value, null, authMode);
          console.log('API: Token successfully saved to database via NotificationService.');
        } catch (err) {
          console.error('API Error: Failed to save FCM token to database', err);
        }
      });

      // Listen for registration errors
      await PushNotifications.addListener('registrationError', (error) => {
        console.error('Error during push notification registration: ', error);
      });

      // Listen for foreground notifications
      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received in foreground: ', notification);
      });

      // Listen for notification tap actions
      await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed (tapped): ', notification);
        const data = notification.notification.data;
        if (data && data.link) {
          navigate(data.link);
        }
      });
    };

    setupPushNotifications();
    addListeners();

    // 7. Cleanup
    return () => {
      if (Capacitor.getPlatform() !== 'web') {
        // Remove all listeners when the component unmounts to prevent memory leaks or duplicate listeners
        PushNotifications.removeAllListeners();
      }
    };
  }, [navigate]);
};
