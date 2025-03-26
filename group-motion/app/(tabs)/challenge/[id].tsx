import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { NFTService } from '@/services/nft';
import { WalletService } from '@/services/wallet';
import { TensorflowWebview } from '@/components/TensorflowWebview';

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
  const [isCompleting, setIsCompleting] = useState(false);
  const [showWebview, setShowWebview] = useState(false);
  const [isChallengeCompleted, setIsChallengeCompleted] = useState(false);

  // This would normally come from an API or database
  const challenges = {
    '1': {
      id: '1',
      title: 'Pushup Challenge',
      description: 'Complete 10 pushups outside London Bridge',
      location: {
        name: 'London Bridge',
        latitude: 51.5074,
        longitude: -0.0878,
      },
      reward: 'Pushup Master NFT',
    },
    '2': {
      id: '2',
      title: 'Kindness Challenge',
      description: 'Compliment 10 people outside New Cross',
      location: {
        name: 'New Cross',
        latitude: 51.4767,
        longitude: -0.0367,
      },
      reward: 'Kindness Champion NFT',
    },
    '3': {
      id: '3',
      title: 'High Five Challenge',
      description: 'High five 5 people at Heathrow Airport',
      location: {
        name: 'Heathrow Airport',
        latitude: 51.4700,
        longitude: -0.4543,
      },
      reward: 'Social Butterfly NFT',
    },
    '4': {
      id: '4',
      title: 'High Five Challenge',
      description: 'High five 5 people at Heathrow Airport',
      location: {
        name: 'Heathrow Airport',
        latitude: 51.4700,
        longitude: -0.4543,
      },
      reward: 'Social Butterfly NFT',
    },
  };

  const challenge = challenges[id as keyof typeof challenges];

  useEffect(() => {
    if (!challenge) {
      // If challenge not found, go back to discover screen
      router.replace('/');
      return;
    }

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
  }, [challenge]);



  const handleStartChallenge = async () => {
    setShowWebview(true);
    setTimeout(() => {
      setShowWebview(false);
      setIsChallengeCompleted(true);
    }, 20000);

    // try {
    //   setIsCompleting(true);

    //   // Get wallet address
    //   const walletAddress = await WalletService.getWalletAddress();

    //   // Mint NFT reward
    //   const nftAddress = await NFTService.mintNFT(
    //     challenge.title,
    //     challenge.reward
    //   );

    //   // Show success message
    //   Alert.alert(
    //     'Challenge Completed! 🎉',
    //     `You've earned the ${challenge.reward} NFT!\n\nWallet: ${walletAddress}\nNFT: ${nftAddress}`,
    //     [
    //       {
    //         text: 'View Rewards',
    //         onPress: () => router.push('/rewards'),
    //       },
    //       {
    //         text: 'Back to Challenges',
    //         onPress: () => router.back(),
    //       },
    //     ]
    //   );
    // } catch (error) {
    //   console.error('Error completing challenge:', error);
    //   Alert.alert(
    //     'Error',
    //     'Failed to complete challenge. Please try again.'
    //   );
    // } finally {
    //   setIsCompleting(false);
    // }
  };

  if (!challenge) {
    return null;
  }

  return (
    <View style={styles.container}>
      {showWebview && !isChallengeCompleted && <TensorflowWebview />}
      {!showWebview && !isChallengeCompleted && <LinearGradient
        colors={[colors.challengeGradientStart, colors.challengeGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.content}>
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
            { opacity: isCompleting ? 0.5 : 1 }
          ]}
          disabled={isCompleting}
          onPress={handleStartChallenge}>
          <LinearGradient
            colors={['#4CAF50', '#45AAF2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButtonGradient}>
            <ThemedText style={styles.startButtonText}>
              {isCompleting ? 'Completing...' : 'Start Challenge'}
            </ThemedText>
            {/* <FontAwesome5 name="check" size={16} color="#FFFFFF" /> */}
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>}
      {isChallengeCompleted && <View style={{
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.challengeGradientStart,
        margin: 16,
        borderRadius: 24,
      }}>
        <ThemedText style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center',
        }}>Challenge Completed!</ThemedText>
      </View>}
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
    margin: 16,
    padding: 24,
    borderRadius: 24,
  },
  challengeInfo: {
    flex: 1,
    gap: 24,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
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