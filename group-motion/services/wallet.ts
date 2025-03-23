import * as SecureStore from 'expo-secure-store';
import { Keypair } from '@solana/web3.js';
import { Buffer } from 'buffer';

const WALLET_KEY = 'solana_wallet';

export class WalletService {
  static async getOrCreateWallet(): Promise<Keypair> {
    try {
      const storedKey = await SecureStore.getItemAsync(WALLET_KEY);
      if (storedKey) {
        const secretKey = Buffer.from(JSON.parse(storedKey));
        return Keypair.fromSecretKey(secretKey);
      }

      const newWallet = Keypair.generate();
      await SecureStore.setItemAsync(
        WALLET_KEY,
        JSON.stringify(Array.from(newWallet.secretKey))
      );
      return newWallet;
    } catch (error) {
      console.error('Error managing wallet:', error);
      throw error;
    }
  }

  static async getWalletAddress(): Promise<string> {
    const wallet = await this.getOrCreateWallet();
    return wallet.publicKey.toString();
  }
}