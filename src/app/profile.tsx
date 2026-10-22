import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { ArrowLeft, Camera, Check, Edit2, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProfile } from '../context/ProfileContext';
import { supabase } from '../config/supabase'; 

export default function ProfileScreen() {
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    profileImage,
    setProfileImage,
  } = useProfile();

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const [successMessage, setSuccessMessage] = useState({
    title: '',
    subtitle: '',
  });

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Denied',
        'You need to grant camera roll permissions to change your profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;

      setProfileImage(selectedUri);

      setSuccessMessage({
        title: 'Profile Picture Updated',
        subtitle: 'Your new profile photo has been successfully saved.',
      });

      setSuccessModalVisible(true);
    }
  };

  const handleSaveName = async () => {
    if (!firstNameInput.trim() || !lastNameInput.trim()) {
      Alert.alert(
        'Validation Error',
        'Please fill in both First Name and Last Name.'
      );
      return;
    }

    const nameRegex = /^[A-Za-zÑñ\s]+$/;

    if (
      !nameRegex.test(firstNameInput.trim()) ||
      !nameRegex.test(lastNameInput.trim())
    ) {
      Alert.alert(
        'Invalid Name',
        'Names should only contain letters and spaces.'
      );
      return;
    }

    const newFirstName = firstNameInput.trim();
    const newLastName = lastNameInput.trim();
    const updatedFullName = `${newFirstName} ${newLastName}`;

    try {
      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: newFirstName,
          last_name: newLastName,
        },
      });

      if (error) {
        Alert.alert('Update Failed', error.message);
        return;
      }

      setFullName(updatedFullName);
      setIsEditingName(false);
      setFirstNameInput('');
      setLastNameInput('');

      setSuccessMessage({
        title: 'Full Name Updated',
        subtitle: 'Your full name has been successfully changed.',
      });

      setSuccessModalVisible(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'An unexpected error occurred.');
    }
  };

  const handleSaveEmail = async () => {
    if (!emailInput.trim()) {
      Alert.alert(
        'Validation Error',
        'Email address cannot be empty.'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailInput.trim())) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address (e.g., example@gmail.com).'
      );
      return;
    }

    const newEmail = emailInput.trim();

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        Alert.alert('Update Failed', error.message);
        return;
      }

      setEmail(newEmail);
      setIsEditingEmail(false);
      setEmailInput('');

      setSuccessMessage({
        title: 'Email Updated',
        subtitle: 'Please check your new email inbox for confirmation links if required.',
      });

      setSuccessModalVisible(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Green Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Information</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content Card */}
      <View style={styles.card}>
        {/* Profile Picture */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handlePickImage}
          activeOpacity={0.8}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImageStyle}
            />
          ) : (
            <Camera size={32} color="#15803D" />
          )}
        </TouchableOpacity>

        {/* Full Name */}
        <View style={styles.infoRow}>
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Full Name</Text>

            <Text style={styles.value}>
              {fullName}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              const nameParts = fullName.trim().split(' ');

              setFirstNameInput(nameParts[0] || '');
              setLastNameInput(nameParts.slice(1).join(' ') || '');
              setIsEditingName(true);
            }}
            style={styles.editIconBtn}
            activeOpacity={0.7}
          >
            <Edit2 size={16} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Email Address */}
        <View style={styles.infoRow}>
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Email Address</Text>

            <Text
              style={styles.value}
              numberOfLines={1}
            >
              {email}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setEmailInput(email);
              setIsEditingEmail(true);
            }}
            style={styles.editIconBtn}
            activeOpacity={0.7}
          >
            <Edit2 size={16} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* =========================
          EDIT FULL NAME MODAL
      ========================= */}
      <Modal
        visible={isEditingName}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditingName(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                EDIT YOUR FULL NAME
              </Text>

              <TouchableOpacity
                onPress={() => setIsEditingName(false)}
                activeOpacity={0.7}
              >
                <X size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>
              First Name
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder="First Name"
              placeholderTextColor="#94A3B8"
              value={firstNameInput}
              onChangeText={setFirstNameInput}
              autoCapitalize="words"
            />

            <Text style={styles.inputLabel}>
              Last Name
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder="Last Name"
              placeholderTextColor="#94A3B8"
              value={lastNameInput}
              onChangeText={setLastNameInput}
              autoCapitalize="words"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSaveName}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                SUBMIT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================
          EDIT EMAIL MODAL
      ========================= */}
      <Modal
        visible={isEditingEmail}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditingEmail(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                EDIT EMAIL ADDRESS
              </Text>

              <TouchableOpacity
                onPress={() => setIsEditingEmail(false)}
                activeOpacity={0.7}
              >
                <X size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>
              Email Address
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder="Enter email address"
              placeholderTextColor="#94A3B8"
              value={emailInput}
              onChangeText={setEmailInput}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSaveEmail}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                SUBMIT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================
          SUCCESS MODAL
      ========================= */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Check size={28} color="#15803D" />
            </View>

            <Text style={styles.successTitle}>
              {successMessage.title}
            </Text>

            <Text style={styles.successSubtitle}>
              {successMessage.subtitle}
            </Text>

            <TouchableOpacity
              style={styles.successButton}
              onPress={() => setSuccessModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.successButtonText}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    paddingBottom: 40,
  },

  header: {
    backgroundColor: '#15803D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  headerSpacer: {
    width: 32,
  },

  card: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },

  profileImageStyle: {
    width: '100%',
    height: '100%',
  },

  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },

  infoTextContainer: {
    flex: 1,
    marginRight: 10,
  },

  label: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },

  editIconBtn: {
    padding: 8,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: 0.5,
  },

  inputLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },

  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
  },

  submitButton: {
    backgroundColor: '#15803D',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  successModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },

  successSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },

  successButton: {
    backgroundColor: '#15803D',
    borderRadius: 10,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },

  successButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});