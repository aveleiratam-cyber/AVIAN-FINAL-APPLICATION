import { router } from 'expo-router';
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
  const [passwordVisible, setPasswordVisible] =
    useState(false);

  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordTouched, setPasswordTouched] =
    useState(false);

  const [confirmPasswordTouched, setConfirmPasswordTouched] =
    useState(false);

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
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    if (
      !passwordIsValid ||
      !confirmPassword ||
      password !== confirmPassword
    ) {
      return;
    }

    try {
      // Update the user's password via Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        Alert.alert('Update Failed', error.message);
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
        <Text style={styles.title}>
          Set a new password
        </Text>

        <Text style={styles.description}>
          Create a new password. Ensure it differs form
          {'\n'}previous ones for security
        </Text>

        {/* PASSWORD */}
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

          {/* REQUIREMENTS */}
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

        {/* CONFIRM PASSWORD */}
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

        {/* CONTINUE */}
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
    marginBottom: 28,
  },

  inputGroup: {
    marginBottom: 17,
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
    marginTop: 2,
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});