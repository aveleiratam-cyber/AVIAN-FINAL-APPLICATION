import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../../config/supabase';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
WebBrowser.maybeCompleteAuthSession();


export default function SignupScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState(false);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsViewed, setTermsViewed] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [termsScrolledToBottom, setTermsScrolledToBottom] =
    useState(false);

  // Account created pop-up
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // While the keyboard is open, the logo and extras are hidden so the
  // form still fits on the screen without scrolling.
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(hideEvent, () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [otpCode, setOtpCode] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);

  // Which input is being tapped right now (used to hide its placeholder text)
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Validation states
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] =
    useState(false);
  const [termsValidationTouched, setTermsValidationTouched] =
    useState(false);

  // ---------- VALIDATION RULES (one place) ----------
  const firstNameError = !firstName.trim() ? 'First Name is required' : '';
  const lastNameError = !lastName.trim() ? 'Last Name is required' : '';

  // Change the regex to /^\S+@\S+\.\S+$/ to allow any email provider.
  const emailError = !email.trim()
    ? 'Email is required'
    : !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim())
    ? 'Please enter a valid email address'
    : '';

  // Password rules
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

  // Shows the first rule that is still missing (one short line, saves space)
  const passwordMessage = !password
    ? 'Password is required'
    : !passwordHasMinLength
    ? 'Use at least 8 characters'
    : !passwordHasUppercase
    ? 'Add at least 1 uppercase letter'
    : !passwordHasLowercase
    ? 'Add at least 1 lowercase letter'
    : !passwordHasNumber
    ? 'Add at least 1 number'
    : !passwordHasSpecial
    ? 'Add at least 1 special character'
    : '';

  const confirmPasswordError = !confirmPassword
    ? 'Confirm Password is required'
    : password !== confirmPassword
    ? 'Passwords do not match'
    : '';

  const termsError = !termsViewed
    ? 'Please read and agree to the Terms of Service'
    : !agreedToTerms
    ? 'You must agree to the Terms of Service'
    : '';

  // Open Terms of Service
  const openTerms = () => {
    setTermsModalVisible(true);
    setTermsScrolledToBottom(false);
  };

  // Detect when user reaches the bottom of Terms
  const handleTermsScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } =
      event.nativeEvent;

    const isBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - 20;

    if (isBottom) {
      setTermsScrolledToBottom(true);
    }
  };

  // User agrees to the Terms
  const handleAgreeToTerms = () => {
    if (!termsScrolledToBottom) {
      return;
    }

    setTermsViewed(true);
    setTermsModalVisible(false);
    setTermsValidationTouched(false);
  };

  // Cancel Terms
  const handleCancelTerms = () => {
    setTermsModalVisible(false);
  };

  const goToLogin = () => {
    router.replace('/auth/login');
  };

  

  // Close the pop-up and proceed to the Login page
  const handleSuccessContinue = () => {
    setSuccessModalVisible(false);
    router.replace('/auth/login');
  };


  // OTP Verification Function
  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      Alert.alert('Error', 'Please enter the 6-digit verification code.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode.trim(),
        type: 'signup',
      });

      if (error) {
        Alert.alert('Verification Failed', error.message);
        return;
      }

      setOtpModalVisible(false);
      setSuccessModalVisible(true); 
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    }
  };

  const handleSignUp = async () => {
    setFirstNameTouched(true);
    setLastNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);
    setTermsValidationTouched(true);

    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      !passwordIsValid ||
      confirmPasswordError ||
      termsError
    ) {
      return;
    }

    try {
      const redirectTo = makeRedirectUri({
        scheme: 'avian', 
      });

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
        },
      });

      if (error) {
        Alert.alert('Sign Up Failed', error.message);
        return;
      }
  
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        Alert.alert(
          'Account Already Exists',
          'It seems like this credential already exists. Redirecting you to the log in page...',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/auth/login'),
            },
          ]
        );
        return;
      }

      console.log("Supabase signup successful, triggering OTP modal.");
      setOtpModalVisible(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    }
  };

  GoogleSignin.configure({
    webClientId: '74998166671-fqust11v3h20vofp74tcrmu4osj006t1.apps.googleusercontent.com', 
    scopes: ['email', 'profile'],
  });

  const handleGoogleSignUp = async () => {
    try {
      await GoogleSignin.signOut();

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const response = await GoogleSignin.signIn();

      const idToken = response.data?.idToken || (response as any).idToken;

      if (!idToken) {
        throw new Error('No ID token returned from Google.');
      }
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        Alert.alert('Google Sign In Failed', error.message);
        return;
      }

      if (data.session) {
        router.replace('/home');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
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
        {/* No ScrollView: everything fits on one screen */}
        <View style={styles.content}>
          {/* AVIAN LOGO (hidden while the keyboard is open) */}
          {!keyboardVisible && (
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
          )}

          {/* TITLE */}
          {!keyboardVisible && (
            <Text style={styles.title}>Create an account</Text>
          )}

          {/* FIRST NAME + LAST NAME (side by side) */}
          <View style={styles.nameRow}>
            <View style={styles.nameCol}>
              <Text style={styles.label}>First Name</Text>

              <TextInput
                style={[
                  styles.input,
                  firstNameTouched && !!firstNameError && styles.inputError,
                ]}
                placeholder={focusedField === 'firstName' ? '' : 'First Name'}
                placeholderTextColor="#B5B5B5"
                value={firstName}
                onChangeText={setFirstName}
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => {
                  setFirstNameTouched(true);
                  setFocusedField(null);
                }}
                autoCapitalize="words"
              />

              <View style={styles.errorSlot}>
                {firstNameTouched && !!firstNameError && (
                  <Text style={styles.errorText}>{firstNameError}</Text>
                )}
              </View>
            </View>

            <View style={styles.nameCol}>
              <Text style={styles.label}>Last Name</Text>

              <TextInput
                style={[
                  styles.input,
                  lastNameTouched && !!lastNameError && styles.inputError,
                ]}
                placeholder={focusedField === 'lastName' ? '' : 'Last Name'}
                placeholderTextColor="#B5B5B5"
                value={lastName}
                onChangeText={setLastName}
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => {
                  setLastNameTouched(true);
                  setFocusedField(null);
                }}
                autoCapitalize="words"
              />

              <View style={styles.errorSlot}>
                {lastNameTouched && !!lastNameError && (
                  <Text style={styles.errorText}>{lastNameError}</Text>
                )}
              </View>
            </View>
          </View>

          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>

            <TextInput
              style={[
                styles.input,
                emailTouched && !!emailError && styles.inputError,
              ]}
              placeholder={focusedField === 'email' ? '' : 'Email'}
              placeholderTextColor="#B5B5B5"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => {
                setEmailTouched(true);
                setFocusedField(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

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
                styles.passwordWrapper,
                passwordTouched && !passwordIsValid && styles.inputError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#B5B5B5"
              />

              <TextInput
                style={styles.passwordInput}
                placeholder={focusedField === 'password' ? '' : 'Password'}
                placeholderTextColor="#B5B5B5"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordTouched(true);
                }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => {
                  setPasswordTouched(true);
                  setFocusedField(null);
                }}
                autoCapitalize="none"
              />

              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#B5B5B5"
                />
              </TouchableOpacity>
            </View>

            {/* PASSWORD HINT (one line: the next rule still missing) */}
            <View style={styles.errorSlot}>
              {passwordTouched &&
                (passwordMessage ? (
                  <Text style={styles.errorText}>{passwordMessage}</Text>
                ) : (
                  <Text style={styles.successText}>Password looks good ✓</Text>
                ))}
            </View>
          </View>

          {/* CONFIRM PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>

            <View
              style={[
                styles.passwordWrapper,
                confirmPasswordTouched &&
                  !!confirmPasswordError &&
                  styles.inputError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#B5B5B5"
              />

              <TextInput
                style={styles.passwordInput}
                placeholder={
                  focusedField === 'confirmPassword' ? '' : 'Confirm Password'
                }
                placeholderTextColor="#B5B5B5"
                secureTextEntry={!confirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => {
                  setConfirmPasswordTouched(true);
                  setFocusedField(null);
                }}
                autoCapitalize="none"
              />

              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    confirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'
                  }
                  size={20}
                  color="#B5B5B5"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.errorSlot}>
              {confirmPasswordTouched && !!confirmPasswordError && (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              )}
            </View>
          </View>

          {/* TERMS */}
          <View style={styles.termsSection}>
            <View style={styles.termsRow}>
              {/* CHECKBOX */}
              <TouchableOpacity
                disabled={!termsViewed}
                onPress={() => {
                  setAgreedToTerms(!agreedToTerms);
                  setTermsValidationTouched(false);
                }}
                activeOpacity={0.7}
                style={[
                  styles.checkbox,
                  !termsViewed && styles.checkboxDisabled,
                  agreedToTerms && styles.checkboxChecked,
                ]}
              >
                {agreedToTerms && (
                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              {/* TERMS TEXT */}
              <View style={styles.termsTextContainer}>
                <Text style={styles.termsText}>I agree to the </Text>

                <TouchableOpacity onPress={openTerms} activeOpacity={0.7}>
                  <Text style={styles.termsLink}>Terms of Service</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* TERMS INLINE VALIDATION */}
            <View style={styles.errorSlot}>
              {termsValidationTouched && !!termsError && (
                <Text style={styles.errorText}>{termsError}</Text>
              )}
            </View>
          </View>

          {/* SIGN UP BUTTON */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >
            <Text style={styles.signupButtonText}>SIGN UP</Text>
          </TouchableOpacity>

          {/* DIVIDER + GOOGLE + LOGIN LINK (hidden while the keyboard is open) */}
          {!keyboardVisible && (
            <>
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />

                <Text style={styles.dividerText}>OR USE EMAIL</Text>

                <View style={styles.divider} />
              </View>

              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignUp}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-google" size={22} color="#4285F4" />

                <Text style={styles.googleText}>Sign up with Google</Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.alreadyText}>
                  Already have an account?
                </Text>

                <TouchableOpacity onPress={goToLogin} activeOpacity={0.7}>
                  <Text style={styles.loginLink}> Log In</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* TERMS OF SERVICE MODAL */}
      <Modal
        visible={termsModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCancelTerms}
      >
        <SafeAreaView style={styles.termsModalContainer}>
          {/* HEADER */}
          <View style={styles.termsHeader}>
            <TouchableOpacity
              onPress={handleCancelTerms}
              activeOpacity={0.7}
              style={styles.closeButton}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="#008C2B"
              />
            </TouchableOpacity>

            <Text style={styles.termsModalTitle}>
              Terms of Service
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          {/* TERMS CONTENT */}
          <ScrollView
            style={styles.termsScroll}
            contentContainerStyle={styles.termsContent}
            showsVerticalScrollIndicator={true}
            onScroll={handleTermsScroll}
            scrollEventThrottle={16}
          >
            {/* 1 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                1. Acceptance of Terms
              </Text>
              <Text style={styles.termText}>
                By using A.V.I.A.N., you confirm that you have
                read, understood, and agreed to these Terms and
                Conditions. If you do not agree, please do not
                use the system.
              </Text>
            </View>

            {/* 2 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                2. Purpose of the System
              </Text>
              <Text style={styles.termText}>
                A.V.I.A.N. is an IoT-based monitoring and
                automation system designed to monitor ammonia
                levels and environmental conditions in poultry
                areas and help automatically manage
                ventilation.
              </Text>
            </View>

            {/* 3 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                3. System Monitoring
              </Text>
              <Text style={styles.termText}>
                A.V.I.A.N. may monitor:
                {'\n'}• Ammonia (NH₃) levels
                {'\n'}• Temperature
                {'\n'}• Humidity
                {'\n'}• Air quality
                {'\n'}• Ventilation status
                {'\n'}• Other connected environmental sensors
                {'\n\n'}
                Sensor readings may vary depending on sensor
                condition, placement, calibration, and
                environmental factors.
              </Text>
            </View>

            {/* 4 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                4. Automatic Ventilation
              </Text>
              <Text style={styles.termText}>
                A.V.I.A.N. may automatically activate or
                deactivate connected ventilation devices based
                on configured thresholds and sensor readings.
                Users should regularly check that fans and
                other connected equipment are functioning
                properly.
              </Text>
            </View>

            {/* 5 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                5. Mobile Application
              </Text>
              <Text style={styles.termText}>
                The A.V.I.A.N. mobile application allows
                authorized users to:
                {'\n'}• View real-time environmental data
                {'\n'}• Monitor ammonia levels
                {'\n'}• Check ventilation status
                {'\n'}• Receive alerts and notifications
                {'\n'}• View historical data and trends
                {'\n'}• Control supported devices when manual
                control is available
              </Text>
            </View>

            {/* 6 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                6. Alerts and Notifications
              </Text>
              <Text style={styles.termText}>
                The system may send notifications when critical
                conditions are detected, such as high ammonia,
                high temperature, high humidity, poor air
                quality, or device failure.
                {'\n\n'}
                Users are responsible for reviewing alerts and
                taking appropriate action when necessary.
              </Text>
            </View>

            {/* 7 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                7. User Account
              </Text>
              <Text style={styles.termText}>
                Users are responsible for:
                {'\n'}• Providing accurate account information.
                {'\n'}• Keeping their password confidential.
                {'\n'}• Protecting their account from
                unauthorized access.
                {'\n'}• Reporting suspected unauthorized
                access or security problems.
              </Text>
            </View>

            {/* 8 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                8. Equipment and Maintenance
              </Text>
              <Text style={styles.termText}>
                Users are responsible for properly installing
                and maintaining sensors, controllers, fans, and
                other connected equipment. Sensors should be
                checked and calibrated when necessary to
                maintain reliable readings.
              </Text>
            </View>

            {/* 9 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                9. Internet and Power Requirements
              </Text>
              <Text style={styles.termText}>
                Some A.V.I.A.N. features require Internet
                connectivity and electrical power. Network
                interruptions, power outages, or equipment
                failures may temporarily affect monitoring,
                notifications, or remote control.
              </Text>
            </View>

            {/* 10 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                10. Data and Privacy
              </Text>
              <Text style={styles.termText}>
                A.V.I.A.N. may collect and store information
                such as user account details, sensor readings,
                environmental data, alerts, device status, and
                system history to provide monitoring and
                automation services.
              </Text>
            </View>

            {/* 11 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                11. User Responsibilities
              </Text>
              <Text style={styles.termText}>
                Users should:
                {'\n'}• Regularly check the poultry environment.
                {'\n'}• Respond promptly to critical alerts.
                {'\n'}• Maintain sensors and ventilation
                equipment.
                {'\n'}• Use the system according to its
                intended purpose.
                {'\n'}• Ensure that automatic controls are
                configured appropriately.
              </Text>
            </View>

            {/* 12 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                12. Safety
              </Text>
              <Text style={styles.termText}>
                A.V.I.A.N. is designed to assist with
                environmental monitoring and ventilation. Users
                should not rely solely on the system for
                poultry safety or environmental management.
                Manual inspection and appropriate farm safety
                procedures should still be followed.
              </Text>
            </View>

            {/* 13 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                13. Limitation of Liability
              </Text>
              <Text style={styles.termText}>
                A.V.I.A.N. is a monitoring and automation tool.
                The developers are not responsible for losses,
                poultry health problems, equipment damage, or
                other consequences resulting from incorrect
                sensor readings, equipment failure, improper
                installation, power or Internet interruption,
                incorrect configuration, or failure to respond
                to alerts.
              </Text>
            </View>

            {/* 14 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                14. Prohibited Use
              </Text>
              <Text style={styles.termText}>
                Users must not:
                {'\n'}• Attempt to damage or disable A.V.I.A.N.
                {'\n'}• Access another user's account without
                permission.
                {'\n'}• Manipulate sensor or system data.
                {'\n'}• Bypass security controls.
                {'\n'}• Use the system for illegal or harmful
                activities.
              </Text>
            </View>

            {/* 15 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                15. System Updates
              </Text>
              <Text style={styles.termText}>
                A.V.I.A.N. may be updated to improve security,
                performance, monitoring accuracy, automation,
                and functionality. Features may be modified or
                added when necessary.
              </Text>
            </View>

            {/* 16 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                16. Account Suspension or Termination
              </Text>
              <Text style={styles.termText}>
                Access to A.V.I.A.N. may be suspended or
                terminated if a user violates these Terms and
                Conditions, misuses the system, or attempts to
                compromise its security.
              </Text>
            </View>

            {/* 17 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                17. Changes to the Terms
              </Text>
              <Text style={styles.termText}>
                These Terms and Conditions may be updated when
                necessary. Users will be informed of significant
                changes through the application or other
                appropriate communication channels.
              </Text>
            </View>

            {/* 18 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                18. Contact and Support
              </Text>
              <Text style={styles.termText}>
                For technical problems, account concerns, or
                questions about A.V.I.A.N., users may contact
                the system administrator or use the Help &
                Support section of the application.
              </Text>
            </View>

            {/* 19 */}
            <View style={styles.termCard}>
              <Text style={styles.termTitle}>
                19. Agreement
              </Text>
              <Text style={styles.termText}>
                By selecting “I Agree”, creating an account, or
                continuing to use A.V.I.A.N., you acknowledge
                that you have read and agreed to these Terms and
                Conditions.
              </Text>
            </View>

            {/* Bottom space */}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* TERMS BUTTONS */}
          <View style={styles.termsButtons}>
            <TouchableOpacity
              style={[
                styles.agreeButton,
                !termsScrolledToBottom &&
                  styles.agreeButtonDisabled,
              ]}
              disabled={!termsScrolledToBottom}
              onPress={handleAgreeToTerms}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.agreeButtonText,
                  !termsScrolledToBottom &&
                    styles.agreeButtonTextDisabled,
                ]}
              >
                I Agree
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelTerms}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* 6-DIGIT OTP VERIFICATION MODAL */}
      <Modal
        visible={otpModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOtpModalVisible(false)}
      >
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="mail-open-outline" size={32} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>Verify Email</Text>

            <Text style={styles.successMessage}>
              Enter the 6-digit verification code sent to {email}
            </Text>

            <TextInput
              style={[styles.input, { textAlign: 'center', letterSpacing: 8, fontSize: 22, marginVertical: 16 }]}
              placeholder="000000"
              placeholderTextColor="#B5B5B5"
              keyboardType="number-pad"
              maxLength={6}
              value={otpCode}
              onChangeText={setOtpCode}
            />

            <TouchableOpacity
              style={styles.successButton}
              onPress={handleVerifyOtp}
              activeOpacity={0.8}
            >
              <Text style={styles.successButtonText}>VERIFY CODE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 12 }}
              onPress={() => setOtpModalVisible(false)}
            >
              <Text style={{ color: '#888', textDecorationLine: 'underline' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ACCOUNT CREATED POP-UP */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessContinue}
      >
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={36} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>Account Created!</Text>

            <Text style={styles.successMessage}>
              Your account has been created successfully. Please log
              in to continue.
            </Text>

            <TouchableOpacity
              style={styles.successButton}
              onPress={handleSuccessContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.successButtonText}>
                GO TO LOG IN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // Whole screen: everything is grouped and centered, no scrolling
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 20,
  },

  /* LOGO */

  logoSection: {
    alignItems: 'center',
    flexShrink: 1,
  },

  // Fixed-height box that crops the transparent space around the logo image.
  // It shrinks automatically on short screens (minHeight keeps it visible).
  logoCrop: {
    width: '100%',
    height: 120,
    minHeight: 60,
    flexShrink: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bigger than the box on purpose; the box crops the empty edges.
  // Change width and height together (keep about 10:9) to resize the logo.
  logoImage: {
    width: 260,
    height: 234,
  },

  subtitle: {
    marginTop: 0,
    textAlign: 'center',
    color: '#008C2B',
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 5,
  },

  title: {
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#008C2B',
  },

  /* FORM */

  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },

  nameCol: {
    flex: 1,
  },

  inputGroup: {
    marginBottom: 0,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A7A7A7',
    marginBottom: 4,
  },

  input: {
    height: 46,
    borderWidth: 1.5,
    borderColor: '#D5D5D5',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },

  inputError: {
    borderColor: '#FF3B30',
  },

  // Reserved line under every field so messages never push the layout around
  errorSlot: {
    minHeight: 18,
    justifyContent: 'center',
  },

  errorText: {
    color: '#FF3B30',
    fontSize: 11,
    marginLeft: 2,
  },

  successText: {
    color: '#008C2B',
    fontSize: 11,
    marginLeft: 2,
  },

  passwordWrapper: {
    height: 46,
    borderWidth: 1.5,
    borderColor: '#D5D5D5',
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: 13,
    color: '#333333',
  },

  /* TERMS */

  termsSection: {
    marginTop: 2,
    marginBottom: 6,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#8F8F8F',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxDisabled: {
    backgroundColor: '#EEEEEE',
    borderColor: '#C8C8C8',
  },

  checkboxChecked: {
    backgroundColor: '#008C2B',
    borderColor: '#008C2B',
  },

  termsTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  termsText: {
    fontSize: 11,
    color: '#555555',
  },

  termsLink: {
    fontSize: 11,
    color: '#008C2B',
    fontWeight: '700',
  },

  /* SIGN UP */

  signupButton: {
    height: 48,
    backgroundColor: '#009B00',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* DIVIDER */

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 12,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#D7D7D7',
  },

  dividerText: {
    marginHorizontal: 8,
    fontSize: 10,
    fontWeight: '700',
    color: '#888888',
  },

  /* GOOGLE */

  googleButton: {
    height: 42,
    borderWidth: 1.5,
    borderColor: '#D5D5D5',
    borderRadius: 21,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  googleText: {
    marginLeft: 16,
    fontSize: 13,
    color: '#777777',
  },

  /* LOGIN */

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  alreadyText: {
    fontSize: 11,
    color: '#777777',
  },

  loginLink: {
    fontSize: 11,
    color: '#008C2B',
    fontWeight: '700',
  },

  /* TERMS MODAL */

  termsModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  termsHeader: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  closeButton: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  headerSpacer: {
    width: 40,
  },

  termsModalTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#008C2B',
  },

  termsScroll: {
    flex: 1,
  },

  termsContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },

  termCard: {
    borderWidth: 1,
    borderColor: '#A8A8A8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
  },

  termTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 3,
  },

  termText: {
    fontSize: 10.5,
    lineHeight: 15,
    color: '#333333',
  },

  termsButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },

  agreeButton: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  agreeButtonDisabled: {
    backgroundColor: '#F1F1F1',
    borderColor: '#E2E2E2',
  },

  agreeButtonText: {
    color: '#008C2B',
    fontSize: 13,
    fontWeight: '700',
  },

  agreeButtonTextDisabled: {
    color: '#AAAAAA',
  },

  cancelButton: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  cancelButtonText: {
    color: '#008C2B',
    fontSize: 13,
    fontWeight: '700',
  },

  /* SUCCESS POP-UP */

  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  successCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#008C2B',
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: 'center',
  },

  successIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#009B00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#087A24',
    marginBottom: 8,
  },

  successMessage: {
    fontSize: 13,
    lineHeight: 19,
    color: '#777777',
    textAlign: 'center',
    marginBottom: 22,
  },

  successButton: {
    width: '100%',
    height: 44,
    backgroundColor: '#009B00',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  successButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
