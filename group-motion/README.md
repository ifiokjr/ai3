# Group Motion - Location-Based Challenge App 🎯

A mobile application that turns real-world locations into interactive challenge zones where users can complete various motion-based tasks and earn rewards.

## Overview

Group Motion is an MVP for a location-based challenges app that encourages social interaction and physical activity through gamified challenges at specific locations. The app combines real-world locations with motion detection technology to create an engaging experience.

## Features

- **Location-Based Challenges**: Find and complete challenges at specific locations
- **Motion Detection**: Uses device camera and TensorFlow.js to detect and validate challenge completion
- **Social Gaming**: Best played in pairs where one person films while the other performs the challenge
- **Reward System**: Earn NFT rewards for completing challenges
- **Real-World Examples**:
  - 10 pushups outside London Bridge
  - Compliment 10 people outside New Cross
  - High five 5 people at Heathrow Airport

## How It Works

1. **Find Challenges**: Browse nearby challenges based on your location
2. **Team Up**: The app is designed for pair play:
   - One person films the challenge
   - The other person performs the required motion
3. **Complete Challenges**: Use the device camera to validate motion completion
4. **Earn Rewards**: Both participants receive NFT rewards upon successful completion

## Technical Stack

- Built with Expo and React Native
- Uses TensorFlow.js for motion detection
- Implements location services for challenge discovery
- Features a modern UI with Tamagui components

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the app:
   ```bash
   pnpm start
   ```

3. Open the app in:
   - iOS Simulator
   - Android Emulator
   - Expo Go on your physical device

## Development

The project uses file-based routing with the Expo Router. Main development files are located in the **app** directory.

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [Tamagui Documentation](https://tamagui.dev/)

## Join the Community

- [Expo on GitHub](https://github.com/expo/expo)
- [Discord Community](https://chat.expo.dev)
