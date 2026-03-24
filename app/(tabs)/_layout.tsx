import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typeStyles } from '../../src/theme';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={styles.tabIcon}>
      <Text
        style={[
          styles.tabIconText,
          { color: focused ? colors.accent.gold : colors.text.tertiary },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 84,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent.gold,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          ...typeStyles.caption,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="✦" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="◇" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="☩" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="⚙" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  tabIconText: {
    fontSize: 20,
  },
});
