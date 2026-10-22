import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const emailError = !email.trim()
    ? 'Email is required'
    : !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim())
    ? 'Please enter a valid email address'
    : '';
  const passwordError = !password ? 'Password is required' : '';

  const handleLogin = async () => {
    console.log('1. Login pressed');
    setEmailTouched(true);
    setPasswordTouched(true);
    setLoginError('');

    if (emailError || passwordError) {
      console.log('2. Blocked by validation:', emailError, passwordError);
      return;
    }

    setLoading(true);
    try {
      console.log('3. Authenticating with Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw error;
      }

      console.log('4. Login successful, navigating to home');
      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.log('LOGIN ERROR:', error);
      
      if (error.message?.includes('Email not confirmed')) {
        setLoginError('Please verify your email address before logging in.');
      } else {
        setLoginError('Incorrect email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  GoogleSignin.configure({
    webClientId: '74998166671-fqust11v3h20vofp74tcrmu4osj006t1.apps.googleusercontent.com', 
    scopes: ['email', 'profile'],
  });

  const handleGoogleLogin = async () => {
    try {
      // 1. Clear cached session so the account picker opens fresh every time
      await GoogleSignin.signOut();

      // 2. Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // 3. Open Native Google Sign-In Modal
      const response = await GoogleSignin.signIn();

      const idToken = response.data?.idToken || (response as any).idToken;

      if (!idToken) {
        throw new Error('No ID token returned from Google.');
      }

      // 4. Authenticate directly with Supabase using the Google ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        Alert.alert('Google Sign In Failed', error.message);
        return;
      }

      if (data.session) {
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      } else if (error.code === statusCodes.IN_PROGRESS) {
        return;
      } else {
        Alert.alert('Error', error.message || 'An unexpected error occurred.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.logoSection}>
            <View style={styles.logoCrop}>
              <Image
                source={require('../../../assets/images/avian-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.subtitle}>
              Ammonia Ventilation and IoT Automation Network
            </Text>
          </View>

          {/* WELCOME MESSAGE */}
          <View style={styles.header}>
            <Text style={styles.welcome}>Welcome Back</Text>

            <Text style={styles.description}>
              Sign in to monitor Brooder system
            </Text>
          </View>

          {/* LOGIN CARD */}
          <View style={styles.loginCard}>
            {/* EMAIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>

              <View
                style={[
                  styles.inputWrapper,
                  emailTouched && !!emailError && styles.inputError,
                ]}
              >
                <Ionicons name="mail-outline" size={20} color="#AAAAAA" />

                <TextInput
                  placeholder={focusedField === 'email' ? '' : 'Enter your email'}
                  placeholderTextColor="#AAAAAA"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => {
                    setEmailTouched(true);
                    setFocusedField(null);
                  }}
                />
              </View>
              <View style={styles.errorSlot}>
                {emailTouched && !!emailError && (
                  <Text style={styles.errorText}>{emailError}</Text>
                )}
              </View>
            </View>

            {/* PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>

              <View
                style={[
                  styles.inputWrapper,
                  passwordTouched && !!passwordError && styles.inputError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#AAAAAA"
                />

                <TextInput
                  placeholder={focusedField === 'password' ? '' : 'Password'}
                  placeholderTextColor="#AAAAAA"
                  secureTextEntry={!passwordVisible}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => {
                    setPasswordTouched(true);
                    setFocusedField(null);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#AAAAAA"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.errorSlot}>
                {passwordTouched && !!passwordError && (
                  <Text style={styles.errorText}>{passwordError}</Text>
                )}
              </View>
            </View>

            {/* FORGOT PASSWORD */}
            <TouchableOpacity
              style={styles.forgotContainer}
              onPress={() => router.push('/auth/forgot-password')}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* LOGIN ERROR FROM SERVER */}
            <View style={styles.loginErrorSlot}>
              {!!loginError && (
                <Text style={[styles.errorText, styles.loginErrorText]}>
                  {loginError}
                </Text>
              )}
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginText}>
                {loading ? 'LOGGING IN...' : 'LOG IN'}
              </Text>
            </TouchableOpacity>

            {/* DIVIDER + GOOGLE LOGIN */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* SIGN UP */}
            <View style={styles.signupContainer}>
              <Text style={styles.noAccountText}>Don't have an account?</Text>

              <TouchableOpacity
                onPress={() => router.push('/auth/signup')}
                activeOpacity={0.7}
              >
                <Text style={styles.signup}> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingTop: 0,
    paddingBottom: 24,
  },
  logoSection: {
    alignItems: 'center',
  },
  logoCrop: {
    width: '100%',
    height: 220,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 460,
    height: 414,
  },
  subtitle: {
    marginTop: 0,
    paddingHorizontal: 5,
    textAlign: 'center',
    color: '#008C2B',
    fontSize: 14,
    lineHeight: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 10,
  },
  welcome: {
    fontSize: 30,
    fontWeight: '800',
    color: '#087A24',
    textAlign: 'center',
  },
  description: {
    marginTop: 6,
    color: '#8A8A8A',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  loginCard: {
    width: '100%',
    borderWidth: 3.5,
    borderColor: '#008C2B',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 14,
  },
  inputGroup: {
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 5,
    marginBottom: 5,
  },
  inputWrapper: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#D4D4D4',
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 9,
    paddingVertical: 0,
    fontSize: 14,
    color: '#333333',
  },
  errorSlot: {
    minHeight: 18,
    justifyContent: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 11,
    marginLeft: 5,
  },
  loginErrorSlot: {
    minHeight: 18,
    justifyContent: 'center',
    marginBottom: 4,
  },
  loginErrorText: {
    textAlign: 'center',
    marginLeft: 0,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  forgotPassword: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '700',
  },
  loginButton: {
    height: 48,
    backgroundColor: '#009B00',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 11,
    color: '#888888',
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#D4D4D4',
    borderRadius: 9,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  googleText: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  noAccountText: {
    color: '#333333',
    fontSize: 12,
  },
  signup: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '600',
  },
});