import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const AIO_USERNAME = process.env.EXPO_PUBLIC_AIO_USERNAME || '';
const AIO_KEY = process.env.EXPO_PUBLIC_AIO_KEY || '';

export default function DeviceControlScreen() {
  const router = useRouter();

  // Device switch states
  const [heatLamp, setHeatLamp] = useState(false); // Kept local since it's disconnected for safety
  const [fan1, setFan1] = useState(false);
  const [fan2, setFan2] = useState(false);
  const [ammoniaSpray, setAmmoniaSpray] = useState(false);

  // Fetch current states from Adafruit IO safely
  const fetchDeviceStates = async () => {
    try {
      const headers = { 'X-AIO-Key': AIO_KEY };
      const [fan1Res, fan2Res, pump1Res, pump2Res] = await Promise.all([
        fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/fan-1/data/last`, { headers }),
        fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/fan-2/data/last`, { headers }),
        fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/pump-1/data/last`, { headers }),
        fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/pump-2/data/last`, { headers }),
      ]);

      if (fan1Res.ok) {
        const fan1Json = await fan1Res.json();
        const val = String(fan1Json.value);
        setFan1(val === '1' || val === 'ON');
      }

      if (fan2Res.ok) {
        const fan2Json = await fan2Res.json();
        const val = String(fan2Json.value);
        setFan2(val === '1' || val === 'ON');
      }

      let p1On = false;
      let p2On = false;

      if (pump1Res.ok) {
        const pump1Json = await pump1Res.json();
        const val = String(pump1Json.value);
        p1On = val === '1' || val === 'ON';
      }

      if (pump2Res.ok) {
        const pump2Json = await pump2Res.json();
        const val = String(pump2Json.value);
        p2On = val === '1' || val === 'ON';
      }

      setAmmoniaSpray(p1On || p2On);
    } catch (error) {
      console.warn('Network or parsing hiccup fetching device states:', error);
    }
  };

  useEffect(() => {
    fetchDeviceStates();
    const interval = setInterval(fetchDeviceStates, 5000);
    return () => clearInterval(interval);
  }, []);

  // Safe handler to push state changes to Adafruit IO
  const updateFeed = async (feedName: string, value: boolean) => {
    try {
      const headers = {
        'X-AIO-Key': AIO_KEY,
        'Content-Type': 'application/json',
      };
      const response = await fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feedName}/data`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ value: value ? '1' : '0' }),
      });

      if (!response.ok) {
        console.warn(`Could not update feed ${feedName}: Status ${response.status}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFan1Change = async (value: boolean) => {
    setFan1(value);
    await updateFeed('fan-1', value);
  };

  const handleFan2Change = async (value: boolean) => {
    setFan2(value);
    await updateFeed('fan-2', value);
  };

  const handleAmmoniaSprayChange = async (value: boolean) => {
    setAmmoniaSpray(value);
    await Promise.all([
      updateFeed('pump-1', value),
      updateFeed('pump-2', value),
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.push('/home' as any)} 
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Device Control</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Heat Lamp */}
        <View style={styles.deviceCard}>
          <View style={styles.deviceInfoContainer}>
            <View style={[styles.iconBox, heatLamp ? styles.iconBoxActive : styles.iconBoxInactive]}>
              <MaterialCommunityIcons 
                name="lightbulb" 
                size={24} 
                color={heatLamp ? '#16A34A' : '#9CA3AF'} 
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.deviceName}>Heat Lamp</Text>
              <Text style={styles.deviceDesc}>Controls the heating lamp for temperature regulation (Safely Offline)</Text>
            </View>
          </View>
          <View style={styles.statusActionContainer}>
            <Switch
              trackColor={{ false: '#CBD5E1', true: '#BBF7D0' }}
              thumbColor={heatLamp ? '#16A34A' : '#F1F5F9'}
              onValueChange={setHeatLamp}
              value={heatLamp}
            />
          </View>
        </View>

        {/* Fan 1 (Intake) */}
        <View style={styles.deviceCard}>
          <View style={styles.deviceInfoContainer}>
            <View style={[styles.iconBox, fan1 ? styles.iconBoxActive : styles.iconBoxInactive]}>
              <MaterialCommunityIcons 
                name="fan" 
                size={24} 
                color={fan1 ? '#16A34A' : '#9CA3AF'} 
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.deviceName}>Fan 1 (Intake)</Text>
              <Text style={styles.deviceDesc}>Provides fresh air inside the poultry house.</Text>
            </View>
          </View>
          <View style={styles.statusActionContainer}>
            <Switch
              trackColor={{ false: '#CBD5E1', true: '#BBF7D0' }}
              thumbColor={fan1 ? '#16A34A' : '#F1F5F9'}
              onValueChange={handleFan1Change}
              value={fan1}
            />
          </View>
        </View>

        {/* Fan 2 (Exhaust) */}
        <View style={styles.deviceCard}>
          <View style={styles.deviceInfoContainer}>
            <View style={[styles.iconBox, fan2 ? styles.iconBoxActive : styles.iconBoxInactive]}>
              <MaterialCommunityIcons 
                name="fan" 
                size={24} 
                color={fan2 ? '#16A34A' : '#9CA3AF'} 
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.deviceName}>Fan 2 (Exhaust)</Text>
              <Text style={styles.deviceDesc}>Removes hot air and excess humidity.</Text>
            </View>
          </View>
          <View style={styles.statusActionContainer}>
            <Switch
              trackColor={{ false: '#CBD5E1', true: '#BBF7D0' }}
              thumbColor={fan2 ? '#16A34A' : '#F1F5F9'}
              onValueChange={handleFan2Change}
              value={fan2}
            />
          </View>
        </View>

        {/* Ammonia Control Spray */}
        <View style={styles.deviceCard}>
          <View style={styles.deviceInfoContainer}>
            <View style={[styles.iconBox, ammoniaSpray ? styles.iconBoxActive : styles.iconBoxInactive]}>
              <MaterialCommunityIcons 
                name="spray" 
                size={24} 
                color={ammoniaSpray ? '#16A34A' : '#9CA3AF'} 
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.deviceName}>Ammonia Control Spray</Text>
              <Text style={styles.deviceDesc}>Neutralizes airborne ammonia using both diaphragm pumps.</Text>
            </View>
          </View>
          <View style={styles.statusActionContainer}>
            <Switch
              trackColor={{ false: '#CBD5E1', true: '#BBF7D0' }}
              thumbColor={ammoniaSpray ? '#16A34A' : '#F1F5F9'}
              onValueChange={handleAmmoniaSprayChange}
              value={ammoniaSpray}
            />
          </View>
        </View>

        {/* System Control Section */}
        <Text style={styles.sectionTitle}>System Control</Text>

        <View style={styles.systemControlCard}>
          <TouchableOpacity 
            style={styles.systemRow} 
            onPress={() => router.push('/environment-thresholds' as any)} 
            activeOpacity={0.7}
          >
            <View style={styles.systemRowLeft}>
              <Feather name="thermometer" size={20} color="#1F2937" style={{ marginRight: 12 }} />
              <Text style={styles.systemRowText}>Environment Thresholds</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.systemRow} 
            onPress={() => router.push('/brooder-settings' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.systemRowLeft}>
              <MaterialCommunityIcons name="bird" size={20} color="#1F2937" style={{ marginRight: 12 }} />
              <Text style={styles.systemRowText}>Brooder Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.systemRow} 
            onPress={() => router.push('/ventilation-settings' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.systemRowLeft}>
              <MaterialCommunityIcons name="weather-windy" size={20} color="#1F2937" style={{ marginRight: 12 }} />
              <Text style={styles.systemRowText}>Ventilation Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.systemRow} 
            onPress={() => router.push('/iot-devices' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.systemRowLeft}>
              <MaterialCommunityIcons name="wifi" size={20} color="#1F2937" style={{ marginRight: 12 }} />
              <Text style={styles.systemRowText}>IoT Device & Sensors</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingTop: 40, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  deviceCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'space-between' },
  deviceInfoContainer: { flexDirection: 'row', flex: 1, alignItems: 'center', paddingRight: 10 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconBoxActive: { backgroundColor: '#E8F5E9' },
  iconBoxInactive: { backgroundColor: '#F1F5F9' },
  textContainer: { flex: 1 },
  deviceName: { fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginBottom: 2 },
  deviceDesc: { fontSize: 12, color: '#64748B', lineHeight: 16 },
  statusActionContainer: { borderLeftWidth: 1, borderLeftColor: '#F1F5F9', paddingLeft: 14, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginTop: 16, marginBottom: 12 },
  systemControlCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 4, overflow: 'hidden' },
  systemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 16 },
  systemRowLeft: { flexDirection: 'row', alignItems: 'center' },
  systemRowText: { fontSize: 15, fontWeight: '500', color: '#1F2937' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16 },
});