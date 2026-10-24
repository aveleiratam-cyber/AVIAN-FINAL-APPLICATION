import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Wifi, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const AIO_USERNAME = 'systemprototype1017';
const AIO_KEY = process.env.EXPO_PUBLIC_AIO_KEY || '';

export default function IotDevicesScreen() {
  const router = useRouter();

  const [isConnected, setIsConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Checking...');
  const [signalStrength, setSignalStrength] = useState(0);

  const [tempStatus, setTempStatus] = useState('Checking...');
  const [tempColor, setTempColor] = useState('#64748B');

  const [humStatus, setHumStatus] = useState('Checking...');
  const [humColor, setHumColor] = useState('#64748B');

  const [ammoniaStatus, setAmmoniaStatus] = useState('Checking...');
  const [ammoniaColor, setAmmoniaColor] = useState('#64748B');

  const [ventStatus, setVentStatus] = useState('Standby');
  const [ventColor, setVentColor] = useState('#CA8A04');

  const [wifiModalVisible, setWifiModalVisible] = useState(false);
  const [ssid, setSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [isUpdatingCloud, setIsUpdatingCloud] = useState(false);
  const [isUpdatingLocal, setIsUpdatingLocal] = useState(false);

  useEffect(() => {
    const checkSensorFeeds = async () => {
      const headers: HeadersInit = AIO_KEY ? { 'X-AIO-Key': AIO_KEY } : {};

      try {
        const [tempRes, humRes, ammoniaRes] = await Promise.all([
          fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/temp/data/last`, { headers }),
          fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/hum/data/last`, { headers }),
          fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/ammonia/data/last`, { headers }),
        ]);

        const tempData = await tempRes.json();
        const humData = await humRes.json();
        const ammoniaData = await ammoniaRes.json();

        if (tempData?.value || humData?.value || ammoniaData?.value) {
          setIsConnected(true);
          setSignalStrength(85);
          setLastSyncTime('Just now');

          setTempStatus('Online');
          setTempColor('#16A34A');

          setHumStatus('Online');
          setHumColor('#16A34A');

          setAmmoniaStatus('Online');
          setAmmoniaColor('#16A34A');

          const ppm = ammoniaData?.value ? parseFloat(ammoniaData.value) : 0;
          if (ppm > 18) {
            setVentStatus('Active (Ventilating)');
            setVentColor('#16A34A');
          } else {
            setVentStatus('Standby');
            setVentColor('#CA8A04');
          }
        } else {
          throw new Error('No feed data found');
        }
      } catch (error) {
        console.error('Error checking Adafruit feeds:', error);
        setIsConnected(false);
        setSignalStrength(0);
        setLastSyncTime('Disconnected');

        setTempStatus('Offline');
        setTempColor('#DC2626');

        setHumStatus('Offline');
        setHumColor('#DC2626');

        setAmmoniaStatus('Offline');
        setAmmoniaColor('#DC2626');

        setVentStatus('Standby');
        setVentColor('#CA8A04');
      }
    };

    checkSensorFeeds();
    const interval = setInterval(checkSensorFeeds, 10000); 
    return () => clearInterval(interval);
  }, []);

  // Cloud Wi-Fi Update Handler
  const handleUpdateCloud = async () => {
    if (!ssid.trim() || !wifiPassword.trim()) {
      Alert.alert('Validation Error', 'Please enter both Wi-Fi Name (SSID) and Password.');
      return;
    }

    setIsUpdatingCloud(true);
    setTimeout(() => {
      setIsUpdatingCloud(false);
      setWifiModalVisible(false);
      setLastSyncTime('Just now');
      Alert.alert('Success', `Updated Wi-Fi credentials (${ssid}) via Cloud!`);
      setSsid('');
      setWifiPassword('');
    }, 1500);
  };

  const handleUpdateLocalAP = async () => {
    if (!ssid.trim() || !wifiPassword.trim()) {
      Alert.alert('Validation Error', 'Please enter both Wi-Fi Name (SSID) and Password.');
      return;
    }

    setIsUpdatingLocal(true);
    setTimeout(() => {
      setIsUpdatingLocal(false);
      setWifiModalVisible(false);
      setIsConnected(true);
      setSignalStrength(90);
      setLastSyncTime('Just now');
      Alert.alert('Connected', `Updated Wi-Fi credentials (${ssid}) via Local AP!`);
      setSsid('');
      setWifiPassword('');
    }, 2000);
  };

  const sensors = [
    { name: 'Temperature Sensor', status: tempStatus, color: tempColor },
    { name: 'Humidity Sensor', status: humStatus, color: humColor },
    { name: 'Ammonia Sensor', status: ammoniaStatus, color: ammoniaColor },
    { name: 'Ventilation Control', status: ventStatus, color: ventColor },
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
              <Wifi size={14} color={isConnected ? '#16A34A' : '#DC2626'} style={{ marginRight: 4 }} />
              <Text style={styles.infoValue}>{signalStrength}% {isConnected ? '(Stable)' : '(Offline)'}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.8}
            onPress={() => setWifiModalVisible(true)}
          >
            <Text style={styles.primaryBtnText}>Update via Cloud (Online)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineBtn}
            activeOpacity={0.7}
            onPress={() => setWifiModalVisible(true)}
          >
            <Text style={styles.outlineBtnText}>Update via Local AP (Offline)</Text>
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

      <Modal
        visible={wifiModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWifiModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.wifiModalCard}>
            <View style={styles.wifiModalHeader}>
              <Text style={styles.wifiModalTitle}>Update ESP32 Wi-Fi</Text>
              <TouchableOpacity onPress={() => setWifiModalVisible(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Wi-Fi Name (SSID)</Text>
            <View style={styles.lightInputContainer}>
              <TextInput
                style={styles.lightInput}
                placeholder="Enter SSID"
                placeholderTextColor="#94A3B8"
                value={ssid}
                onChangeText={setSsid}
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.inputLabel}>Wi-Fi Password</Text>
            <View style={styles.lightInputContainer}>
              <TextInput
                style={styles.lightInput}
                placeholder="Enter Password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showWifiPassword}
                value={wifiPassword}
                onChangeText={setWifiPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowWifiPassword(!showWifiPassword)}>
                {showWifiPassword ? (
                  <EyeOff size={18} color="#64748B" />
                ) : (
                  <Eye size={18} color="#64748B" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              activeOpacity={0.8}
              onPress={handleUpdateCloud}
              disabled={isUpdatingCloud || isUpdatingLocal}
            >
              {isUpdatingCloud ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.modalPrimaryBtnText}>Update via Cloud (Online)</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryBtn}
              activeOpacity={0.8}
              onPress={handleUpdateLocalAP}
              disabled={isUpdatingCloud || isUpdatingLocal}
            >
              {isUpdatingLocal ? (
                <ActivityIndicator size="small" color="#15803D" />
              ) : (
                <Text style={styles.modalSecondaryBtnText}>Update via Local AP (Offline)</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  primaryBtn: {
    backgroundColor: '#15803D',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  outlineBtn: {
    borderWidth: 1,
    borderColor: '#16A34A',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
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

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  wifiModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  wifiModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  wifiModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  lightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 14,
  },
  lightInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
  },
  modalPrimaryBtn: {
    backgroundColor: '#15803D',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalSecondaryBtn: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSecondaryBtnText: {
    color: '#15803D',
    fontSize: 14,
    fontWeight: 'bold',
  },
});