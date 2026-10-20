import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ScreenLayout } from '../../components/ScreenLayout';

// ---------- Config (edit these) ----------
const TOTAL_CHICKS = 5; // keep in sync with the Home screen
const INITIAL_WEIGHT_G = 40; // average day-old chick weight in grams
const FCR_TARGET = 1.6; // cumulative target; lower is better

// ---------- Helpers ----------
const fmtKg = (grams: number) => (grams / 1000).toFixed(2);
const fmtL = (ml: number) => (ml / 1000).toFixed(1);

export default function FeedWaterScreen() {
  const router = useRouter();

  // Daily log, most recent day first. feedG = grams of feed, waterMl = ml of water.
  const dailyLog = [
    { label: 'Day 3', feedG: 85, waterMl: 170, feedings: 3 },
    { label: 'Day 2', feedG: 65, waterMl: 130, feedings: 3 },
    { label: 'Day 1', feedG: 50, waterMl: 100, feedings: 3 },
  ];
  const latestWeight = 68; // average chick weight in grams (inspection room scale)

  const today = dailyLog[0];
  const totalFeedG = dailyLog.reduce((sum, d) => sum + d.feedG, 0);
  const totalWaterMl = dailyLog.reduce((sum, d) => sum + d.waterMl, 0);

  // FCR = total feed eaten / total weight gained (same units)
  const weightGainKg = Math.max(0, ((latestWeight - INITIAL_WEIGHT_G) * TOTAL_CHICKS) / 1000);
  const fcr = weightGainKg > 0 ? totalFeedG / 1000 / weightGainKg : null;

  const fcrStatus =
    fcr == null
      ? { label: 'No data yet', bg: '#F3F4F6', color: '#6B7280' }
      : fcr <= FCR_TARGET
        ? { label: 'On target', bg: '#E8F5E9', color: '#15803D' }
        : fcr <= FCR_TARGET + 0.2
          ? { label: 'Watch', bg: '#FEF3C7', color: '#D97706' }
          : { label: 'High', bg: '#FEE2E2', color: '#B91C1C' };

  const feedPerChickG = today.feedG / TOTAL_CHICKS;
  const waterPerChickMl = today.waterMl / TOTAL_CHICKS;
  const waterToFeed = today.feedG > 0 ? (today.waterMl / today.feedG).toFixed(1) : '—';
  const maxFeed = Math.max(1, ...dailyLog.map((d) => d.feedG));

  return (
    <ScreenLayout
      title="Feed & Water"
      badgeCount={3}
      onBellPress={() => router.push('/notification' as any)}
    >
      {/* ---------- FCR ---------- */}
      <Card>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.cardTitle}>Feed Conversion Ratio</Text>
            <Text style={styles.cardSub}>Feed eaten ÷ weight gained (target ≤ {FCR_TARGET})</Text>
          </View>
          <Text style={styles.bigNumber}>{fcr != null ? fcr.toFixed(2) : '—'}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: fcrStatus.bg }]}>
          <Text style={[styles.statusText, { color: fcrStatus.color }]}>{fcrStatus.label}</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.statBox, { backgroundColor: '#FEF3C7' }]}>
            <View style={styles.statLabelRow}>
              <MaterialCommunityIcons name="food-drumstick-outline" size={14} color="#D97706" />
              <Text style={[styles.statLabel, { color: '#D97706' }]}>Total Feed</Text>
            </View>
            <Text style={styles.statCount}>{fmtKg(totalFeedG)} kg</Text>
            <Text style={styles.statHint}>since placement</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#EFF6FF' }]}>
            <View style={styles.statLabelRow}>
              <MaterialCommunityIcons name="scale" size={14} color="#1D4ED8" />
              <Text style={[styles.statLabel, { color: '#1D4ED8' }]}>Weight Gain</Text>
            </View>
            <Text style={styles.statCount}>{weightGainKg.toFixed(2)} kg</Text>
            <Text style={styles.statHint}>{latestWeight} g avg now</Text>
          </View>
        </View>
      </Card>

      {/* ---------- Feed ---------- */}
      <Card>
        <Text style={styles.sectionTitle}>Feed Consumption Today</Text>
        <View style={styles.row}>
          <View style={styles.tile}>
            <MaterialCommunityIcons name="food-drumstick-outline" size={22} color="#15803D" />
            <Text style={styles.tileLabel}>Total</Text>
            <Text style={styles.tileValue}>{fmtKg(today.feedG)} kg</Text>
          </View>
          <View style={styles.tile}>
            <MaterialCommunityIcons name="bird" size={22} color="#15803D" />
            <Text style={styles.tileLabel}>Per Chick</Text>
            <Text style={styles.tileValue}>{feedPerChickG.toFixed(0)} g</Text>
          </View>
          <View style={styles.tile}>
            <Ionicons name="time-outline" size={22} color="#15803D" />
            <Text style={styles.tileLabel}>Feedings</Text>
            <Text style={styles.tileValue}>{today.feedings}</Text>
          </View>
        </View>
      </Card>

      {/* ---------- Water ---------- */}
      <Card>
        <Text style={styles.sectionTitle}>Water Intake Today</Text>
        <View style={styles.row}>
          <View style={styles.tile}>
            <Ionicons name="water-outline" size={22} color="#15803D" />
            <Text style={styles.tileLabel}>Total</Text>
            <Text style={styles.tileValue}>{fmtL(today.waterMl)} L</Text>
          </View>
          <View style={styles.tile}>
            <MaterialCommunityIcons name="bird" size={22} color="#15803D" />
            <Text style={styles.tileLabel}>Per Chick</Text>
            <Text style={styles.tileValue}>{waterPerChickMl.toFixed(0)} ml</Text>
          </View>
          <View style={styles.tile}>
            <MaterialCommunityIcons name="scale-balance" size={22} color="#15803D" />
            <Text style={styles.tileLabel}>Water : Feed</Text>
            <Text style={styles.tileValue}>{waterToFeed}</Text>
          </View>
        </View>
    
      </Card>

      {/* ---------- Daily log ---------- */}
      <Card>
        <Text style={styles.sectionTitle}>Daily Log</Text>
        <View style={styles.logRow}>
          <Text style={[styles.logHead, { width: 56 }]}>Day</Text>
          <View style={{ flex: 1 }} />
          <Text style={[styles.logHead, styles.logValue]}>Feed</Text>
          <Text style={[styles.logHead, styles.logValue]}>Water</Text>
        </View>
        {dailyLog.map((d) => (
          <View key={d.label} style={styles.logRow}>
            <Text style={styles.logDate}>{d.label}</Text>
            <View style={styles.barTrack}>
              <View
                style={[styles.barFill, { width: `${Math.round((d.feedG / maxFeed) * 100)}%` }]}
              />
            </View>
            <Text style={styles.logValue}>{fmtKg(d.feedG)} kg</Text>
            <Text style={styles.logValue}>{fmtL(d.waterMl)} L</Text>
          </View>
        ))}
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

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 14,
  },
  statusText: { fontSize: 12, fontWeight: '700' },

  statBox: { flex: 1, borderRadius: 12, padding: 12 },
  statLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  statLabel: { fontSize: 13, fontWeight: '600' },
  statCount: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  statHint: { fontSize: 11, color: '#6B7280', marginTop: 2 },

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
  noteText: { fontSize: 12, color: '#6B7280', marginTop: 12, lineHeight: 17 },

  // Daily log
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logHead: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  logDate: { width: 56, fontSize: 12, color: '#1F2937', fontWeight: '600' },
  logValue: { width: 62, fontSize: 12, color: '#1F2937', textAlign: 'right' },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  barFill: { height: 6, borderRadius: 3, backgroundColor: '#15803D' },
});
