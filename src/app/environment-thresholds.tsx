import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Droplet, FlaskConical, Minus, Plus, Thermometer } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Alert, BackHandler, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EnvironmentThresholdsScreen() {
  const router = useRouter();

  // Temperature Threshold States
  const [minTemp, setMinTemp] = useState<number>(30);
  const [maxTemp, setMaxTemp] = useState<number>(37);

  // Humidity Threshold States
  const [minHumidity, setMinHumidity] = useState<number>(40);
  const [maxHumidity, setMaxHumidity] = useState<number>(70);

  // Ammonia Threshold States
  const [warningAmmonia, setWarningAmmonia] = useState<number>(20);
  const [criticalAmmonia, setCriticalAmmonia] = useState<number>(25);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.back(); // Babalik sa hinanguang screen (Device Control)
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [router])
  );

  const handleSave = () => {
    Alert.alert('Success', 'Environment thresholds saved successfully!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.6}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Environment Thresholds</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Temperature Section */}
        <Text style={styles.sectionTitle}>Temperature</Text>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Thermometer size={42} color="#16A34A" />
          </View>
          <View style={styles.controlsContainer}>
            <Text style={styles.fieldLabel}>Minimum Temperature</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity 
                style={[styles.stepperBtn, styles.stepperBtnLeft]} 
                onPress={() => setMinTemp(prev => Math.max(0, prev - 1))}
                activeOpacity={0.7}
              >
                <Minus size={16} color="#334155" />
              </TouchableOpacity>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.stepperInput}
                  value={minTemp.toString()}
                  onChangeText={(val) => {
                    const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
                    setMinTemp(isNaN(num) ? 0 : num);
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.unitText}>°C</Text>
              </View>
              <TouchableOpacity 
                style={[styles.stepperBtn, styles.stepperBtnRight]} 
                onPress={() => setMinTemp(prev => prev + 1)}
                activeOpacity={0.7}
              >
                <Plus size={16} color="#334155" />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldSpacing} />

            <Text style={styles.fieldLabel}>Maximum Temperature</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity 
                style={[styles.stepperBtn, styles.stepperBtnLeft]} 
                onPress={() => setMaxTemp(prev => Math.max(0, prev - 1))}
                activeOpacity={0.7}
              >
                <Minus size={16} color="#334155" />
              </TouchableOpacity>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.stepperInput}
                  value={maxTemp.toString()}
                  onChangeText={(val) => {
                    const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
                    setMaxTemp(isNaN(num) ? 0 : num);
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.unitText}>°C</Text>
              </View>
              <TouchableOpacity 
                style={[styles.stepperBtn, styles.stepperBtnRight]} 
                onPress={() => setMaxTemp(prev => prev + 1)}
                activeOpacity={0.7}
              >
                <Plus size={16} color="#334155" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Humidity Section */}
        <Text style={styles.sectionTitle}>Humidity</Text>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Droplet size={42} color="#0284C7" />
          </View>
          <View style={styles.controlsContainer}>
            <Text style={styles.fieldLabel}>Minimum Humidity</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity 
                style={[styles.stepperBtn, styles.stepperBtnLeft]} 
                onPress={() => setMinHumidity(prev => Math.max(0, prev - 1))}
                activeOpacity={0.7}
              >
                <Minus size={16} color="#334155" />
              </TouchableOpacity>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.stepperInput}
                  value={minHumidity.toString()}
                  onChangeText={(val) => {
                    const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
                    setMinHumidity(isNaN(num) ? 0 : num);
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.unitText}>%</Text>
              </View>
              <TouchableOpacity 
                style={[styles.stepperBtn, styles.stepperBtnRight]} 
                onPress={() => setMinHumidity(prev => Math.min(100, prev + 1))}
                activeOpacity={0.7}
              >
                <Plus size={16} color="#334155" />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldSpacing} />

            <Text style={styles.fieldLabel}>Maximum Humidity</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity 
                style={[styles.stepperBtn, styles.stepperBtnLeft]} 
                onPress={() => setMaxHumidity(prev => Math.max(0, prev - 1))}
                activeOpacity={0.7}
              >
                <Minus size={16} color="#334155" />
              </TouchableOpacity>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.stepperInput}
                  value={maxHumidity.toString()}
                  onChangeText={(val) => {
                    const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
                    setMaxHumidity(isNaN(num) ? 0 : num);
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.unitText}>%</Text>
              </View>
              <TouchableOpacity 
                style={[styles.stepperBtn, styles.stepperBtnRight]} 
                onPress={() => setMaxHumidity(prev => Math.min(100, prev + 1))}
                activeOpacity={0.7}
              >
                <Plus size={16} color="#334155" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Ammonia Section */}
        <Text style={styles.sectionTitle}>Ammonia (NH₃)</Text>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <FlaskConical size={42} color="#64748B" />
          </View>
          <View style={styles.controlsContainer}>
            <Text style={styles.fieldLabel}>Warning Level</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity 
                style={[styles.stepperBtn, styles.stepperBtnLeft]} 
                onPress={() => setWarningAmmonia(prev => Math.max(0, prev - 1))}
                activeOpacity={0.7}
              >
                <Minus size={16} color="#334155" />
              </TouchableOpacity>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.stepperInput}
                  value={warningAmmonia.toString()}
                  onChangeText={(val) => {
                    const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
                    setWarningAmmonia(isNaN(num) ? 0 : num);
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.unitText}>ppm</Text>
              </View>
              <TouchableOpacity 
                style={[styles.stepperBtn, styles.stepperBtnRight]} 
                onPress={() => setWarningAmmonia(prev => prev + 1)}
                activeOpacity={0.7}
              >
                <Plus size={16} color="#334155" />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldSpacing} />

            <Text style={styles.fieldLabel}>Critical Level</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity 
                style={[styles.stepperBtn, styles.stepperBtnLeft]} 
                onPress={() => setCriticalAmmonia(prev => Math.max(0, prev - 1))}
                activeOpacity={0.7}
              >
                <Minus size={16} color="#334155" />
              </TouchableOpacity>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.stepperInput}
                  value={criticalAmmonia.toString()}
                  onChangeText={(val) => {
                    const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
                    setCriticalAmmonia(isNaN(num) ? 0 : num);
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.unitText}>ppm</Text>
              </View>
              <TouchableOpacity 
                style={[styles.stepperBtn, styles.stepperBtnRight]} 
                onPress={() => setCriticalAmmonia(prev => prev + 1)}
                activeOpacity={0.7}
              >
                <Plus size={16} color="#334155" />
              </TouchableOpacity>
            </View>
          </View>
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
  backButton: { marginRight: 16 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  controlsContainer: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
  },
  fieldSpacing: {
    height: 10,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    height: 38,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  stepperBtn: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  stepperBtnLeft: {
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
  },
  stepperBtnRight: {
    borderLeftWidth: 1,
    borderLeftColor: '#CBD5E1',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  stepperInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'right',
    minWidth: 24,
    padding: 0,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 4,
  },
  saveBtn: {
    backgroundColor: '#15803D',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});