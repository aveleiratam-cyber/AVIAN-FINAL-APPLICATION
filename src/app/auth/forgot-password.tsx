import { router } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const emailIsValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleResetPassword = () => {
    setEmailTouched(true);

    if (!email.trim() || !emailIsValid) {
      return;
    }

        router.push({
    pathname: '/auth/verify-code' as any,
    params: {
        email: email.trim(),
    },
    });
  };

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
        <Text style={styles.title}>Forgot password</Text>

        <Text style={styles.description}>
          Please enter your email to reset the password
        </Text>

        {/* EMAIL */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>

          <View
            style={[
              styles.inputWrapper,
              emailTouched &&
                (!email.trim() || !emailIsValid) &&
                styles.inputError,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color="#AAAAAA"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your Email"
              placeholderTextColor="#AAAAAA"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(text) => {
                setEmail(text);

                if (text.trim()) {
                  setEmailTouched(false);
                }
              }}
              onBlur={() => setEmailTouched(true)}
            />
          </View>

          {emailTouched && !email.trim() && (
            <Text style={styles.errorText}>
              Email is required
            </Text>
          )}

          {emailTouched &&
            email.trim() &&
            !emailIsValid && (
              <Text style={styles.errorText}>
                Please enter a valid email address
              </Text>
            )}
        </View>

        {/* RESET PASSWORD */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetPassword}
          activeOpacity={0.8}
        >
          <Text style={styles.resetButtonText}>
            Reset Password
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 30,
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
    color: '#666666',
    marginTop: 7,
    marginBottom: 20,
  },

  inputGroup: {
    width: '100%',
  },

  label: {
    fontSize: 11,
    color: '#999999',
    marginLeft: 5,
    marginBottom: 4,
  },

  inputWrapper: {
    height: 44,
    borderWidth: 1.5,
    borderColor: '#008C2B',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },

  inputError: {
    borderColor: '#FF3B30',
  },

  input: {
    flex: 1,
    marginLeft: 9,
    height: '100%',
    fontSize: 13,
    color: '#333333',
  },

  errorText: {
    color: '#FF3B30',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 2,
  },

  resetButton: {
    height: 45,
    backgroundColor: '#15803D',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },

  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});