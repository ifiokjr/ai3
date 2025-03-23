import { View, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

interface Reward {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'nft' | 'badge';
}

const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'Pushup Master NFT',
    description: 'Completed the Pushup Challenge at London Bridge',
    date: '2024-03-15',
    type: 'nft',
  },
  {
    id: '2',
    title: 'Kindness Champion NFT',
    description: 'Completed the Kindness Challenge at New Cross',
    date: '2024-03-14',
    type: 'nft',
  },
  {
    id: '3',
    title: 'Early Bird Badge',
    description: 'Completed 5 challenges in the morning',
    date: '2024-03-13',
    type: 'badge',
  },
];

function RewardCard({ reward }: { reward: Reward }) {
  return (
    <LinearGradient
      colors={['#6C5CE7', '#45AAF2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.rewardCard}>
      <View style={styles.rewardIcon}>
        <FontAwesome5
          name={reward.type === 'nft' ? 'medal' : 'award'}
          size={24}
          color="#FFD700"
        />
      </View>
      <View style={styles.rewardContent}>
        <ThemedText style={styles.rewardTitle}>{reward.title}</ThemedText>
        <ThemedText style={styles.rewardDescription}>
          {reward.description}
        </ThemedText>
        <ThemedText style={styles.rewardDate}>
          Earned on {new Date(reward.date).toLocaleDateString()}
        </ThemedText>
      </View>
    </LinearGradient>
  );
}

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={mockRewards}
        ListHeaderComponent={() => (
          <LinearGradient
            colors={['#6C5CE7', '#45AAF2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}>
            <ThemedText style={styles.headerTitle}>Your Rewards</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Collect NFTs and badges by completing challenges!
            </ThemedText>
          </LinearGradient>
        )}
        renderItem={({ item }) => <RewardCard reward={item} />}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + 90 },
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
    paddingBottom: 32,
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
  rewardCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  rewardDate: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
  },
});