import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

interface NFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedDate: string;
}

export default function RewardsScreen() {
  const [nfts, setNfts] = useState<NFT[]>([
    {
      id: '1',
      name: 'Pushup Master',
      description: 'Completed 10 pushups challenge',
      imageUrl: 'https://via.placeholder.com/150',
      earnedDate: '2024-03-23',
    },
    {
      id: '2',
      name: 'Kindness Champion',
      description: 'Completed kindness challenge',
      imageUrl: 'https://via.placeholder.com/150',
      earnedDate: '2024-03-22',
    },
  ]);

  const renderNFT = ({ item }: { item: NFT }) => (
    <View style={styles.nftCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.nftImage} />
      <View style={styles.nftInfo}>
        <Text style={styles.nftName}>{item.name}</Text>
        <Text style={styles.nftDescription}>{item.description}</Text>
        <Text style={styles.earnedDate}>Earned: {item.earnedDate}</Text>
      </View>
      <FontAwesome name="trophy" size={24} color="#FFD700" style={styles.trophyIcon} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Rewards</Text>
        <Text style={styles.subtitle}>{nfts.length} NFTs earned</Text>
      </View>
      <FlatList
        data={nfts}
        renderItem={renderNFT}
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
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  nftCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nftImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  nftInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nftName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nftDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  earnedDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  trophyIcon: {
    marginLeft: 16,
  },
});