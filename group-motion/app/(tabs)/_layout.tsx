import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover Challenges',
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name={focused ? 'compass' : 'compass'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Record Challenge',
          tabBarLabel: 'Record',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name={focused ? 'camera' : 'camera'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Your Rewards',
          tabBarLabel: 'Rewards',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name={focused ? 'trophy' : 'trophy'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="challenge"
        options={{
          href: null, // This hides the tab but keeps the screen accessible for navigation
        }}
      />
    </Tabs>
  );
}
