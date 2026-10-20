import { router } from 'expo-router';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PasswordResetSuccessScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* BACK */}
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#222222"
          />
        </TouchableOpacity>

        {/* TITLE */}
        <Text style={styles.title}>Password reset</Text>

        <Text style={styles.description}>
          Your password has been successfully reset.
          {'\n'}
          click confirm to set a new password
        </Text>

        {/* CONFIRM */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() =>
            router.push('/auth/reset-password')
          }
          activeOpacity={0.8}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },

  backButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 5,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
    marginTop: 2,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#555555',
    marginTop: 7,
  },

  confirmButton: {
    height: 45,
    backgroundColor: '#39B537',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});