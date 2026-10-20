import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight, FileText, HelpCircle, Lock, LogOut, User } from 'lucide-react-native';
import { ReactNode, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, PillButton, ScreenLayout } from '../../components/ScreenLayout';
import { useProfile } from '../../context/ProfileContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { fullName, email, profileImage } = useProfile();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const go = (path: string) => router.push(path as any);

  const confirmLogout = () => {
    setLogoutVisible(false);
    router.replace('/auth/login');
  };

  const MenuItem = ({ icon, label, onPress, danger }: {
    icon: ReactNode;
    label: string;
    onPress: () => void;
    danger?: boolean;
  }) => (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.menuLeft}>
        {icon}
        <Text style={[styles.menuText, danger && styles.dangerText]}>{label}</Text>
      </View>
      {!danger && <ChevronRight size={18} color="#64748B" />}
    </TouchableOpacity>
  );

  return (
    <ScreenLayout title="Settings">
      {/* Profile */}
      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <User size={30} color="#FFFFFF" />
          )}
        </View>
        <View>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </Card>

      {/* Account */}
      <Text style={styles.sectionTitle}>Account</Text>
      <Card style={styles.group}>
        <MenuItem icon={<User size={20} color="#0F172A" />} label="My Profile" onPress={() => go('/profile')} />
      </Card>

      {/* Support */}
      <Text style={styles.sectionTitle}>Support</Text>
      <Card style={styles.group}>
        <MenuItem icon={<HelpCircle size={20} color="#0F172A" />} label="Help & Support" onPress={() => go('/help-support')} />
        <View style={styles.divider} />
        <MenuItem icon={<BookOpen size={20} color="#0F172A" />} label="FAQ" onPress={() => go('/faq')} />
      </Card>

      {/* Privacy */}
      <Text style={styles.sectionTitle}>Privacy & Security</Text>
      <Card style={styles.group}>
        <MenuItem icon={<Lock size={20} color="#0F172A" />} label="Privacy & Security" onPress={() => go('/privacy-security')} />
        <View style={styles.divider} />
        <MenuItem icon={<FileText size={20} color="#0F172A" />} label="Terms of Service" onPress={() => go('/terms-of-service')} />
        <View style={styles.divider} />
        <MenuItem
          icon={<LogOut size={20} color="#DC2626" />}
          label="Log Out"
          danger
          onPress={() => setLogoutVisible(true)}
        />
      </Card>

      {/* Logout confirmation */}
      <Modal
        visible={logoutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalIcon}>
              <LogOut size={26} color="#DC2626" />
            </View>
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to sign out from your account?
            </Text>
            <View style={styles.modalButtons}>
              <PillButton label="Cancel" outlined onPress={() => setLogoutVisible(false)} style={styles.modalBtn} />
              <PillButton label="Log Out" onPress={confirmLogout} style={styles.modalBtn} />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  userEmail: { fontSize: 12, color: '#64748B' },

  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', marginTop: 4, marginLeft: 4 },
  group: { padding: 0, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuText: { fontSize: 14, fontWeight: '500', color: '#0F172A' },
  dangerText: { color: '#DC2626', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 48 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: { fontSize: 19, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  modalMessage: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 21, marginBottom: 22 },
  modalButtons: { flexDirection: 'row', gap: 10, width: '100%' },
  modalBtn: { flex: 1, paddingHorizontal: 4 },
});
