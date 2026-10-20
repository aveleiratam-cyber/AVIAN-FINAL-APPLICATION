import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation rules checkers
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from your current password.');
      return;
    }

    if (!hasMinLength || !hasNumber || !hasUppercase) {
      Alert.alert('Weak Password', 'New password must meet all requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    Alert.alert(
      'Success',
      'Your password has been successfully changed.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Green Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Current Password Field */}
        <Text style={styles.label}>Current Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showCurrent}
            value={currentPassword}
            onChangeText={setCurrentPassword}
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

        {/* New Password Field */}
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showNew}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
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

        {/* Password Requirements Checklist */}
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

        {/* Confirm New Password Field */}
        <Text style={styles.label}>Confirm New Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter new password"
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

        {/* Save Changes Button */}
        <TouchableOpacity 
          style={styles.saveButton} 
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 12,
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
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },
  requirementsContainer: {
    marginTop: 8,
    marginBottom: 8,
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
    marginTop: 30,
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
});