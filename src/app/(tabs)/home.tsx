import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, ScreenLayout } from '../../components/ScreenLayout';

export default function HomeScreen() {
  const router = useRouter();

  const chicks = [
    { id: 'CHK-0234', status: 'Healthy' },
    { id: 'CHK-0231', status: 'Healthy' },
    { id: 'CHK-0233', status: 'At Risk' },
    { id: 'CHK-0235', status: 'Sick' },
    { id: 'CHK-0232', status: 'Healthy' },
  ];

  const totalChicks = chicks.length;
  const healthyCount = chicks.filter((c) => c.status === 'Healthy').length;
  const riskCount = chicks.filter((c) => c.status === 'At Risk').length;
  const healthyPct = totalChicks > 0 ? Math.round((healthyCount / totalChicks) * 100) : 0;
  const riskPct = totalChicks > 0 ? Math.round((riskCount / totalChicks) * 100) : 0;

  const environmentData = { temperature: '32.5°C', humidity: '65%', airQuality: 'Good' };

  // Today's totals: feed in grams, water in ml. Sample values, keep in sync with the Feed & Water screen.
  const feedWaterData = { feedG: 85, waterMl: 170, fcr: 1.43 };

  return (
    <ScreenLayout title="Home">
      {/* ---------- Farm Overview ---------- */}
      <Card>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.cardTitle}>Farm Overview</Text>
            <Text style={styles.cardSub}>Total Chicks</Text>
          </View>
          <Text style={styles.bigNumber}>{totalChicks}</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.statBox, { backgroundColor: '#E8F5E9' }]}>
            <View style={styles.statLabelRow}>
              <Ionicons name="checkmark-circle" size={14} color="#15803D" />
              <Text style={[styles.statLabel, { color: '#2D6A4F' }]}>Healthy</Text>
            </View>
            <Text style={styles.statCount}>
              {healthyCount} <Text style={styles.pct}>({healthyPct}%)</Text>
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#FEF3C7' }]}>
            <View style={styles.statLabelRow}>
              <Ionicons name="alert-circle" size={14} color="#D97706" />
              <Text style={[styles.statLabel, { color: '#D97706' }]}>At risk</Text>
            </View>
            <Text style={styles.statCount}>
              {riskCount} <Text style={styles.pct}>({riskPct}%)</Text>
            </Text>
          </View>
        </View>
      </Card>

      {/* ---------- Feed & Water (middle) ---------- */}
      <Card>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/feed-water' as any)}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.cardTitle}>Feed & Water</Text>
              <Text style={styles.cardSub}>Today's consumption</Text>
            </View>
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>Details</Text>
              <Ionicons name="chevron-forward" size={16} color="#15803D" />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.tile}>
              <MaterialCommunityIcons name="food-drumstick-outline" size={22} color="#15803D" />
              <Text style={styles.tileLabel}>Feed</Text>
              <Text style={styles.tileValue}>{(feedWaterData.feedG / 1000).toFixed(2)} kg</Text>
            </View>
            <View style={styles.tile}>
              <Ionicons name="water-outline" size={22} color="#15803D" />
              <Text style={styles.tileLabel}>Water</Text>
              <Text style={styles.tileValue}>{(feedWaterData.waterMl / 1000).toFixed(1)} L</Text>
            </View>
            <View style={styles.tile}>
              <MaterialCommunityIcons name="chart-line" size={22} color="#15803D" />
              <Text style={styles.tileLabel}>FCR</Text>
              <Text style={[styles.tileValue, { color: '#2D6A4F' }]}>
                {feedWaterData.fcr.toFixed(2)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Card>

      {/* ---------- Environment ---------- */}
      <Card>
        <Text style={styles.sectionTitle}>Environment</Text>
        <View style={styles.row}>
          <View style={styles.tile}>
            <Feather name="thermometer" size={22} color="#15803D" />
            <Text style={styles.tileLabel}>Temp</Text>
            <Text style={styles.tileValue}>{environmentData.temperature}</Text>
          </View>
          <View style={styles.tile}>
            <Ionicons name="water-outline" size={22} color="#15803D" />
            <Text style={styles.tileLabel}>Humidity</Text>
            <Text style={styles.tileValue}>{environmentData.humidity}</Text>
          </View>
          <View style={styles.tile}>
            <MaterialCommunityIcons name="weather-windy" size={22} color="#15803D" />
            <Text style={styles.tileLabel}>Air Quality</Text>
            <Text style={[styles.tileValue, { color: '#2D6A4F' }]}>{environmentData.airQuality}</Text>
          </View>
        </View>
      </Card>

      {/* ---------- Devices ---------- */}
      <Card>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/device-control' as any)}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.cardTitle}>Devices and System Status</Text>
              <Text style={styles.cardSub}>Controller, fan, light, pump</Text>
            </View>
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>Details</Text>
              <Ionicons name="chevron-forward" size={16} color="#15803D" />
            </View>
          </View>

          <View style={styles.normalBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.normalText}>All Systems Normal</Text>
          </View>

          <View style={styles.row}>
            {(
              [
                { icon: 'chip', label: 'Controller' },
                { icon: 'fan', label: 'Fan' },
                { icon: 'lightbulb-outline', label: 'Light' },
                { icon: 'water-pump', label: 'Pump' },
              ] as const
            ).map(({ icon, label }) => (
              <View key={icon} style={styles.tile}>
                <MaterialCommunityIcons name={icon} size={22} color="#15803D" />
                <Text style={styles.tileLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  cardSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  bigNumber: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },

  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  linkText: { fontSize: 13, fontWeight: '600', color: '#15803D' },

  statBox: { flex: 1, borderRadius: 12, padding: 12 },
  statLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: '600' },
  statCount: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  pct: { fontSize: 12, fontWeight: 'normal', color: '#6B7280' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  tile: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tileLabel: { fontSize: 12, color: '#6B7280', marginTop: 6 },
  tileValue: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginTop: 2 },

  normalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#15803D', marginRight: 8 },
  normalText: { fontSize: 13, fontWeight: '600', color: '#15803D' },
});
