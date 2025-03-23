import { View, FlatList, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { ChallengeCard } from '@/components/ChallengeCard';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface Challenge {
  id: string;
  title: string;
  description: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  reward: string;
  distance: number;
}

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Squat Challenge',
      description: 'Complete 10 squats outside London Bridge',
      location: {
        name: 'London Bridge',
        latitude: 51.5074,
        longitude: -0.0878,
      },
      reward: 'Squat Master NFT',
      distance: 0.05, // 50 meters away
    },
    {
      id: '2',
      title: 'Kindness Challenge',
      description: 'Compliment 10 people outside New Cross',
      location: {
        name: 'New Cross',
        latitude: 51.4767,
        longitude: -0.0367,
      },
      reward: 'Kindness Champion NFT',
      distance: 0.08, // 80 meters away
    },
    {
      id: '3',
      title: 'High Five Challenge',
      description: 'High five 5 people at Heathrow Airport',
      location: {
        name: 'Heathrow Airport',
        latitude: 51.4700,
        longitude: -0.4543,
      },
      reward: 'Social Butterfly NFT',
      distance: 15.8,
    },
  ]);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={challenges}
        ListHeaderComponent={() => (
          <LinearGradient
            colors={['#6C5CE7', '#45AAF2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.header]}>
            <ThemedText style={styles.headerTitle}>Daily Challenges</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Complete challenges to earn rewards!</ThemedText>
          </LinearGradient>
        )}
        renderItem={({ item }) => (
          <ChallengeCard
            challenge={item}
            onPress={() => {
              router.push(`/challenge/${item.id}`);
            }}
          />
        )}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + 90 } // Add extra padding for tab bar
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 24,
    // paddingTop: 16,
    // paddingBottom: 32,
    borderRadius: 24,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});
