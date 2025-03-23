import { Stack, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ChallengeLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

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
      }}>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Challenge Details',
          // headerBackTitle: 'Back',
          // headerBackButtonMenuEnabled: true,
          headerLeft: (props) => {
            if (props.canGoBack) {
              return (
                <TouchableOpacity onPress={() => router.back()}>
                  <FontAwesome5 name="chevron-left" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              );
            }
          },
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