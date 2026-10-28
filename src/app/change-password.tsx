import { supabase } from '../config/supabase';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Eye, EyeOff, X, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  // Modals visibility
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [appModalVisible, setAppModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'error' as 'error' | 'success',
    onClose: undefined as (() => void) | undefined,
  });

  // Form Inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Touched States for inline warnings
  const [currentTouched, setCurrentTouched] = useState(false);
  const [newTouched, setNewTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [otpTouched, setOtpTouched] = useState(false);

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper to trigger styled modals instead of Alert.alert
  const showAlertModal = (title: string, message: string, type: 'error' | 'success' = 'error', onClose?: () => void) => {
    setModalConfig({ title, message, type, onClose });
    setAppModalVisible(true);
  };

  // Detect whether user logged in via Google OAuth and grab email
  useEffect(() => {
    async function checkUserProvider() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.email) {
          setUserEmail(user.email);
        }
        const googleIdentity = user.identities?.find(
          (identity) => identity.provider === 'google'
        );
        if (googleIdentity && user.identities?.length === 1) {
          setIsGoogleUser(true);
        }
      }
    }
    checkUserProvider();
  }, []);

  // Password validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const isSameAsOld = !isGoogleUser && currentPassword && newPassword && currentPassword === newPassword;

  const handleRequestOtp = async () => {
    if (!isGoogleUser) {
      setCurrentTouched(true);
    }
    setNewTouched(true);
    setConfirmTouched(true);

    if (!isGoogleUser && !currentPassword) {
      return;
    }

    if (!newPassword || !confirmPassword || !hasMinLength || !hasNumber || !hasUppercase || !passwordsMatch || isSameAsOld) {
      return;
    }

    if (!userEmail) {
      showAlertModal('Error', 'Unable to find user email address.');
      return;
    }

    setLoading(true);
    try {
      if (!isGoogleUser) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: currentPassword,
        });

        if (signInError) {
          setLoading(false);
          setCurrentTouched(true);
          showAlertModal('Authentication Failed', 'The current password you entered is incorrect.');
          return;
        }
      }

      const { error } = await supabase.auth.resetPasswordForEmail(userEmail);

      if (error) {
        showAlertModal('Error', error.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setOtpCode('');
      setOtpTouched(false);
      setOtpModalVisible(true);
    } catch (err: any) {
      setLoading(false);
      showAlertModal('Error', err.message || 'An error occurred while processing your request.');
    }
  };

  const handleVerifyAndSave = async () => {
    setOtpTouched(true);

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      return;
    }

    setLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: otpCode.trim(),
        type: 'recovery',
      });

      if (verifyError) {
        showAlertModal('Verification Failed', verifyError.message);
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        showAlertModal('Error', updateError.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setOtpModalVisible(false);

      showAlertModal(
        'Success',
        isGoogleUser 
          ? 'Password set successfully! Your account is verified and you can now log in using either Google or Email/Password.'
          : 'Your password has been successfully changed.',
        'success',
        () => router.back()
      );
    } catch (err: any) {
      setLoading(false);
      showAlertModal('Error', err.message || 'An error occurred while updating the password.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Green Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isGoogleUser ? 'Set Password' : 'Change Password'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {isGoogleUser && (
          <View style={styles.googleNotice}>
            <Text style={styles.googleNoticeText}>
              You currently log in using Google. Setting a password allows you to log in with email and password as well. An OTP code will be sent to <Text style={{ fontWeight: 'bold' }}>{userEmail}</Text> to verify setup.
            </Text>
          </View>
        )}

        {!isGoogleUser && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={[
              styles.inputContainer,
              currentTouched && !currentPassword && styles.inputError
            ]}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showCurrent}
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  if (text) setCurrentTouched(false);
                }}
                onBlur={() => setCurrentTouched(true)}
                placeholder="Enter current password"
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? (
                  <EyeOff size={20} color="#64748B" />
                ) : (
                  <Eye size={20} color="#64748B" />
                )}
              </TouchableOpacity>
            </View>
            {currentTouched && !currentPassword && (
              <Text style={styles.errorText}>Current password is required</Text>
            )}
          </View>
        )}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {isGoogleUser ? 'Create Password' : 'New Password'}
          </Text>
          <View style={[
            styles.inputContainer,
            newTouched && (!newPassword || !hasMinLength || !hasNumber || !hasUppercase || isSameAsOld) && styles.inputError
          ]}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (text) setNewTouched(false);
              }}
              onBlur={() => setNewTouched(true)}
              placeholder={isGoogleUser ? "Enter new account password" : "Enter new password"}
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              {showNew ? (
                <EyeOff size={20} color="#64748B" />
              ) : (
                <Eye size={20} color="#64748B" />
              )}
            </TouchableOpacity>
          </View>

          {isSameAsOld && (
            <Text style={styles.errorText}>New password must be different from your current password</Text>
          )}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password must contain:</Text>
            
            <View style={styles.requirementRow}>
              <View style={[styles.circleIndicator, hasMinLength && styles.circleValid]}>
                {hasMinLength && <Check size={8} color="#FFFFFF" />}
              </View>
              <Text style={[styles.requirementText, hasMinLength && styles.validText]}>
                At least 8 characters
              </Text>
            </View>

            <View style={styles.requirementRow}>
              <View style={[styles.circleIndicator, hasNumber && styles.circleValid]}>
                {hasNumber && <Check size={8} color="#FFFFFF" />}
              </View>
              <Text style={[styles.requirementText, hasNumber && styles.validText]}>
                At least 1 number
              </Text>
            </View>

            <View style={styles.requirementRow}>
              <View style={[styles.circleIndicator, hasUppercase && styles.circleValid]}>
                {hasUppercase && <Check size={8} color="#FFFFFF" />}
              </View>
              <Text style={[styles.requirementText, hasUppercase && styles.validText]}>
                At least 1 uppercase letter
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {isGoogleUser ? 'Confirm Created Password' : 'Confirm New Password'}
          </Text>
          <View style={[
            styles.inputContainer,
            confirmTouched && (!confirmPassword || newPassword !== confirmPassword) && styles.inputError
          ]}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (text) setConfirmTouched(false);
              }}
              onBlur={() => setConfirmTouched(true)}
              placeholder="Re-enter password"
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? (
                <EyeOff size={20} color="#64748B" />
              ) : (
                <Eye size={20} color="#64748B" />
              )}
            </TouchableOpacity>
          </View>
          {confirmTouched && !confirmPassword && (
            <Text style={styles.errorText}>Password confirmation is required</Text>
          )}
          {confirmTouched && confirmPassword && newPassword !== confirmPassword && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.saveButton, loading && { opacity: 0.7 }]} 
          activeOpacity={0.8}
          onPress={handleRequestOtp}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Checking & Sending Code...' : 'Continue to Verification'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={otpModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOtpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ENTER SECURITY CODE</Text>
              <TouchableOpacity
                onPress={() => setOtpModalVisible(false)}
                activeOpacity={0.7}
              >
                <X size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              We sent a 6-digit verification code to <Text style={{ fontWeight: '600', color: '#0F172A' }}>{userEmail}</Text> to verify your identity before saving your password.
            </Text>

            <Text style={styles.inputLabel}>6-Digit OTP Code</Text>
            <TextInput
              style={[
                styles.modalTextInput,
                otpTouched && (!otpCode.trim() || otpCode.length !== 6) && styles.inputError
              ]}
              placeholder="123456"
              placeholderTextColor="#94A3B8"
              value={otpCode}
              onChangeText={(text) => {
                setOtpCode(text);
                if (text) setOtpTouched(false);
              }}
              onBlur={() => setOtpTouched(true)}
              keyboardType="number-pad"
              maxLength={6}
            />
            {otpTouched && (!otpCode.trim() || otpCode.length !== 6) && (
              <Text style={[styles.errorText, { marginBottom: 12 }]}>Valid 6-digit code is required</Text>
            )}

            <TouchableOpacity
              style={[styles.submitButton, loading && { opacity: 0.7 }]}
              onPress={handleVerifyAndSave}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'VERIFYING...' : 'CONFIRM & SAVE'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendModalBtn}
              onPress={handleRequestOtp}
            >
              <Text style={styles.resendModalText}>Resend Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={appModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setAppModalVisible(false);
          if (modalConfig.onClose) modalConfig.onClose();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.alertHeaderRow}>
              {modalConfig.type === 'error' ? (
                <AlertCircle size={24} color="#EF4444" style={{ marginRight: 8 }} />
              ) : (
                <CheckCircle2 size={24} color="#16A34A" style={{ marginRight: 8 }} />
              )}
              <Text style={[styles.modalTitle, { flex: 1, marginTop: 2 }]}>
                {modalConfig.title.toUpperCase()}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setAppModalVisible(false);
                  if (modalConfig.onClose) modalConfig.onClose();
                }}
                activeOpacity={0.7}
              >
                <X size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>{modalConfig.message}</Text>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                setAppModalVisible(false);
                if (modalConfig.onClose) modalConfig.onClose();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    backgroundColor: '#15803D',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  googleNotice: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  googleNoticeText: {
    fontSize: 13,
    color: '#166534',
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    height: 50,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  requirementsContainer: {
    marginTop: 8,
    marginBottom: 4,
    paddingLeft: 4,
  },
  requirementsTitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 3,
  },
  circleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleValid: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  requirementText: {
    fontSize: 13,
    color: '#64748B',
  },
  validText: {
    color: '#16A34A',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#15803D',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  // Modal Styling matching app theme
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
    fontWeight: '600',
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 4,
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
    letterSpacing: 4,
  },
  submitButton: {
    backgroundColor: '#15803D',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  resendModalBtn: {
    marginTop: 14,
    alignItems: 'center',
  },
  resendModalText: {
    color: '#15803D',
    fontSize: 13,
    fontWeight: '600',
  },
});