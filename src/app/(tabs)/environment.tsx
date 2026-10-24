import { Droplet, FlaskConical, Thermometer, Wind } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Card, ScreenLayout } from '../../components/ScreenLayout';

const AIO_USERNAME = 'systemprototype1017';
const AIO_KEY = process.env.EXPO_PUBLIC_AIO_KEY || '';

export default function EnvironmentScreen() {
  const [temperature, setTemperature] = useState('--°C');
  const [humidity, setHumidity] = useState('--%');
  const [ammonia, setAmmonia] = useState('-- ppm');
  const [airQuality, setAirQuality] = useState('LOADING...');
  const [airQualityColor, setAirQualityColor] = useState('#64748B');

  const generateDefaultDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
    return dates;
  };

  const [chartDates] = useState<string[]>(generateDefaultDates());
  const [chartData, setChartData] = useState<Array<{ date: string; temp: number; hum: number; ammonia: number }>>(
    generateDefaultDates().map((d) => ({ date: d, temp: 0, hum: 0, ammonia: 0 }))
  );
  const [isLoadingChart, setIsLoadingChart] = useState(true);

  useEffect(() => {
    const fetchEnvironmentData = async () => {
      const headers: HeadersInit = AIO_KEY ? { 'X-AIO-Key': AIO_KEY } : {};

      try {
        const [tempRes, humRes, ammoniaRes, tempHistoryRes, humHistoryRes, ammoniaHistoryRes] = await Promise.all([
          fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/temp/data/last`, { headers }),
          fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/hum/data/last`, { headers }),
          fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/ammonia/data/last`, { headers }),
          fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/temp/data?limit=30`, { headers }),
          fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/hum/data?limit=30`, { headers }),
          fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/ammonia/data?limit=30`, { headers }),
        ]);

        const tempData = await tempRes.json();
        const humData = await humRes.json();
        const ammoniaData = await ammoniaRes.json();

        const tempHistory = await tempHistoryRes.json();
        const humHistory = await humHistoryRes.json();
        const ammoniaHistory = await ammoniaHistoryRes.json();

        const tempVal = tempData?.value ? `${parseFloat(tempData.value).toFixed(1)}°C` : '--°C';
        const humVal = humData?.value ? `${parseFloat(humData.value).toFixed(1)}%` : '--%';
        const ppmVal = ammoniaData?.value ? parseFloat(ammoniaData.value) : 0.0;
        const ammoniaVal = `${ppmVal.toFixed(1)} ppm`;

        let quality = 'GOOD';
        let color = '#16A34A'; 

        if (ppmVal > 18) {
          quality = 'POOR / HAZARDOUS';
          color = '#DC2626'; 
        } else if (ppmVal > 10) {
          quality = 'MODERATE';
          color = '#D97706'; 
        }

        setTemperature(tempVal);
        setHumidity(humVal);
        setAmmonia(ammoniaVal);
        setAirQuality(quality);
        setAirQualityColor(color);

        const defaultDates = generateDefaultDates();
        const slotMap: { [key: string]: { temp: number[]; hum: number[]; ammonia: number[] } } = {};
        defaultDates.forEach((d) => {
          slotMap[d] = { temp: [], hum: [], ammonia: [] };
        });

        const processHistoryItems = (historyArray: any[], metricKey: 'temp' | 'hum' | 'ammonia', divisor: number) => {
          if (Array.isArray(historyArray)) {
            historyArray.forEach((item) => {
              if (!item.created_at) return;
              const d = new Date(item.created_at);
              const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
              if (slotMap[dateStr]) {
                const normalized = Math.min(Math.max((parseFloat(item.value) / divisor) * 100, 4), 100);
                slotMap[dateStr][metricKey].push(normalized);
              }
            });
          }
        };

        processHistoryItems(tempHistory, 'temp', 50);       
        processHistoryItems(humHistory, 'hum', 100);       
        processHistoryItems(ammoniaHistory, 'ammonia', 50); 

        const finalChartData = defaultDates.map((dateStr) => {
          const tArr = slotMap[dateStr].temp;
          const hArr = slotMap[dateStr].hum;
          const aArr = slotMap[dateStr].ammonia;

          return {
            date: dateStr,
            temp: tArr.length > 0 ? tArr[tArr.length - 1] : 0, 
            hum: hArr.length > 0 ? hArr[hArr.length - 1] : 0,
            ammonia: aArr.length > 0 ? aArr[aArr.length - 1] : 0,
          };
        });

        setChartData(finalChartData);
        setIsLoadingChart(false);
      } catch (error) {
        console.error('Error fetching environment feeds:', error);
        setAirQuality('OFFLINE');
        setAirQualityColor('#DC2626');
        setIsLoadingChart(false);
      }
    };

    fetchEnvironmentData();

    const interval = setInterval(fetchEnvironmentData, 10000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: 'Temperature', value: temperature, Icon: Thermometer, color: '#38BDF8' },
    { label: 'Humidity', value: humidity, Icon: Droplet, color: '#38BDF8' },
    { label: 'Air Quality', value: airQuality, Icon: Wind, color: airQualityColor, valueColor: airQualityColor },
    { label: 'Ammonia', value: ammonia, Icon: FlaskConical, color: '#EAB308', valueColor: ppmColor(ammonia) },
  ];

  function ppmColor(valStr: string) {
    const num = parseFloat(valStr);
    if (isNaN(num)) return '#1F2937';
    if (num > 18) return '#DC2626'; 
    if (num > 10) return '#D97706'; 
    return '#16A34A'; 
  }

  const legendSeries = [
    { name: 'Temperature (°C)', color: '#16A34A' },
    { name: 'Humidity (%)', color: '#0284C7' },
    { name: 'Ammonia (ppm)', color: '#EAB308' },
  ];

  return (
    <ScreenLayout title="Environment">
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

      <Card>
        <Text style={styles.chartTitle}>7 Day Trends</Text>

        {isLoadingChart ? (
          <View style={{ height: 160, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#15803D" />
          </View>
        ) : (
          <View style={styles.chartRow}>
            <View style={styles.yAxis}>
              {['100', '75', '50', '25', '0'].map((n) => (
                <Text key={n} style={styles.axisLabel}>{n}</Text>
              ))}
            </View>

            <View style={styles.graphArea}>
              <View style={[styles.gridLine, { top: '0%' }]} />
              <View style={[styles.gridLine, { top: '25%' }]} />
              <View style={[styles.gridLine, { top: '50%' }]} />
              <View style={[styles.gridLine, { top: '75%' }]} />
              <View style={[styles.gridLine, { top: '100%' }]} />

              <View style={styles.barsContainer}>
                {chartData.map((item, idx) => (
                  <View key={idx} style={styles.dateGroup}>
                    <View style={styles.barsWrapper}>
                      <View style={[styles.bar, { height: `${item.temp}%`, backgroundColor: '#16A34A' }]} />
                      <View style={[styles.bar, { height: `${item.hum}%`, backgroundColor: '#0284C7' }]} />
                      <View style={[styles.bar, { height: `${item.ammonia}%`, backgroundColor: '#EAB308' }]} />
                    </View>
                    <Text style={styles.dateLabel}>{item.date}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </Card>

      {/* Legend */}
      <Card style={styles.legend}>
        {legendSeries.map((s) => (
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
  metricValue: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', textAlign: 'center' },

  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  chartRow: { flexDirection: 'row', height: 160, alignItems: 'center' },
  yAxis: { justifyContent: 'space-between', height: '100%', paddingRight: 8, paddingBottom: 16 },
  graphArea: { flex: 1, height: '100%', position: 'relative', paddingBottom: 16 },
  
  gridLine: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0' 
  },
  
  barsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 16,
  },
  dateGroup: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    justifyContent: 'center',
    gap: 2,
    position: 'absolute',
    bottom: 16,
  },
  bar: {
    width: 4,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  axisLabel: { fontSize: 10, color: '#64748B' },
  dateLabel: { fontSize: 9, color: '#64748B', position: 'absolute', bottom: 0, textAlign: 'center', width: '100%' },

  legend: { gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  legendDot: { width: 14, height: 14, borderRadius: 7 },
  legendText: { fontSize: 13, fontWeight: '500', color: '#1F2937' },
});