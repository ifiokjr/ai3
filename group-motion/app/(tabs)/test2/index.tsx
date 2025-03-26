import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as tfReactNative from '@tensorflow/tfjs-react-native';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { Canvas, Circle } from '@shopify/react-native-skia';

const targetPoses = [
  { name: "T-Pose", keypoints: [ { x: 200, y: 100 }, { x: 300, y: 100 } ] }, // Fake pose example
  { name: "Hands Up", keypoints: [ { x: 250, y: 50 }, { x: 250, y: 200 } ] }
];

export default function App() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [pose, setPose] = useState<poseDetection.Pose | null>(null);
  const [targetPose, setTargetPose] = useState(targetPoses[0]);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    async function loadTensorFlow() {
      await tf.ready();
      await tf.setBackend('rn-webgl');
      console.log('TensorFlow is ready');
    }
    loadTensorFlow();
  }, []);

  function randomPose() {
    const newPose = targetPoses[Math.floor(Math.random() * targetPoses.length)];
    setTargetPose(newPose);
  }

  async function estimatePose() {
    if (!cameraRef.current) return;

    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
    const frame = await cameraRef.current.takePictureAsync({ base64: true });
    if (!frame) return;

    const imageTensor = tf.tensor3d(Buffer.from(frame.base64!, 'base64'), [frame.height, frame.width, 3]);
    const poses = await detector.estimatePoses(imageTensor);
    setPose(poses[0]); // Get first detected pose

    checkPoseMatch(poses[0]);
  }

  function checkPoseMatch(playerPose: poseDetection.Pose | null) {
    if (!playerPose) return;

    let score = 0;
    playerPose.keypoints.forEach((point, index) => {
      const targetPoint = targetPose.keypoints[index];
      if (targetPoint) {
        const distance = Math.sqrt((point.x - targetPoint.x) ** 2 + (point.y - targetPoint.y) ** 2);
        if (distance < 50) score++;
      }
    });

    if (score > 3) {
      alert("Great Match! 🎉");
    } else {
      alert("Try Again! 😅");
    }
  }

  if (!permission) return <View />;
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
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <Text style={styles.poseText}>Target Pose: {targetPose.name}</Text>
        <TouchableOpacity style={styles.button} onPress={estimatePose}>
          <Text style={styles.text}>Detect Pose</Text>
        </TouchableOpacity>

        {pose && (
          <Canvas style={StyleSheet.absoluteFill}>
            {pose.keypoints.map((point, index) => (
              <Circle key={index} cx={point.x} cy={point.y} r={5} color="red" />
            ))}
          </Canvas>
        )}
      </CameraView>

      <TouchableOpacity style={styles.button} onPress={randomPose}>
        <Text style={styles.text}>New Pose</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
        <Text style={styles.text}>Flip Camera</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  message: { textAlign: 'center', paddingBottom: 10 },
  camera: { flex: 1 },
  poseText: { position: 'absolute', top: 50, left: 50, fontSize: 20, fontWeight: 'bold', color: 'white' },
  button: { alignSelf: 'center', padding: 10, backgroundColor: 'blue', margin: 10 },
  text: { fontSize: 18, color: 'white' },
});
