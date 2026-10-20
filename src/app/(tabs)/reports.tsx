import { Droplets, HeartPulse, Scale, Utensils } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ScreenLayout } from '../../components/ScreenLayout';

const GREEN = '#16A34A';
const AMBER = '#D97706';
const RED = '#DC2626';

// ---------- Whole-flock numbers (sample values, no individual birds) ----------
const flock = { total: 5, healthy: 3, atRisk: 1, sick: 1 };
const AVG_WEIGHT_G = 68; // average from the inspection room scale
const TARGET_WEIGHT_G = 70; // target average for the current age

const toPct = (n: number) => (flock.total > 0 ? Math.round((n / flock.total) * 100) : 0);
const last = (arr: number[]) => arr[arr.length - 1];
const statusColor = (p: number) => (p >= 90 ? GREEN : p >= 75 ? AMBER : RED);

const healthyPct = toPct(flock.healthy);
const riskPct = toPct(flock.atRisk);
const sickPct = toPct(flock.sick);
const weightPct = Math.round((AVG_WEIGHT_G / TARGET_WEIGHT_G) * 100);

// ---------- Monitoring schedule: every Wednesday and Saturday ----------
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CHECKS_SHOWN = 8; // 8 checks = 4 weeks of Wed + Sat
const DAY_MS = 86400000;

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const isCheckDay = (d: Date) => d.getDay() === 3 || d.getDay() === 6; // Wed or Sat
const shortDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
const fmtDay = (d: Date) => `${WEEKDAYS[d.getDay()]}, ${shortDate(d)}`;

// Trend values at each monitoring check, oldest to newest, on a 0-100 scale
// (percent of flock / percent of target). The last value is the most recent check.
const series = [
  { name: 'Healthy Flock (%)', color: '#16A34A', data: [90, 90, 88, 85, 80, 75, 70, healthyPct] },
  { name: 'Feed Intake (% of target)', color: '#EAB308', data: [100, 99, 98, 96, 95, 94, 94, 94] },
  { name: 'Water Intake (% of target)', color: '#0284C7', data: [98, 97, 95, 93, 92, 90, 89, 88] },
  { name: 'Weight (% of target)', color: '#64748B', data: [100, 100, 99, 98, 97, 97, 97, weightPct] },
];

const feedPct = last(series[1].data);
const waterPct = last(series[2].data);

const metrics = [
  {
    label: 'Flock Health',
    value: `${healthyPct}%`,
    sub: 'healthy',
    Icon: HeartPulse,
    color: '#22C55E',
    valueColor: statusColor(healthyPct),
  },
  {
    label: 'Avg Weight',
    value: `${AVG_WEIGHT_G} g`,
    sub: `target ${TARGET_WEIGHT_G} g`,
    Icon: Scale,
    color: '#64748B',
    valueColor: statusColor(weightPct),
  },
  {
    label: 'Feed Intake',
    value: `${feedPct}%`,
    sub: 'of target',
    Icon: Utensils,
    color: '#EAB308',
    valueColor: statusColor(feedPct),
  },
  {
    label: 'Water Intake',
    value: `${waterPct}%`,
    sub: 'of target',
    Icon: Droplets,
    color: '#38BDF8',
    valueColor: statusColor(waterPct),
  },
];

const overall =
  healthyPct >= 90
    ? { label: 'GOOD', color: GREEN, bg: '#E8F5E9', note: 'The flock is in good condition' }
    : healthyPct >= 75
      ? { label: 'WATCH', color: AMBER, bg: '#FEF3C7', note: 'Keep a close eye on the flock' }
      : { label: 'NEEDS ATTENTION', color: RED, bg: '#FEE2E2', note: 'Inspect the flock today' };

const breakdown = [
  { label: 'Healthy', pct: healthyPct, color: '#16A34A' },
  { label: 'At risk', pct: riskPct, color: '#EAB308' },
  { label: 'Sick', pct: sickPct, color: '#DC2626' },
];

export default function ReportsScreen() {
  // Dates are worked out on each render so they stay correct after midnight.
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Last 8 monitoring days up to and including today, oldest first.
  const checkDays: Date[] = [];
  for (let i = 0; checkDays.length < CHECKS_SHOWN && i < 90; i++) {
    const d = addDays(today, -i);
    if (isCheckDay(d)) checkDays.unshift(d);
  }
  const lastCheck = checkDays[checkDays.length - 1];

  // Next monitoring day (today counts if it is a Wednesday or Saturday).
  let nextCheck = today;
  while (!isCheckDay(nextCheck)) nextCheck = addDays(nextCheck, 1);
  const daysUntil = Math.round((nextCheck.getTime() - today.getTime()) / DAY_MS);
  const nextText = daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `in ${daysUntil} days`;

  // This week (Sunday to Saturday): its Wednesday and Saturday checks.
  const weekStart = addDays(today, -today.getDay());
  const weekChecks = [3, 6].map((n) => {
    const date = addDays(weekStart, n);
    const status =
      date.getTime() < today.getTime()
        ? { label: 'Done', color: GREEN, bg: '#E8F5E9' }
        : date.getTime() === today.getTime()
          ? { label: 'Today', color: AMBER, bg: '#FEF3C7' }
          : { label: 'Upcoming', color: '#64748B', bg: '#F1F5F9' };
    return { date, status };
  });

  return (
    <ScreenLayout title="Reports">
      {/* Overall flock status */}
      <Card>
        <View style={styles.statusHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.chartTitle}>Overall Flock Health</Text>
            <Text style={styles.statusNote}>
              {overall.note} · as of {fmtDay(lastCheck)}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: overall.bg }]}>
            <Text style={[styles.statusBadgeText, { color: overall.color }]}>{overall.label}</Text>
          </View>
        </View>

        {/* Stacked bar: share of the flock in each condition */}
        <View style={styles.bar}>
          {breakdown.map((b) => (
            <View key={b.label} style={{ flex: b.pct, backgroundColor: b.color }} />
          ))}
        </View>

        <View style={styles.breakdownRow}>
          {breakdown.map((b) => (
            <View key={b.label} style={styles.breakdownItem}>
              <View style={[styles.legendDotSmall, { backgroundColor: b.color }]} />
              <Text style={styles.breakdownLabel}>{b.label}</Text>
              <Text style={styles.breakdownValue}>{b.pct}%</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* 2x2 metric cards */}
      <View style={styles.grid}>
        {metrics.map(({ label, value, sub, Icon, color, valueColor }) => (
          <Card key={label} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Icon size={20} color={color} />
              <Text style={styles.metricLabel}>{label}</Text>
            </View>
            <Text style={[styles.metricValue, { color: valueColor }]}>{value}</Text>
            <Text style={styles.metricSub}>{sub}</Text>
          </Card>
        ))}
      </View>

      {/* This week's monitoring */}
      <Card>
        <Text style={styles.chartTitle}>This Week's Monitoring</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryBox, { backgroundColor: '#F0FDF4' }]}>
            <Text style={styles.summaryLabel}>Last check</Text>
            <Text style={styles.summaryValue}>{fmtDay(lastCheck)}</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: '#EFF6FF' }]}>
            <Text style={styles.summaryLabel}>Next check</Text>
            <Text style={styles.summaryValue}>{fmtDay(nextCheck)}</Text>
            <Text style={styles.summaryHint}>{nextText}</Text>
          </View>
        </View>

        {weekChecks.map(({ date, status }) => (
          <View key={date.getTime()} style={styles.checkRow}>
            <View>
              <Text style={styles.checkDay}>{date.getDay() === 3 ? 'Wednesday' : 'Saturday'}</Text>
              <Text style={styles.checkDate}>{shortDate(date)}</Text>
            </View>
            <View style={[styles.checkBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.checkBadgeText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>
        ))}
      </Card>

      {/* Trend across monitoring days */}
      <Card>
        <Text style={styles.chartTitle}>Weekly Monitoring Trend</Text>

        <View style={styles.chartRow}>
          <View style={styles.yAxis}>
            {['100', '75', '50', '25', '0'].map((n) => (
              <Text key={n} style={styles.axisLabel}>{n}</Text>
            ))}
          </View>

          <View style={styles.graphArea}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.gridLine} />
            ))}

            {series.map((s) => (
              <View key={s.name} style={styles.dataLayer}>
                {s.data.map((val, idx) => (
                  <View
                    key={idx}
                    style={[styles.dot, { backgroundColor: s.color, bottom: `${val}%` }]}
                  />
                ))}
              </View>
            ))}

            <View style={styles.xAxis}>
              {checkDays.map((d) => (
                <Text key={d.getTime()} style={styles.axisLabel}>
                  {WEEKDAYS[d.getDay()]}
                  {'\n'}
                  {shortDate(d)}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </Card>

      {/* Legend */}
      <Card style={styles.legend}>
        {series.map((s) => (
          <View key={s.name} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: s.color }]} />
            <Text style={styles.legendText}>{s.name}</Text>
          </View>
        ))}
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  // Overall status
  statusHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  statusNote: { fontSize: 12, color: '#6B7280', marginTop: -10 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  bar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  breakdownItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDotSmall: { width: 10, height: 10, borderRadius: 5 },
  breakdownLabel: { fontSize: 12, color: '#6B7280' },
  breakdownValue: { fontSize: 12, fontWeight: '700', color: '#1F2937' },

  // Metrics
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  metricCard: { width: '48%', alignItems: 'center' },
  metricHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  metricLabel: { fontSize: 13, fontWeight: '500', color: '#1F2937' },
  metricValue: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  metricSub: { fontSize: 11, color: '#6B7280', marginTop: 2 },

  // Weekly monitoring
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  summaryBox: { flex: 1, borderRadius: 12, padding: 12 },
  summaryLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  summaryValue: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  summaryHint: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  checkDay: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  checkDate: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  checkBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  checkBadgeText: { fontSize: 11, fontWeight: '700' },

  // Trend chart
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  chartRow: { flexDirection: 'row', height: 190 },
  yAxis: { justifyContent: 'space-between', paddingRight: 8, paddingBottom: 30 },
  graphArea: { flex: 1, justifyContent: 'space-between' },
  gridLine: { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', width: '100%' },
  dataLayer: {
    ...StyleSheet.absoluteFillObject,
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, position: 'absolute' },
  xAxis: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  axisLabel: { fontSize: 10, color: '#64748B', textAlign: 'center' },

  // Legend
  legend: { gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  legendDot: { width: 14, height: 14, borderRadius: 7 },
  legendText: { fontSize: 13, fontWeight: '500', color: '#1F2937' },
});
