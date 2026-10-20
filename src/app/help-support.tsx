import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Headphones,
  MessageSquare,
  Search,
} from 'lucide-react-native';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HelpSupportScreen() {
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

        <Text style={styles.headerTitle}>Help & Support</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Support Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.leftMessage}>
            <MessageSquare
              size={48}
              color="#7DBE84"
              fill="#7DBE84"
            />
          </View>

          <View style={styles.headsetContainer}>
            <Headphones
              size={82}
              color="#15803D"
              strokeWidth={2.5}
            />
          </View>

          <View style={styles.rightMessage}>
            <MessageSquare
              size={48}
              color="#7DBE84"
              fill="#7DBE84"
            />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.helpTitle}>How can I help you?</Text>

        <Text style={styles.helpSubtitle}>
          Find solution or contact support
        </Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search
            size={18}
            color="#64748B"
            strokeWidth={1.5}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search help..."
            placeholderTextColor="#94A3B8"
            returnKeyType="search"
          />
        </View>
      </View>
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
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  headerSpacer: {
    width: 40,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  illustrationContainer: {
    width: '100%',
    height: 132,
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  headsetContainer: {
    width: 92,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftMessage: {
    position: 'absolute',
    left: 68,
    top: 20,
  },

  rightMessage: {
    position: 'absolute',
    right: 66,
    top: 42,
  },

  helpTitle: {
    marginTop: 7,
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },

  helpSubtitle: {
    marginTop: 5,
    fontSize: 9,
    color: '#8A8A8A',
  },

  searchContainer: {
    width: '100%',
    height: 29,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#C7C7C7',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    paddingVertical: 0,
    fontSize: 10,
    color: '#334155',
  },
});