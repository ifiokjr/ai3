import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Platform, StyleSheet, useWindowDimensions} from 'react-native';
import {CameraView, CameraType, useCameraPermissions} from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import * as tfReactNative from '@tensorflow/tfjs-react-native';
import * as poseDetection from '@tensorflow-models/pose-detection';
import {cameraWithTensors} from '@tensorflow/tfjs-react-native';
import {Canvas, Circle} from '@shopify/react-native-skia';
import {Button, Text, TouchableOpacity, View} from 'react-native';

const TensorCamera = cameraWithTensors(CameraView);

const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';

// Camera preview size
const CAM_PREVIEW_WIDTH = Dimensions.get('window').width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// The size of the resized output from TensorCamera
const OUTPUT_TENSOR_WIDTH = 180;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

const targetPoses = [
  { name: "T-Pose", keypoints: [ { x: 200, y: 100 }, { x: 300, y: 100 } ] },
  { name: "Hands Up", keypoints: [ { x: 250, y: 50 }, { x: 250, y: 200 } ] }
];

export default function App() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [currentPose, setCurrentPose] = useState<poseDetection.Pose | null>(null);
  const [targetPose, setTargetPose] = useState(targetPoses[0]);
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
        poseDetection.SupportedModels.MoveNet
      );
      const poses = await detector.estimatePoses(imageTensor);
      setCurrentPose(poses[0]);
      tf.dispose([imageTensor]);
      
      if (rafId.current === 0) {
        return;
      }
      
      updatePreview();
      gl.endFrameEXP();
      
      rafId.current = requestAnimationFrame(loop);
    };
    
    loop();
  };

  function randomPose() {
    const newPose = targetPoses[Math.floor(Math.random() * targetPoses.length)];
    setTargetPose(newPose);
  }

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
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
        facing={facing}
        onReady={handleCameraStream}
        resizeWidth={OUTPUT_TENSOR_WIDTH}
        resizeHeight={OUTPUT_TENSOR_HEIGHT}
        resizeDepth={3}
        cameraTextureWidth={CAM_PREVIEW_WIDTH}
        cameraTextureHeight={CAM_PREVIEW_HEIGHT}
        useCustomShadersToResize={false}
        autorender={false}
      />
      <Text style={styles.poseText}>Target Pose: {targetPose.name}</Text>
      <TouchableOpacity style={styles.button} onPress={randomPose}>
        <Text style={styles.text}>New Pose</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
        <Text style={styles.text}>Flip Camera</Text>
      </TouchableOpacity>

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
  poseText: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    marginBottom: 20,
  },
});