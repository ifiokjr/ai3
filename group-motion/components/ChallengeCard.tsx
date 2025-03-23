import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

interface ChallengeCardProps {
  challenge: {
    title: string;
    description: string;
    location: {
      name: string;
    };
    distance: number;
  };
  onPress: () => void;
}

export function ChallengeCard({ challenge, onPress }: ChallengeCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <LinearGradient
        colors={[colors.challengeGradientStart, colors.challengeGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <ThemedText style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {challenge.title}
            </ThemedText>
            <View style={styles.trophyContainer}>
              <FontAwesome5 name="trophy" size={20} color="#FFD700" />
            </View>
          </View>

          <ThemedText style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {challenge.description}
          </ThemedText>

          <View style={styles.locationRow}>
            <FontAwesome5 name="map-marker-alt" size={16} color="#FFFFFF" />
            <ThemedText style={styles.location} numberOfLines={1} ellipsizeMode="tail">
              {challenge.location.name}
            </ThemedText>
            <ThemedText style={styles.distance}>{challenge.distance} km away</ThemedText>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  trophyContainer: {
    width: 24,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 12,
    lineHeight: 22,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  location: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
  distance: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    marginLeft: 'auto',
  },
});