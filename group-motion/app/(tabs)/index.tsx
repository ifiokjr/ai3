import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';

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
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Pushup Challenge',
      description: 'Complete 10 pushups outside London Bridge',
      location: {
        name: 'London Bridge',
        latitude: 51.5074,
        longitude: -0.0878,
      },
      reward: 'Pushup Master NFT',
      distance: 0.5,
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
      distance: 1.2,
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

  const renderChallenge = ({ item }: { item: Challenge }) => (
    <TouchableOpacity style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>{item.title}</Text>
        <FontAwesome name="trophy" size={20} color="#FFD700" />
      </View>
      <Text style={styles.challengeDescription}>{item.description}</Text>
      <View style={styles.challengeFooter}>
        <Text style={styles.locationText}>
          <FontAwesome name="map-marker" size={16} color="#666" /> {item.location.name}
        </Text>
        <Text style={styles.distanceText}>{item.distance} km away</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  distanceText: {
    fontSize: 14,
    color: '#007AFF',
  },
});
