import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabase';

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otpCode, setOtpCode] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [otpTouched, setOtpTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const passwordHasMinLength = password.length >= 8;
  const passwordHasUppercase = /[A-Z]/.test(password);
  const passwordHasLowercase = /[a-z]/.test(password);
  const passwordHasNumber = /[0-9]/.test(password);
  const passwordHasSpecial = /[^A-Za-z0-9]/.test(password);

  const passwordIsValid =
    passwordHasMinLength &&
    passwordHasUppercase &&
    passwordHasLowercase &&
    passwordHasNumber &&
    passwordHasSpecial;

  const handleContinue = async () => {
    setOtpTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    if (!otpCode.trim() || otpCode.length !== 6) {
      Alert.alert('Validation Error', 'Please enter the valid 6-digit code sent to your email.');
      return;
    }

    if (
      !passwordIsValid ||
      !confirmPassword ||
      password !== confirmPassword
    ) {
      return;
    }

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email || '',
        token: otpCode.trim(),
        type: 'recovery',
      });

      if (verifyError) {
        Alert.alert('Verification Failed', verifyError.message);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        Alert.alert('Update Failed', updateError.message);
        return;
      }

      Alert.alert('Success', 'Your password has been reset successfully.', [
        { text: 'Log In', onPress: () => router.replace('/auth/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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

        <Text style={styles.title}>
          Set a new password
        </Text>

        <Text style={styles.description}>
          Enter the 6-digit code sent to {email || 'your email'} and create a new secure password.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>6-Digit OTP Code</Text>

          <View
            style={[
              styles.inputWrapper,
              otpTouched && !otpCode.trim() && styles.inputError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="123456"
              placeholderTextColor="#AAAAAA"
              keyboardType="number-pad"
              maxLength={6}
              value={otpCode}
              onChangeText={setOtpCode}
              onBlur={() => setOtpTouched(true)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {otpTouched && !otpCode.trim() && (
            <Text style={styles.errorText}>OTP code is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>

          <View
            style={[
              styles.inputWrapper,
              passwordTouched &&
                !passwordIsValid &&
                styles.inputError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#AAAAAA"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordTouched(true);
              }}
              onBlur={() => setPasswordTouched(true)}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              onPress={() =>
                setPasswordVisible(!passwordVisible)
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  passwordVisible
                    ? 'eye-outline'
                    : 'eye-off-outline'
                }
                size={20}
                color="#AAAAAA"
              />
            </TouchableOpacity>
          </View>

          {passwordTouched && (
            <View style={styles.requirements}>
              <Text style={styles.requirementTitle}>
                Password must contain:
              </Text>

              <Text
                style={[
                  styles.requirement,
                  passwordHasMinLength &&
                    styles.requirementValid,
                ]}
              >
                {passwordHasMinLength ? '✓' : '○'} At least 8
                characters
              </Text>

              <Text
                style={[
                  styles.requirement,
                  passwordHasUppercase &&
                    styles.requirementValid,
                ]}
              >
                {passwordHasUppercase ? '✓' : '○'} At least 1
                uppercase letter
              </Text>

              <Text
                style={[
                  styles.requirement,
                  passwordHasLowercase &&
                    styles.requirementValid,
                ]}
              >
                {passwordHasLowercase ? '✓' : '○'} At least 1
                lowercase letter
              </Text>

              <Text
                style={[
                  styles.requirement,
                  passwordHasNumber &&
                    styles.requirementValid,
                ]}
              >
                {passwordHasNumber ? '✓' : '○'} At least 1
                number
              </Text>

              <Text
                style={[
                  styles.requirement,
                  passwordHasSpecial &&
                    styles.requirementValid,
                ]}
              >
                {passwordHasSpecial ? '✓' : '○'} At least 1
                special character
              </Text>
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View
            style={[
              styles.inputWrapper,
              confirmPasswordTouched &&
                (!confirmPassword ||
                  password !== confirmPassword) &&
                styles.inputError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#AAAAAA"
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={() =>
                setConfirmPasswordTouched(true)
              }
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              onPress={() =>
                setConfirmPasswordVisible(
                  !confirmPasswordVisible
                )
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  confirmPasswordVisible
                    ? 'eye-outline'
                    : 'eye-off-outline'
                }
                size={20}
                color="#AAAAAA"
              />
            </TouchableOpacity>
          </View>

          {confirmPasswordTouched &&
            !confirmPassword && (
              <Text style={styles.errorText}>
                Confirm Password is required
              </Text>
            )}

          {confirmPasswordTouched &&
            confirmPassword &&
            password !== confirmPassword && (
              <Text style={styles.errorText}>
                Passwords do not match
              </Text>
            )}
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>
            Continue
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
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 15,
    marginBottom: 7,
  },
  inputWrapper: {
    height: 44,
    borderWidth: 1.5,
    borderColor: '#15803D',
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
    height: '100%',
    fontSize: 13,
    color: '#333333',
  },
  requirements: {
    marginTop: 5,
    marginLeft: 15,
  },
  requirementTitle: {
    fontSize: 11,
    color: '#777777',
    fontWeight: '600',
    marginBottom: 2,
  },
  requirement: {
    fontSize: 10,
    color: '#FF3B30',
    marginTop: 1,
  },
  requirementValid: {
    color: '#15803D',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 15,
  },
  continueButton: {
    height: 45,
    backgroundColor: '#15803D',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});