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
        {/* TITLE */}
        <Text style={styles.title}>Password reset</Text>

        <Text style={styles.description}>
          Your password has been successfully reset.{'\n'}
          You can now log in with your new password.
        </Text>

        {/* CONFIRM / GO TO LOGIN */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() =>
            router.replace('/auth/login')
          }
          activeOpacity={0.8}
        >
          <Text style={styles.confirmText}>Go to Log In</Text>
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
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
    marginTop: 2,
    textAlign: 'center',
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#555555',
    marginTop: 7,
    textAlign: 'center',
  },

  confirmButton: {
    width: '100%',
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