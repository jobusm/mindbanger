'use client';

import React, { useEffect, useState } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useDictionary } from '@/lib/i18n-client';

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default function PushNotificationToggle() {
  const { dict } = useDictionary();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const subscribeToPush = async () => {
    setIsLoading(true);
    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== 'granted') {
        throw new Error('Permission denied');
      }

      const registration = await navigator.serviceWorker.ready;
      
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
         throw new Error('Missing VAPID key in env. Check setup.');
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // Send subscription to server
      const res = await fetch('/api/user/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!res.ok) throw new Error('Failed to save subscription on server');

      setIsSubscribed(true);
      alert((dict.settings as any)?.pushTemp || 'Push notifikácie boli úspešne zapnuté!');
    } catch (error) {
      console.error('Error subscribing to push:', error);
      alert((dict.settings as any)?.pushTemp || 'Nastala chyba pri zapínaní notifikácií. Skontrolujte povolenia prehliadača.');
      // Fallback update permission state
      if ('Notification' in window) {
         setPermission(Notification.permission);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="text-sm text-slate-500 italic p-4 bg-slate-900/50 rounded-xl border border-white/5">
        {(dict.settings as any)?.pushTemp || 'Váš prehliadač alebo zariadenie momentálne nepodporuje Push Notifikácie.'}
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-800/30 rounded-xl border border-white/10 flex items-center justify-between">
      <div>
        <h3 className="text-slate-300 font-medium flex items-center gap-2">
          {isSubscribed ? <Bell className="text-amber-500" size={18} /> : <BellOff className="text-slate-500" size={18} />}
          {(dict.settings as any)?.pushTemp || 'Notifikácie do zariadenia'}
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          {(dict.settings as any)?.pushTemp || 'Dostávaj denné ranné reštarty priamo na uzamknutú obrazovku mobilu alebo do počítača.'}
        </p>
      </div>

      <button
        onClick={subscribeToPush}
        disabled={isSubscribed || isLoading || permission === 'denied'}
        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
          isSubscribed 
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            : permission === 'denied'
            ? 'bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed'
            : 'bg-amber-500 text-slate-900 hover:bg-amber-400'
        }`}
      >
        {isLoading ? <Loader2 className="animate-spin" size={16} /> : null}
        {isSubscribed 
          ? ((dict.settings as any)?.pushTemp || 'Zapnuté')
          : permission === 'denied'
          ? ((dict.settings as any)?.pushTemp || 'Zablokované v prehliadači')
          : ((dict.settings as any)?.pushTemp || 'Zapnúť')}
      </button>
    </div>
  );
}
