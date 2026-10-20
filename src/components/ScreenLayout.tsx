import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GREEN = '#15803D';
const DARK_GREEN = '#16A34A';

// Shared by every screen so the bell looks and works the same everywhere.
// Later, replace this number with your real unread-notification count.
const NOTIFICATION_COUNT = 3;

/* ---------- SCREEN WRAPPER: green top + title + white rounded sheet ---------- */
type ScreenLayoutProps = {
  title: string;
  subtitle?: string;
  scrollable?: boolean; // set false for screens that should fit on one page
  children: ReactNode;
  onBellPress?: () => void;
  badgeCount?: number;
};

export function ScreenLayout({
  title,
  subtitle,
  children,
  onBellPress,
  badgeCount = NOTIFICATION_COUNT,
  scrollable = true,
}: ScreenLayoutProps) {
  const router = useRouter();
  const isHome = title === 'Home';
  const handleBellPress = onBellPress ?? (() => router.push('/notification' as any));

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
        </View>
        <TouchableOpacity style={styles.headerSide} onPress={handleBellPress}>
          <View>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            {badgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeCount > 9 ? '9+' : badgeCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* White rounded sheet that holds the cards */}
      <View style={styles.sheet}>
        {scrollable ? (
          <ScrollView
            contentContainerStyle={[styles.sheetContent, isHome && styles.homeContent]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.sheetContent, styles.fixedContent]}>{children}</View>
        )}
      </View>
    </SafeAreaView>
  );
}

/* ---------- CARD: white box with soft border ---------- */
export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/* ---------- PILL TABS: row of selectable pills (filters / periods) ---------- */
type PillTabsProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export function PillTabs({ options, value, onChange }: PillTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsRow}
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.8}
            onPress={() => onChange(option)}
            style={[styles.tab, active ? styles.tabActive : styles.tabInactive]}
          >
            <Text style={[styles.tabText, active ? styles.tabTextActive : styles.tabTextInactive]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

/* ---------- PILL BUTTON: rounded green button (filled or outlined) ---------- */
type PillButtonProps = {
  label: string;
  onPress?: () => void;
  outlined?: boolean;
  style?: ViewStyle;
};

export function PillButton({ label, onPress, outlined, style }: PillButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.pill, outlined ? styles.pillOutlined : styles.pillFilled, style]}
    >
      <Text style={[styles.pillText, outlined && { color: DARK_GREEN }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GREEN,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerSide: {
    width: 40,
    alignItems: 'flex-end',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#DCFCE7',
    fontSize: 12,
    marginTop: 2,
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: '#DC2626',
    borderWidth: 1.5,
    borderColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },

  sheet: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  sheetContent: {
    padding: 16,
    gap: 14,
  },
  // Used when scrollable={false}: content fills the screen, no scrolling
  fixedContent: {
    flex: 1,
  },
  // Home screen only: cards start lower and have wider spacing
  homeContent: {
    paddingTop: 30,
    gap: 22,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  tabsRow: {
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: GREEN,
  },
  tabInactive: {
    backgroundColor: '#F1F5F9',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabTextInactive: {
    color: '#64748B',
  },

  pill: {
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillFilled: {
    backgroundColor: GREEN,
  },
  pillOutlined: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: GREEN,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
