import { useRouter } from 'expo-router';
import { ArrowLeft, Fan, FlaskConical, Thermometer } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function VentilationSettingsScreen() {
  const router = useRouter();

  const [autoVent, setAutoVent] = useState(true);
  const [ammonia, setAmmonia] = useState(25);
  const [temp, setTemp] = useState(27);
  const [minVent, setMinVent] = useState(20);
  const [manualOverride, setManualOverride] = useState(false);

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
        <Text style={styles.headerTitle}>Ventilation Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Automatic Ventilation */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Automatic Ventilation</Text>
              <Text style={styles.cardSubtitle}>
                The system automatically controls ventilation based on environmental conditions
              </Text>
            </View>
            <Switch
              value={autoVent}
              onValueChange={setAutoVent}
              trackColor={{ false: '#CBD5E1', true: '#15803D' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Ammonia Trigger */}
        <Text style={styles.sectionTitle}>Ammonia Trigger</Text>
        <View style={styles.counterRow}>
          <View style={styles.rowLeft}>
            <FlaskConical size={20} color="#0F172A" />
            <Text style={styles.rowText}>Active ventilation when NH₃ reaches:</Text>
          </View>
          <View style={styles.counterControls}>
            <TouchableOpacity onPress={() => setAmmonia(Math.max(0, ammonia - 1))} style={styles.counterBtn}>
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{ammonia} ppm</Text>
            <TouchableOpacity onPress={() => setAmmonia(ammonia + 1)} style={styles.counterBtn}>
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Temperature Trigger */}
        <Text style={styles.sectionTitle}>Temperature Trigger</Text>
        <View style={styles.counterRow}>
          <View style={styles.rowLeft}>
            <Thermometer size={20} color="#0F172A" />
            <Text style={styles.rowText}>Active ventilation when temperature reaches:</Text>
          </View>
          <View style={styles.counterControls}>
            <TouchableOpacity onPress={() => setTemp(Math.max(0, temp - 1))} style={styles.counterBtn}>
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{temp} °C</Text>
            <TouchableOpacity onPress={() => setTemp(temp + 1)} style={styles.counterBtn}>
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Minimum Ventilation Level */}
        <Text style={styles.sectionTitle}>Minimum Ventilation Level</Text>
        <View style={styles.counterRow}>
          <View style={styles.rowLeft}>
            <Fan size={20} color="#0F172A" />
            <Text style={styles.rowText}>Keep ventilation at least</Text>
          </View>
          <View style={styles.counterControls}>
            <TouchableOpacity onPress={() => setMinVent(Math.max(0, minVent - 5))} style={styles.counterBtn}>
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{minVent} %</Text>
            <TouchableOpacity onPress={() => setMinVent(Math.min(100, minVent + 5))} style={styles.counterBtn}>
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Manual Override */}
        <Text style={styles.sectionTitle}>Manual Override</Text>
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Enable manual override</Text>
              <Text style={styles.cardSubtitle}>Temporarily disable automatic control</Text>
            </View>
            <Switch
              value={manualOverride}
              onValueChange={setManualOverride}
              trackColor={{ false: '#CBD5E1', true: '#15803D' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  cardSubtitle: { fontSize: 11, color: '#64748B', marginTop: 2, paddingRight: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 4 },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  rowText: { fontSize: 11, color: '#0F172A', flexShrink: 1 },
  counterControls: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6 },
  counterBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  counterBtnText: { fontSize: 14, color: '#0F172A', fontWeight: 'bold' },
  counterValue: { paddingHorizontal: 8, fontSize: 12, fontWeight: '600', color: '#0F172A', borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#CBD5E1' },
});