import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'success' | 'warning' | 'info' | 'alert' | 'error';
}

export interface NodeActivityData {
  id: string;
  node: string;
  latency: number;
  status: string;
  load: number;
}
export interface SecurityProtocolData {
  id: string;
  name: string;
  status: string;
  last_check: string;
  strength: number;
}

export interface SystemEventData {
  id: string;
  event_time: string;
  event_description: string;
  node: string;
  type: 'ok' | 'warn' | 'alert';
}

export interface TelemetryMetricData {
  id: string;
  month_label: string;
  value: number;
  order_index: number;
}

export function useSystemData() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nodeActivities, setNodeActivities] = useState<NodeActivityData[]>([]);
  const [securityProtocols, setSecurityProtocols] = useState<SecurityProtocolData[]>([]);
  const [systemEvents, setSystemEvents] = useState<SystemEventData[]>([]);
  const [telemetryMetrics, setTelemetryMetrics] = useState<TelemetryMetricData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [nodes, sec, evts, metrics] = await Promise.all([
        supabase.from('node_activity').select('*'),
        supabase.from('security_protocols').select('*'),
        supabase.from('system_events').select('*').order('created_at', { ascending: false }),
        supabase.from('telemetry_metrics').select('*').order('order_index', { ascending: true })
      ]);

      // Clear notifications as requested by user
      setNotifications([]);

      if (nodes.data) setNodeActivities(nodes.data);
      if (sec.data) setSecurityProtocols(sec.data);
      if (evts.data) setSystemEvents(evts.data);
      if (metrics.data) setTelemetryMetrics(metrics.data);
    } catch (e) {
      console.error('Error fetching system data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();

    const notifSub = supabase.channel('notif_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_events' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'node_activity' }, fetchAll)
      .subscribe();

    return () => {
      supabase.removeChannel(notifSub);
    };
  }, []);

  const markNotificationRead = async (id: string) => {
    await supabase.from('system_notifications').update({ is_read: true }).eq('id', id);
  };

  const markAllNotificationsRead = async () => {
    await supabase.from('system_notifications').update({ is_read: true }).eq('is_read', false);
  };

  return {
    notifications,
    nodeActivities,
    securityProtocols,
    systemEvents,
    telemetryMetrics,
    loading,
    markNotificationRead,
    markAllNotificationsRead,
    refetch: fetchAll
  };
}
