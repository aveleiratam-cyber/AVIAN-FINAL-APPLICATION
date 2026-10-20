import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  Lock,
  LogOut,
  ShieldCheck,
} from 'lucide-react-native';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PrivacySecurityScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to sign out from your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => router.replace('/auth/login'),
        },
      ]
    );
  };

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

        <Text style={styles.headerTitle}>Privacy & Security</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Account Security Section */}
        <Text style={styles.sectionTitle}>Account Security</Text>

        <View style={styles.cardGroup}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/change-password')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <Lock size={20} color="#0F172A" />
              </View>

              <View>
                <Text style={styles.menuTitle}>Change Password</Text>
                <Text style={styles.menuSubtitle}>
                  Update your account password
                </Text>
              </View>
            </View>

            <ChevronRight size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Privacy Section */}
        <Text style={styles.sectionTitle}>Privacy</Text>

        <View style={styles.cardGroup}>
          {/* Privacy Policy */}
          <TouchableOpacity 
            style={styles.menuItem} 
            activeOpacity={0.7}
            onPress={() => router.push('/privacy-policy')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <ShieldCheck size={20} color="#0F172A" />
              </View>

              <View>
                <Text style={styles.menuTitle}>Privacy Policy</Text>
                <Text style={styles.menuSubtitle}>
                  Learn how we collect and protect your data
                </Text>
              </View>
            </View>

            <ChevronRight size={18} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Terms of Service */}
          <TouchableOpacity 
            style={styles.menuItem} 
            activeOpacity={0.7}
            onPress={() => router.push('/terms-and-conditions')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <FileText size={20} color="#0F172A" />
              </View>

              <View>
                <Text style={styles.menuTitle}>Terms of Service</Text>
                <Text style={styles.menuSubtitle}>
                  Read the terms of using A.V.I.A.N.
                </Text>
              </View>
            </View>

            <ChevronRight size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Log Out Section */}
        <View style={styles.cardGroup}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <LogOut size={20} color="#DC2626" />
              </View>

              <Text
                style={[
                  styles.menuTitle,
                  {
                    color: '#DC2626',
                    fontWeight: 'bold',
                  },
                ]}
              >
                Log Out
              </Text>
            </View>

            <ChevronRight size={18} color="#64748B" />
          </TouchableOpacity>
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
    backgroundColor: '#15803D',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginRight: 12,
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

  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginTop: 4,
  },

  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },

  menuSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 62,
  },
});