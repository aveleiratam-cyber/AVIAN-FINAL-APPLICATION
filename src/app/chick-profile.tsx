import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ChickProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('Overview');

  // Kunin ang mga detalye at ang imahe na ipinasa mula sa checklist
  const chickId = params?.id || 'CHK-0233';
  const chickDays = params?.days || '7 days';
  const chickWeight = params?.weight || '124 g';
  const chickStatus = params?.status || 'At Risk';
  const chickScore = params?.score || '61%';
  
  // Dito kinukuha ang online image URL na ipinasa; kung wala, gagamit ng default
  const chickImage = params?.image || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=300&auto=format&fit=crop';

  const getStatusColor = (status: any) => {
    if (status === 'Healthy') return '#2E7D32';
    if (status === 'At Risk') return '#E65100';
    if (status === 'Sick') return '#DC2626';
    return '#333';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F4" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chickId}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Chick Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.imageContainer}>
            {/* Dito na ipinapakita ang online image ng partikular na sisiw */}
            <Image
              source={{ uri: chickImage as string }}
              style={styles.chickImage}
            />
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Age</Text>
              <Text style={styles.detailValue}>{chickDays}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weight</Text>
              <Text style={styles.detailValue}>{chickWeight}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Health Score</Text>
              <Text style={styles.healthScoreText}>
                {chickScore}{' '}
                <Text style={[styles.riskText, { color: getStatusColor(chickStatus) }]}>
                  ({chickStatus})
                </Text>
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[styles.statusText, { color: getStatusColor(chickStatus) }]}>
                {chickStatus}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last Check</Text>
              <Text style={styles.detailValue}>10:30 AM</Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {['Overview', 'Health Details', 'History'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Health Score Graph Section */}
        <View style={styles.cardBox}>
          <Text style={styles.cardTitle}>Health Score (This Week)</Text>
          
          <View style={styles.graphContainer}>
            <View style={styles.gridLine}><Text style={styles.gridText}>100</Text></View>
            <View style={styles.gridLine}><Text style={styles.gridText}>75</Text></View>
            <View style={styles.gridLine}><Text style={styles.gridText}>25</Text></View>
            <View style={styles.gridLine}><Text style={styles.gridText}>0</Text></View>

            <View style={styles.chartFooter}>
              {['7/30', '7/31', '8/1', '8/2', '8/3', '8/4'].map((date, index) => (
                <View key={index} style={styles.dateCol}>
                  <View style={styles.chartDot} />
                  <Text style={styles.dateText}>{date}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Key Indicators Section */}
        <View style={styles.cardBox}>
          <Text style={styles.cardTitle}>Key Indicators</Text>
          
          {[
            { label: 'Activity Level', status: 'Normal' },
            { label: 'Posture', status: 'Normal' },
            { label: 'Feather Condition', status: 'Normal' },
            { label: 'Eyes & Beek', status: 'Normal' },
            { label: 'Respiratory', status: 'Normal' },
          ].map((item, idx) => (
            <View key={idx} style={styles.indicatorRow}>
              <Text style={styles.indicatorLabel}>{item.label}</Text>
              <Text style={styles.indicatorStatus}>{item.status}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 46 : 38,
    paddingBottom: 16,
    backgroundColor: '#F4F7F4',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#4A7C59',
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  imageContainer: {
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#C8E6C9',
    paddingRight: 10,
  },
  chickImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
  detailsContainer: {
    width: '55%',
    paddingLeft: 12,
  },
  detailRow: {
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#8C8C8C',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  healthScoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1F2937',
    fontWeight: 'bold',
  },
  cardBox: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#4A7C59',
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A3B32',
    marginBottom: 15,
  },
  graphContainer: {
    height: 140,
    justifyContent: 'space-between',
    paddingBottom: 22,
  },
  gridLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 2,
  },
  gridText: {
    fontSize: 10,
    color: '#999',
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: -2,
    left: 4,
    right: 4,
  },
  dateCol: {
    alignItems: 'center',
    width: 35,
  },
  chartDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 9,
    color: '#666',
    textAlign: 'center',
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  indicatorLabel: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  indicatorStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
  },
});