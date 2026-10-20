import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Low Water Level!', subtitle: 'Drinker 1 - 10:05 AM', type: 'Unread', important: true },
    { id: '2', title: 'High Ammonia!', subtitle: 'Brooder 1 - 09:50 AM', type: 'Unread', important: true },
    { id: '3', title: 'Device Offline', subtitle: 'Feeder 2 - 09:40 AM', type: 'Read', important: false },
  ]);

  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'Unread') return item.type === 'Unread';
    if (activeTab === 'Important') return item.important === true;
    return true; 
  });

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(item => ({ ...item, type: 'Read' }))
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* SafeAreaView */}
      <SafeAreaView style={styles.safeArea}>
        {/* Header na may Back Arrow at Pamagat */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification</Text>
        </View>
      </SafeAreaView>

      {/* Tab Filters (All, Unread, Important) */}
      <View style={styles.tabContainer}>
        {['All', 'Unread', 'Important'].map(tab => (
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

      {/* List of Notifications */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredNotifications.map(item => (
          <View key={item.id} style={styles.card}>
            <Text style={[styles.cardTitle, item.type === 'Unread' && styles.unreadTitle]}>
              {item.title}
            </Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Mark all as read Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.markButton} activeOpacity={0.8} onPress={handleMarkAllAsRead}>
          <Text style={styles.markButtonText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    // Nagdagdag ng tamang padding depende kung Android o iOS para hindi sumabit sa status bar
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14, // Pinalaki nang konti para mas maluwag tingnan
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#0284C7',
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  markButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  markButtonText: {
    color: '#16A34A',
    fontSize: 15,
    fontWeight: 'bold',
  },
});