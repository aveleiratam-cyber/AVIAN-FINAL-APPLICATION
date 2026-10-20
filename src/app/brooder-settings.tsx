import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BrooderSettingsScreen() {
  const router = useRouter();

  const [brooderName, setBrooderName] = useState('Brooder 01');
  const [numChicks, setNumChicks] = useState('120');
  const [ageChicks, setAgeChicks] = useState('14 Days');
  const [location, setLocation] = useState('Poultry House A');
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');

  const handleSave = () => {
    Alert.alert('Success', 'Brooder settings saved successfully!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Brooder Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Form Inputs */}
        <Text style={styles.label}>Brooder Name</Text>
        <TextInput style={styles.input} value={brooderName} onChangeText={setBrooderName} />

        <Text style={styles.label}>Number of Chicks</Text>
        <TextInput style={styles.input} value={numChicks} onChangeText={setNumChicks} keyboardType="numeric" />

        <Text style={styles.label}>Age of Chicks</Text>
        <TextInput style={styles.input} value={ageChicks} onChangeText={setAgeChicks} />

        <Text style={styles.label}>Brooder Location</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} />

        {/* Environment Mode */}
        <Text style={styles.sectionTitle}>Environment Mode</Text>
        <View style={styles.cardGroup}>
          {/* Automatic Option */}
          <TouchableOpacity style={styles.radioRow} onPress={() => setMode('auto')} activeOpacity={0.7}>
            <View style={[styles.radioOuter, mode === 'auto' && styles.radioOuterSelected]}>
              {mode === 'auto' && <View style={styles.radioInner} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.radioTitle}>Automatic (Recommended)</Text>
              <Text style={styles.radioSub}>System automatically adjusts ventilation and environment</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Manual Option */}
          <TouchableOpacity style={styles.radioRow} onPress={() => setMode('manual')} activeOpacity={0.7}>
            <View style={[styles.radioOuter, mode === 'manual' && styles.radioOuterSelected]}>
              {mode === 'manual' && <View style={styles.radioInner} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.radioTitle}>Manual</Text>
              <Text style={styles.radioSub}>You will manually control the ventilation and settings</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    backgroundColor: '#15803D',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 12 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#334155',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginTop: 8, marginBottom: 8 },
  cardGroup: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, marginBottom: 24, overflow: 'hidden' },
  radioRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 12 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  radioOuterSelected: { borderColor: '#15803D' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#15803D' },
  radioTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F172A' },
  radioSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 46 },
  saveBtn: { backgroundColor: '#15803D', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
});