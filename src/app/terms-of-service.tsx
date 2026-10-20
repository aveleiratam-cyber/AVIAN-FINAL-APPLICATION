import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  FileText,
} from 'lucide-react-native';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const terms = [
  {
    title: '1. Acceptance of Terms',
    text: 'By using A.V.I.A.N., you confirm that you have read, understood, and agreed to these Terms and Conditions. If you do not agree, please do not use the system.',
  },
  {
    title: '2. Purpose of the System',
    text: 'A.V.I.A.N. is an IoT-based monitoring and automation system designed to monitor ammonia levels and environmental conditions in poultry areas and help automatically manage ventilation.',
  },
  {
    title: '3. System Monitoring',
    text: `A.V.I.A.N. may monitor:

• Ammonia (NH₃) levels
• Temperature
• Humidity
• Air quality
• Ventilation status
• Other connected environmental sensors

Sensor readings may vary depending on sensor condition, placement, calibration, and environmental factors.`,
  },
  {
    title: '4. Automatic Ventilation',
    text: 'A.V.I.A.N. may automatically activate or deactivate connected ventilation devices based on configured thresholds and sensor readings. Users should regularly check that fans and other connected equipment are functioning properly.',
  },
  {
    title: '5. Mobile Application',
    text: `The A.V.I.A.N. mobile application allows authorized users to:

• View real-time environmental data
• Monitor ammonia levels
• Check ventilation status
• Receive alerts and notifications
• View historical data and trends
• Control supported devices when manual control is available`,
  },
  {
    title: '6. Alerts and Notifications',
    text: 'The system may send notifications when critical conditions are detected, such as high ammonia, high temperature, high humidity, poor air quality, or device failure.\n\nUsers are responsible for reviewing alerts and taking appropriate action when necessary.',
  },
  {
    title: '7. User Account',
    text: `Users are responsible for:

• Providing accurate account information.
• Keeping their password confidential.
• Protecting their account from unauthorized access.
• Reporting suspected unauthorized access or security problems.`,
  },
  {
    title: '8. Equipment and Maintenance',
    text: 'Users are responsible for properly installing and maintaining sensors, controllers, fans, and other connected equipment. Sensors should be checked and calibrated when necessary to maintain reliable readings.',
  },
  {
    title: '9. Internet and Power Requirements',
    text: 'Some A.V.I.A.N. features require Internet connectivity and electrical power. Network interruptions, power outages, or equipment failures may temporarily affect monitoring, notifications, or remote control.',
  },
  {
    title: '10. Data and Privacy',
    text: 'A.V.I.A.N. may collect and store information such as user account details, sensor readings, environmental data, alerts, device status, and system history to provide monitoring and automation services.',
  },
  {
    title: '11. User Responsibilities',
    text: `Users should:

• Regularly check the poultry environment.
• Respond promptly to critical alerts.
• Maintain sensors and ventilation equipment.
• Use the system according to its intended purpose.
• Ensure that automatic controls are configured appropriately.`,
  },
  {
    title: '12. Safety',
    text: 'A.V.I.A.N. is designed to assist with environmental monitoring and ventilation. Users should not rely solely on the system for poultry safety or environmental management. Manual inspection and appropriate farm safety procedures should still be followed.',
  },
  {
    title: '13. Limitation of Liability',
    text: 'A.V.I.A.N. is a monitoring and automation tool. The developers are not responsible for losses, poultry health problems, equipment damage, or other consequences resulting from incorrect sensor readings, equipment failure, improper installation, power or Internet interruption, incorrect configuration, or failure to respond to alerts.',
  },
  {
    title: '14. Prohibited Use',
    text: `Users must not:

• Attempt to damage or disable A.V.I.A.N.
• Access another user's account without permission.
• Manipulate sensor or system data.
• Bypass security controls.
• Use the system for illegal or harmful activities.`,
  },
  {
    title: '15. System Updates',
    text: 'A.V.I.A.N. may be updated to improve security, performance, monitoring accuracy, automation, and functionality. Features may be modified or added when necessary.',
  },
  {
    title: '16. Account Suspension or Termination',
    text: 'Access to A.V.I.A.N. may be suspended or terminated if a user violates these Terms and Conditions, misuses the system, or attempts to compromise its security.',
  },
  {
    title: '17. Changes to the Terms',
    text: 'These Terms and Conditions may be updated when necessary. Users will be informed of significant changes through the application or other appropriate communication channels.',
  },
  {
    title: '18. Contact and Support',
    text: 'For technical problems, account concerns, or questions about A.V.I.A.N., users may contact the system administrator or use the Help & Support section of the application.',
  },
  {
    title: '19. Agreement',
    text: 'By selecting “I Agree”, creating an account, or continuing to use A.V.I.A.N., you acknowledge that you have read and agreed to these Terms and Conditions.',
  },
];

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <FileText size={20} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Terms of Service</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Terms Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.introTitle}>A.V.I.A.N. Terms of Service</Text>

        <Text style={styles.introText}>
          Please read these Terms and Conditions carefully before using
          A.V.I.A.N.
        </Text>

        {terms.map((section) => (
          <View key={section.title} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <Text style={styles.sectionText}>
              {section.text}
            </Text>
          </View>
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    height: 58,
    backgroundColor: '#15803D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  headerSpacer: {
    width: 40,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },

  introText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
    marginBottom: 16,
  },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  sectionText: {
    fontSize: 13,
    lineHeight: 21,
    color: '#334155',
  },

  bottomSpace: {
    height: 20,
  },
});