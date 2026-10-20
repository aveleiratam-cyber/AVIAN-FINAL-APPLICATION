import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

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

        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      {/* Privacy Policy Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          This Privacy Policy explains how A.V.I.A.N. collects, uses, and
          protects information when you use the system and mobile application.
        </Text>

        {/* 1 */}
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.bodyText}>
          A.V.I.A.N. may collect and store information needed to provide
          monitoring and automation services, including:
        </Text>

        <Text style={styles.bullet}>
          • User account information
        </Text>
        <Text style={styles.bullet}>
          • Sensor readings
        </Text>
        <Text style={styles.bullet}>
          • Environmental data
        </Text>
        <Text style={styles.bullet}>
          • Alerts and notifications
        </Text>
        <Text style={styles.bullet}>
          • Device status
        </Text>
        <Text style={styles.bullet}>
          • System history
        </Text>

        {/* 2 */}
        <Text style={styles.sectionTitle}>
          2. Environmental and Sensor Data
        </Text>
        <Text style={styles.bodyText}>
          A.V.I.A.N. may monitor environmental information from connected
          sensors, such as ammonia levels, temperature, humidity, air quality,
          and ventilation status.
        </Text>

        <Text style={styles.bodyText}>
          Sensor readings may vary depending on sensor condition, placement,
          calibration, and environmental factors.
        </Text>

        {/* 3 */}
        <Text style={styles.sectionTitle}>3. How We Use Information</Text>
        <Text style={styles.bodyText}>
          Information collected by A.V.I.A.N. may be used to:
        </Text>

        <Text style={styles.bullet}>
          • Provide environmental monitoring
        </Text>
        <Text style={styles.bullet}>
          • Monitor ammonia and other environmental conditions
        </Text>
        <Text style={styles.bullet}>
          • Monitor ventilation status
        </Text>
        <Text style={styles.bullet}>
          • Send alerts and notifications
        </Text>
        <Text style={styles.bullet}>
          • Support automatic ventilation functions
        </Text>
        <Text style={styles.bullet}>
          • Display historical data and system trends
        </Text>
        <Text style={styles.bullet}>
          • Support account and system management
        </Text>

        {/* 4 */}
        <Text style={styles.sectionTitle}>4. Account Information</Text>
        <Text style={styles.bodyText}>
          Users may provide account information when creating or using an
          A.V.I.A.N. account.
        </Text>

        <Text style={styles.bodyText}>
          Users are responsible for keeping their account information accurate
          and protecting their password and account from unauthorized access.
        </Text>

        {/* 5 */}
        <Text style={styles.sectionTitle}>5. Alerts and Notifications</Text>
        <Text style={styles.bodyText}>
          A.V.I.A.N. may use collected environmental and device information to
          provide alerts when critical conditions are detected.
        </Text>

        <Text style={styles.bodyText}>
          These conditions may include high ammonia, high temperature, high
          humidity, poor air quality, or device failure.
        </Text>

        {/* 6 */}
        <Text style={styles.sectionTitle}>6. System and Device Information</Text>
        <Text style={styles.bodyText}>
          A.V.I.A.N. may store information related to connected devices,
          ventilation status, sensor readings, alerts, and system history to
          support monitoring and automation functions.
        </Text>

        {/* 7 */}
        <Text style={styles.sectionTitle}>7. Data Protection</Text>
        <Text style={styles.bodyText}>
          A.V.I.A.N. is designed to protect information used by the system.
          Users should also protect their account credentials and report any
          suspected unauthorized access or security concerns.
        </Text>

        {/* 8 */}
        <Text style={styles.sectionTitle}>8. Internet and Power Interruptions</Text>
        <Text style={styles.bodyText}>
          Some A.V.I.A.N. features require Internet connectivity and electrical
          power. Network interruptions, power outages, or equipment failures
          may temporarily affect monitoring, notifications, or remote control.
        </Text>

        {/* 9 */}
        <Text style={styles.sectionTitle}>9. Data Accuracy</Text>
        <Text style={styles.bodyText}>
          Environmental and sensor information displayed by A.V.I.A.N. depends
          on connected equipment and sensor conditions. Users should be aware
          that readings may be affected by sensor placement, calibration,
          equipment condition, and environmental factors.
        </Text>

        {/* 10 */}
        <Text style={styles.sectionTitle}>10. User Responsibilities</Text>
        <Text style={styles.bodyText}>
          Users are responsible for:
        </Text>

        <Text style={styles.bullet}>
          • Protecting their account credentials
        </Text>
        <Text style={styles.bullet}>
          • Reporting suspected unauthorized access
        </Text>
        <Text style={styles.bullet}>
          • Maintaining connected sensors and equipment
        </Text>
        <Text style={styles.bullet}>
          • Reviewing important alerts and notifications
        </Text>
        <Text style={styles.bullet}>
          • Using A.V.I.A.N. according to its intended purpose
        </Text>

        {/* 11 */}
        <Text style={styles.sectionTitle}>11. Changes to This Privacy Policy</Text>
        <Text style={styles.bodyText}>
          This Privacy Policy may be updated when necessary to reflect changes
          to A.V.I.A.N., its features, security, monitoring functions, or data
          practices.
        </Text>

        <Text style={styles.bodyText}>
          Users may be informed of significant changes through the application
          or other appropriate communication channels.
        </Text>

        {/* 12 */}
        <Text style={styles.sectionTitle}>12. Contact and Support</Text>
        <Text style={styles.bodyText}>
          For questions about privacy, account information, or the handling of
          information within A.V.I.A.N., users may contact the system
          administrator or use the Help & Support section of the application.
        </Text>

        {/* Last Updated */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using A.V.I.A.N., you acknowledge that you have read and
            understood this Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    height: 70,
    backgroundColor: '#15803D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  intro: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 18,
    marginBottom: 8,
  },

  bodyText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 10,
  },

  bullet: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginLeft: 8,
    marginBottom: 4,
  },

  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  footerText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
    textAlign: 'center',
  },
});