import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, ChevronUp, Search } from 'lucide-react-native';
import { useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  {
    question: "What is A.V.I.A.N.?",
    answer: "A.V.I.A.N. is an IoT-based smart poultry monitoring and automation system designed to monitor ammonia levels, temperature, humidity, and other environmental conditions inside a poultry house or brooder."
  },
  {
    question: "What is the main purpose of A.V.I.A.N.?",
    answer: "The main purpose of A.V.I.A.N. is to maintain a healthy and comfortable poultry environment by continuously monitoring air quality and automatically controlling ventilation when necessary."
  },
  {
    question: "What does A.V.I.A.N. monitor?",
    answer: "The system can monitor:\n• Temperature\n• Humidity\n• Ammonia (NH3) levels\n• Air Quality\n• Poultry environmental conditions\n• Ventilation system status"
  },
  {
    question: "How does the ammonia monitoring work?",
    answer: "An ammonia sensor measures the NH3 concentration in the poultry environment. When the ammonia level reaches a configured threshold, the system can send an alert and activate ventilation."
  },
  {
    question: "What happens when ammonia levels become too high?",
    answer: "When the ammonia level exceeds the safe threshold, A.V.I.A.N. can:\n1. Detect the high ammonia level.\n2. Activate the ventilation fan automatically.\n3. Send an alert to the user's mobile application.\n4. Continue monitoring until the environment returns to an acceptable level."
  },
  {
    question: "Can A.V.I.A.N. control ventilation automatically?",
    answer: "Yes, A.V.I.A.N. uses IoT automation to control connected ventilation fans based on sensor readings and configured thresholds."
  },
  {
    question: "Can I monitor the system using mobile app?",
    answer: "Yes. The mobile application allows users to view real-time environmental readings, ventilation status, alerts, and historical data."
  },
  {
    question: "Will I receive notification?",
    answer: "Yes. The app can provide real-time notifications when critical conditions are detected such as:\n• High ammonia\n• High temperature\n• High humidity\n• Poor air quality\n• Device or system problems"
  },
  {
    question: "Can I manually control the ventilation fans?",
    answer: "Yes. If manual control is enabled, users can turn connected fans On or Off through the mobile applications."
  },
  {
    question: "What is automatic mode?",
    answer: "In Automatic Mode, the system makes ventilation decisions based on sensor readings and predefined thresholds. This reduces the need for constant manual monitoring."
  },
  {
    question: "What is manual mode?",
    answer: "In Manual Mode, the user can directly control connected ventilation devices through the A.V.I.A.N. mobile application."
  },
  {
    question: "Can I view historical environmental data?",
    answer: "Yes. A.V.I.A.N. stores environmental readings, so users can view trends and historical data for temperature, humidity, ammonia, and other monitored conditions."
  },
  {
    question: "What happens if the Internet connection is lost?",
    answer: "Real-time cloud monitoring and remote notifications may temporarily become unavailable. Depending on the system configuration, local monitoring and automatic controls can continue operating."
  },
  {
    question: "Can A.V.I.A.N. help improve poultry health?",
    answer: "Yes. By detecting poor environmental conditions early and improving ventilation, A.V.I.A.N. can help maintain a healthier environment for poultry."
  },
  {
    question: "Does A.V.I.A.N. replace a poultry expert or veterinarian?",
    answer: "No. A.V.I.A.N. is a monitoring and automation tool. It helps users identify environmental problems but does not replace professional veterinary advice."
  },
  {
    question: "Who can use A.V.I.A.N.?",
    answer: "A.V.I.A.N. can used by:\n• Poultry farmers\n• Farm owners\n• Poultry house operators\n• Farm workers\n• Agricultural monitoring personnel"
  },
  {
    question: "What are the main benefits of A.V.I.A.N.?",
    answer: "A.V.I.A.N. help users:\n• Detect high ammonia levels early\n• Improve ventilation\n• Monitor environmental conditions in real time\n• Receive instant alerts\n• Reduce manual monitoring\n• Automate ventilation\n• Analyze environmental trends\n• Support better poultry management"
  },
  {
    question: "Is my data stored securely?",
    answer: "The system is designed to securely store sensor readings, user information, alerts, and historical data using appropriate access controls and data-protection measures."
  },
  {
    question: "Can I manage my account through the app?",
    answer: "Yes. Users can access Profile and Settings to manage account information, notifications preferences, security, and other application settings."
  },
  {
    question: "What should I do if the system detects high ammonia?",
    answer: "Users should check the poultry environment and ventilation equipment immediately. The automatic ventilation system can help reduce ammonia, but users should also investigate possible causes such as poor ventilation, accumulated waste, or other environmental problems."
  }
];

export default function FAQScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filteredFaqs = FAQ_DATA.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={styles.headerTitle}>FAQ</Text>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search question"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Search size={18} color="#94A3B8" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredFaqs.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.faqCard, isExpanded && styles.faqCardExpanded]}
              activeOpacity={0.8}
              onPress={() => toggleExpand(index)}
            >
              <View style={styles.questionRow}>
                <Text style={[styles.questionText, isExpanded && styles.questionTextExpanded]}>
                  {item.question}
                </Text>
                {isExpanded ? (
                  <ChevronUp size={18} color="#0F172A" />
                ) : (
                  <ChevronDown size={18} color="#0F172A" />
                )}
              </View>

              {isExpanded && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
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
  searchWrapper: { padding: 16, backgroundColor: '#FFFFFF' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    height: 44,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0F172A' },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  faqCardExpanded: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    flex: 1,
    paddingRight: 10,
  },
  questionTextExpanded: {
    fontWeight: 'bold',
  },
  answerContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  answerText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
});