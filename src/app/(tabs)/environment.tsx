import { Droplet, FlaskConical, Thermometer, Wind } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ScreenLayout } from '../../components/ScreenLayout';

const metrics = [
  { label: 'Temperature', value: '32.5°C', Icon: Thermometer, color: '#38BDF8' },
  { label: 'Humidity', value: '65%', Icon: Droplet, color: '#38BDF8' },
  { label: 'Air Quality', value: 'GOOD', Icon: Wind, color: '#22C55E', valueColor: '#16A34A' },
  { label: 'Ammonia', value: '8 ppm', Icon: FlaskConical, color: '#64748B' },
];

const series = [
  { name: 'Temperature (°C)', color: '#16A34A', data: [50, 75, 75, 75, 75, 73, 72] },
  { name: 'Humidity (%)', color: '#0284C7', data: [25, 48, 49, 51, 51, 49, 49] },
  { name: 'Ammonia (ppm)', color: '#EAB308', data: [2, 8, 5, 6, 6, 4, 4] },
];

const dates = ['7/30', '7/31', '8/1', '8/2', '8/3', '8/4', '8/5'];

export default function EnvironmentScreen() {
  return (
    <ScreenLayout title="Environment" >
      {/* 2x2 metric cards */}
      <View style={styles.grid}>
        {metrics.map(({ label, value, Icon, color, valueColor }) => (
          <Card key={label} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Icon size={20} color={color} />
              <Text style={styles.metricLabel}>{label}</Text>
            </View>
            <Text style={[styles.metricValue, valueColor ? { color: valueColor } : null]}>
              {value}
            </Text>
          </Card>
        ))}
      </View>

      {/* 7 days trend */}
      <Card>
        <Text style={styles.chartTitle}>7 Days Trend</Text>

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
              {dates.map((d) => (
                <Text key={d} style={styles.axisLabel}>{d}</Text>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  metricCard: { width: '48%', alignItems: 'center' },
  metricHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  metricLabel: { fontSize: 13, fontWeight: '500', color: '#1F2937' },
  metricValue: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },

  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  chartRow: { flexDirection: 'row', height: 180 },
  yAxis: { justifyContent: 'space-between', paddingRight: 8, paddingBottom: 20 },
  graphArea: { flex: 1, justifyContent: 'space-between' },
  gridLine: { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', width: '100%' },
  dataLayer: {
    ...StyleSheet.absoluteFillObject,
    bottom: 20,
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
    paddingHorizontal: 4,
  },
  axisLabel: { fontSize: 10, color: '#64748B' },

  legend: { gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  legendDot: { width: 14, height: 14, borderRadius: 7 },
  legendText: { fontSize: 13, fontWeight: '500', color: '#1F2937' },
});
