import { Stack } from 'expo-router';
import { ProfileProvider } from '../context/ProfileContext';

// Make the app start from the root "index" route (which redirects to the login page)
export const unstable_settings = {
  anchor: 'index',
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <ProfileProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* App entry: redirects to the login page */}
        <Stack.Screen name="index" />

        {/* Auth screens */}
        <Stack.Screen name="auth/login" />

        {/* Main Tabs Navigation */}
        <Stack.Screen name="(tabs)" />

        {/* Sub-screens */}
        <Stack.Screen name="notification" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="device-control" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="chick-profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="iot-devices" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="change-password" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="faq" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </ProfileProvider>
  );
}
