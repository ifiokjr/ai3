import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Platform, StyleSheet, View, Text, Button} from 'react-native';
import {CameraView, CameraType, useCameraPermissions} from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import {cameraWithTensors} from '@tensorflow/tfjs-react-native';
import {Canvas, Circle} from '@shopify/react-native-skia';

const TensorCamera = cameraWithTensors(CameraView);

const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';

const CAM_PREVIEW_WIDTH = Dimensions.get('window').width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);
const OUTPUT_TENSOR_WIDTH = 180;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

const LINE_WIDTH = 5;
const EMOJI_SIZE = 50;
const MIN_CONFIDENCE = 0.45;

function App(): JSX.Element {
  const [hasPermission, setHasPermission] = useState(false);
  const [position, setPosition] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [currentPose, setCurrentPose] = useState<poseDetection.Pose | null>(null);
  const cameraRef = useRef<any>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    async function loadTensorFlow() {
      await tf.ready();
      await tf.setBackend('rn-webgl');
      console.log('TensorFlow is ready');
    }
    loadTensorFlow();
  }, []);

  const handleCameraStream = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: any
  ) => {
    const loop = async () => {
      const imageTensor = images.next().value as tf.Tensor3D;
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        }
      );
      const poses = await detector.estimatePoses(imageTensor);
      setCurrentPose(poses[0]);
      tf.dispose([imageTensor]);
      
      if (rafId.current === 0) return;
      
      updatePreview();
      gl.endFrameEXP();
      
      rafId.current = requestAnimationFrame(loop);
    };
    
    loop();
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TensorCamera
        ref={cameraRef}
        style={styles.camera}
        facing={position}
        onReady={handleCameraStream}
        resizeWidth={OUTPUT_TENSOR_WIDTH}
        resizeHeight={OUTPUT_TENSOR_HEIGHT}
        resizeDepth={3}
        cameraTextureWidth={CAM_PREVIEW_WIDTH}
        cameraTextureHeight={CAM_PREVIEW_HEIGHT}
        useCustomShadersToResize={false}
        autorender={false}
      />
      {currentPose && (
        <Canvas style={StyleSheet.absoluteFill}>
          {currentPose.keypoints.map((point, index) => (
            <Circle key={index} cx={point.x} cy={point.y} r={5} color="red" />
          ))}
        </Canvas>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  camera: {
    flex: 1,
  },
  message: {
    marginBottom: 20,
  },
});

export default App;