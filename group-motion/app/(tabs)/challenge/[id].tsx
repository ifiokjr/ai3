import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export default function ChallengeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // This would normally come from an API or database
  const challenge = {
    id: '1',
    title: 'Pushup Challenge',
    description: 'Complete 10 pushups outside London Bridge',
    location: {
      name: 'London Bridge',
      latitude: 51.5074,
      longitude: -0.0878,
    },
    reward: 'Pushup Master NFT',
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);

      if (location) {
        const dist = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          challenge.location.latitude,
          challenge.location.longitude
        );
        setDistance(dist);
      }
    })();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[colors.challengeGradientStart, colors.challengeGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome5 name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.trophyContainer}>
            <FontAwesome5 name="trophy" size={24} color="#FFD700" />
          </View>
        </View>

        <View style={styles.challengeInfo}>
          <ThemedText style={styles.title}>{challenge.title}</ThemedText>
          <ThemedText style={styles.description}>{challenge.description}</ThemedText>

          <View style={styles.locationContainer}>
            <FontAwesome5 name="map-marker-alt" size={20} color="#FFFFFF" />
            <ThemedText style={styles.location}>{challenge.location.name}</ThemedText>
          </View>

          {distance !== null && (
            <View style={styles.distanceContainer}>
              <FontAwesome5 name="walking" size={20} color="#FFFFFF" />
              <ThemedText style={styles.distance}>
                {distance.toFixed(1)} km away
              </ThemedText>
            </View>
          )}

          <View style={styles.rewardContainer}>
            <FontAwesome5 name="medal" size={20} color="#FFD700" />
            <ThemedText style={styles.reward}>Reward: {challenge.reward}</ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.startButton,
            { opacity: distance && distance <= 0.1 ? 1 : 0.5 }
          ]}
          disabled={!distance || distance > 0.1}
          onPress={() => {
            // Handle starting the challenge
            router.push('/challenge/recording');
          }}>
          <LinearGradient
            colors={['#4CAF50', '#45AAF2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButtonGradient}>
            <ThemedText style={styles.startButtonText}>
              {distance && distance <= 0.1 ? 'Start Challenge' : 'Get Closer to Start'}
            </ThemedText>
            <FontAwesome5 name="play" size={16} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    borderRadius: 24,
    margin: 16,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
  },
  trophyContainer: {
    padding: 8,
  },
  challengeInfo: {
    flex: 1,
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  location: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  distance: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reward: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  startButton: {
    marginTop: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});