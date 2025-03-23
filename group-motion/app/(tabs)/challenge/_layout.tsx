import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function ChallengeLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerStyle: {
          backgroundColor: colors.challengeGradientStart,
        },
        headerTitleStyle: {
          color: '#FFFFFF',
          fontSize: 18,
          fontWeight: 'bold',
        },
        headerTintColor: '#FFFFFF',
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Challenge Details',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="recording"
        options={{
          title: 'Record Challenge',
        }}
      />
    </Stack>
  );
}