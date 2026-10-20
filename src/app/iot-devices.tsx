import { useRouter } from 'expo-router';
import { ArrowLeft, Wifi } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IotDevicesScreen() {
  const router = useRouter();
  
  // Validations at States para sa Device at Sensors
  const [isSyncing, setIsSyncing] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('Today, 9:41 PM');
  const [signalStrength, setSignalStrength] = useState(80); // 80%

  // Validation function para sa pag-sync ng device
  const handleSynchronize = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('Just now');
      Alert.alert('Success', 'A.V.I.A.N. Controller synchronized successfully.');
    }, 1500);
  };

  // Validation function para sa pag-reconnect ng device
  const handleReconnect = () => {
    setIsReconnecting(true);
    setTimeout(() => {
      setIsReconnecting(false);
      setIsConnected(true);
      setSignalStrength(85);
      Alert.alert('Connected', 'Device successfully reconnected to the network.');
    }, 2000);
  };

  // Listahan ng mga sensors na may dynamic validation status
  const sensors = [
    { name: 'Temperature Sensor', status: isConnected ? 'Online' : 'Offline', color: isConnected ? '#16A34A' : '#DC2626' },
    { name: 'Humidity Sensor', status: isConnected ? 'Online' : 'Offline', color: isConnected ? '#16A34A' : '#DC2626' },
    { name: 'Ammonia Sensor', status: isConnected ? 'Online' : 'Offline', color: isConnected ? '#16A34A' : '#DC2626' },
    { name: 'Ventilation Control', status: isConnected ? 'Active' : 'Standby', color: isConnected ? '#16A34A' : '#CA8A04' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IoT Device & Sensors</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Controller Card */}
        <View style={styles.mainCard}>
          <Text style={styles.controllerTitle}>A.V.I.A.N. Controller</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <View style={[styles.dot, { backgroundColor: isConnected ? '#16A34A' : '#DC2626' }]} />
              <Text style={[styles.statusGreen, { color: isConnected ? '#16A34A' : '#DC2626' }]}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Device ID</Text>
            <Text style={styles.infoValue}>AVN-BRD01-001</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last sync</Text>
            <Text style={styles.infoValue}>{lastSyncTime}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Wi-Fi</Text>
            <View style={styles.statusBadge}>
              <View style={[styles.dot, { backgroundColor: isConnected ? '#16A34A' : '#DC2626' }]} />
              <Text style={[styles.statusGreen, { color: isConnected ? '#16A34A' : '#DC2626' }]}>
                {isConnected ? 'Connected' : 'No Signal'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Signal Strength</Text>
            <View style={styles.signalContainer}>
              <Wifi size={14} color="#16A34A" style={{ marginRight: 4 }} />
              <Text style={styles.infoValue}>{signalStrength}% (Stable)</Text>
            </View>
          </View>

          {/* Action Buttons na may Validation States */}
          <TouchableOpacity 
            style={[styles.outlineBtn, isSyncing && { opacity: 0.6 }]} 
            activeOpacity={0.7}
            onPress={handleSynchronize}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#16A34A" />
            ) : (
              <Text style={styles.outlineBtnText}>Synchronize Device</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.outlineBtn, isReconnecting && { opacity: 0.6 }]} 
            activeOpacity={0.7}
            onPress={handleReconnect}
            disabled={isReconnecting}
          >
            {isReconnecting ? (
              <ActivityIndicator size="small" color="#16A34A" />
            ) : (
              <Text style={styles.outlineBtnText}>Reconnect Device</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sensor Status Section */}
        <Text style={styles.sectionTitle}>Sensor Status</Text>

        {sensors.map((sensor, index) => (
          <View key={index} style={styles.sensorCard}>
            <Text style={styles.sensorName}>{sensor.name}</Text>
            <View style={styles.statusBadge}>
              <View style={[styles.dot, { backgroundColor: sensor.color }]} />
              <Text style={[styles.statusGreen, { color: sensor.color }]}>{sensor.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    backgroundColor: '#15803D',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 12 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 16, paddingBottom: 40 },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  controllerTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  infoLabel: { fontSize: 12, color: '#64748B' },
  infoValue: { fontSize: 12, fontWeight: '500', color: '#0F172A' },
  signalContainer: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusGreen: { fontSize: 12, fontWeight: '600', color: '#16A34A' },
  outlineBtn: {
    borderWidth: 1,
    borderColor: '#16A34A',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  outlineBtnText: { color: '#16A34A', fontWeight: '600', fontSize: 13 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 10 },
  sensorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  sensorName: { fontSize: 13, fontWeight: '500', color: '#0F172A' },
});