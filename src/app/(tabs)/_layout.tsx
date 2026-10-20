import { Tabs } from 'expo-router';
import {
  ClipboardList,
  Droplets,
  Home,
  ListTodo,
  Settings,
  Thermometer,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#16A34A',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="environment"
        options={{
          title: 'Environment',
          tabBarIcon: ({ color, size }) => <Thermometer size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed-water"
        options={{
          title: 'Feed & Water',
          tabBarIcon: ({ color, size }) => <Droplets size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="checklist"
        options={{
          title: 'Checklist',
          tabBarIcon: ({ color, size }) => <ListTodo size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
