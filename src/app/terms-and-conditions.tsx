import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TermsAndConditionsScreen() {
  const router = useRouter();

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By using A.V.I.A.N., you confirm that you have read, understood, and agreed to these Terms and Conditions. If you do not agree, please do not use the system."
    },
    {
      title: "2. Purpose of the System",
      content: "A.V.I.A.N. is an IoT-based monitoring and automation system designed to monitor ammonia levels and environmental conditions in poultry areas and help automatically manage ventilation."
    },
    {
      title: "3. System Monitoring",
      content: "A.V.I.A.N. may monitor:\n• Ammonia (NH₃) levels\n• Temperature\n• Humidity\n• Air quality\n• Ventilation status\n• Other connected environmental sensors\n\nSensor readings may vary depending on sensor condition, placement, calibration, and environmental factors."
    },
    {
      title: "4. Automatic Ventilation",
      content: "A.V.I.A.N. may automatically activate or deactivate connected ventilation devices based on configured thresholds and sensor readings. Users should regularly check that fans and other connected equipment are functioning properly."
    },
    {
      title: "5. Mobile Application",
      content: "The A.V.I.A.N. mobile application allows authorized users to:\n• View real-time environmental data\n• Monitor ammonia levels\n• Check ventilation status\n• Receive alerts and notifications\n• View historical data and trends\n• Control supported devices when manual control is available"
    },
    {
      title: "6. Alerts and Notifications",
      content: "The system may send notifications when critical conditions are detected, such as high ammonia, high temperature, high humidity, poor air quality, or device failure.\n\nUsers are responsible for reviewing alerts and taking appropriate action when necessary."
    },
    {
      title: "7. User Account",
      content: "Users are responsible for:\n• Providing accurate account information.\n• Keeping their password confidential.\n• Protecting their account from unauthorized access.\n• Reporting suspected unauthorized access or security problems."
    },
    {
      title: "8. Equipment and Maintenance",
      content: "Users are responsible for properly installing and maintaining sensors, controllers, fans, and other connected equipment. Sensors should be checked and calibrated when necessary to maintain reliable readings."
    },
    {
      title: "9. Internet and Power Requirements",
      content: "Some A.V.I.A.N. features require Internet connectivity and electrical power. Network interruptions, power outages, or equipment failures may temporarily affect monitoring, notifications, or remote control."
    },
    {
      title: "10. Data and Privacy",
      content: "A.V.I.A.N. may collect and store information such as user account details, sensor readings, environmental data, alerts, device status, and system history to provide monitoring and automation services."
    },
    {
      title: "11. User Responsibilities",
      content: "Users should:\n• Regularly check the poultry environment.\n• Respond promptly to critical alerts.\n• Maintain sensors and ventilation equipment.\n• Use the system according to its intended purpose.\n• Ensure that automatic controls are configured appropriately."
    },
    {
      title: "12. Safety",
      content: "A.V.I.A.N. is designed to assist with environmental monitoring and ventilation. Users should not rely solely on the system for poultry safety or environmental management. Manual inspection and appropriate farm safety procedures should still be followed."
    },
    {
      title: "13. Limitation of Liability",
      content: "A.V.I.A.N. is a monitoring and automation tool. The developers are not responsible for losses, poultry health problems, equipment damage, or other consequences resulting from incorrect sensor readings, equipment failure, improper installation, power or Internet interruption, incorrect configuration, or failure to respond to alerts."
    },
    {
      title: "14. Prohibited Use",
      content: "Users must not:\n• Attempt to damage or disable A.V.I.A.N.\n• Access another user's account without permission.\n• Manipulate sensor or system data.\n• Bypass security controls.\n• Use the system for illegal or harmful activities."
    },
    {
      title: "15. System Updates",
      content: "A.V.I.A.N. may be updated to improve security, performance, monitoring accuracy, automation, and functionality. Features may be modified or added when necessary."
    },
    {
      title: "16. Account Suspension or Termination",
      content: "Access to A.V.I.A.N. may be suspended or terminated if a user violates these Terms and Conditions, misuses the system, or attempts to compromise its security."
    },
    {
      title: "17. Changes to the Terms",
      content: "These Terms and Conditions may be updated when necessary. Users will be informed of significant changes through the application or other appropriate communication channels."
    },
    {
      title: "18. Contact and Support",
      content: "For technical problems, account concerns, or questions about A.V.I.A.N., users may contact the system administrator or use the Help & Support section of the application."
    },
    {
      title: "19. Agreement",
      content: "By selecting \"I Agree\", creating an account, or continuing to use A.V.I.A.N., you acknowledge that you have read and agreed to these Terms and Conditions."
    }
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#15803D" />
      
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainHeading}>A.V.I.A.N. Terms & Conditions</Text>
        <Text style={styles.subHeading}>Please review before continuing</Text>
        <Text style={styles.description}>Ammonia Ventilation and IoT Automation Network</Text>

        {sections.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.content}</Text>
          </View>
        ))}

        <TouchableOpacity 
          style={styles.cancelButton} 
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>OK</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    backgroundColor: '#15803D',
    paddingTop: Platform.OS === 'android' ? 45 : 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  mainHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#15803D',
  },
});