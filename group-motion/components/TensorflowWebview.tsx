import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { Camera, useCameraPermissions } from 'expo-camera';

const API_KEY = "8cc83175-58e8-4800-8c02-38661ae2e5de";
const POSETRACKER_API = "https://app.posetracker.com/pose_tracker/tracking";
const { width, height } = Dimensions.get('window');

interface TensorflowWebviewProps {
  cameraType?: 'front' | 'back';
}

interface PoseTrackerInfo {
  type: string;
  ready: boolean;
  postureDirection?: string;
}

interface CounterInfo {
  type: 'counter';
  current_count: number;
}

type WebViewInfo = PoseTrackerInfo | CounterInfo;

const isCounterInfo = (info: WebViewInfo): info is CounterInfo => {
  return info.type === 'counter';
};

export const TensorflowWebview: React.FC<TensorflowWebviewProps> = ({
  cameraType = 'front'
}) => {
  const [poseTrackerInfos, setCurrentPoseTrackerInfos] = useState<PoseTrackerInfo | null>(null);
  const [repsCounter, setRepsCounter] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const exercise = "squat";
  const difficulty = "easy";
  const skeleton = true;

  const posetracker_url = `${POSETRACKER_API}?token=${API_KEY}&exercise=${exercise}&difficulty=${difficulty}&width=${width}&height=${height}&camera=${cameraType}`;

  // Bridge JavaScript BETWEEN POSETRACKER & YOUR APP
  const jsBridge = `
    window.addEventListener('message', function(event) {
      window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
    });

    window.webViewCallback = function(data) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    };

    const originalPostMessage = window.postMessage;
    window.postMessage = function(data) {
      window.ReactNativeWebView.postMessage(typeof data === 'string' ? data : JSON.stringify(data));
    };

    true; // Important for a correct injection
  `;

  const handleCounter = (count: number) => {
    setRepsCounter(count);
  };

  const handleInfos = (infos: PoseTrackerInfo) => {
    setCurrentPoseTrackerInfos(infos);
    console.log('Received infos:', infos);
  };

  const webViewCallback = (info: WebViewInfo) => {
    if (isCounterInfo(info)) {
      handleCounter(info.current_count);
    } else {
      handleInfos(info);
    }
  };

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      let parsedData: WebViewInfo;
      if (typeof event.nativeEvent.data === 'string') {
        parsedData = JSON.parse(event.nativeEvent.data);
      } else {
        parsedData = event.nativeEvent.data;
      }

      console.log('Parsed data:', parsedData);
      webViewCallback(parsedData);
    } catch (error) {
      console.error('Error processing message:', error);
      console.log('Problematic data:', event.nativeEvent.data);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        style={styles.webView}
        source={{ uri: posetracker_url }}
        originWhitelist={['*']}
        injectedJavaScript={jsBridge}
        onMessage={onMessage}
        debuggingEnabled={true}
        mixedContentMode="compatibility"
        onError={(syntheticEvent) => {
          console.warn('WebView error:', syntheticEvent.nativeEvent);
        }}
        onLoadingError={(syntheticEvent) => {
          console.warn('WebView loading error:', syntheticEvent.nativeEvent);
        }}
      />
      <View style={styles.infoContainer}>
        <Text>Status : {!poseTrackerInfos ? "loading AI..." : "AI Running"}</Text>
        <Text>Info type : {!poseTrackerInfos ? "loading AI..." : poseTrackerInfos.type}</Text>
        <Text>Counter: {repsCounter}</Text>
        {poseTrackerInfos?.ready === false ? (
          <>
            <Text>Placement ready: false</Text>
            <Text>Placement info: Move {poseTrackerInfos?.postureDirection}</Text>
          </>
        ) : (
          <>
            <Text>Placement ready: true</Text>
            <Text>Placement info: You can start doing squats 🏋️</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  webView: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  infoContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
  },
});
