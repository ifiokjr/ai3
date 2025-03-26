import { Camera, CameraView } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import * as tf from '@tensorflow/tfjs-react-native';

export default function CameraScreen() {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [isRecording, setIsRecording] = useState(false);
	const cameraRef = useRef<any>(null);
	const [model, setModel] = useState<any | null>(null);

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");

			// // Initialize TensorFlow.js
			// await tf.ready();
			// await tf.setBackend('rn-webgl');

			// Load the model (you'll need to add your model files)
			// const modelJson = require('../assets/model/model.json');
			// const modelWeights = require('../assets/model/weights.bin');
			// const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
			// setModel(model);
		})();
	}, []);

	const startRecording = async () => {
		if (cameraRef.current) {
			setIsRecording(true);
			const video = await cameraRef.current.recordAsync();
			// Process the video with TensorFlow.js
			// This is where you'd implement your motion detection logic
		}
	};

	const stopRecording = async () => {
		if (cameraRef.current) {
			setIsRecording(false);
			await cameraRef.current.stopRecording();
		}
	};

	if (hasPermission === null) {
		return <View />;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={styles.container}>
			<CameraView
				ref={cameraRef}
				style={styles.camera}
				// type={Camera.Constants.Type.back}
			>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={[styles.button, isRecording && styles.recordingButton]}
						onPress={isRecording ? stopRecording : startRecording}
					>
						<Text style={styles.buttonText}>
							{isRecording ? "Stop Recording" : "Start Recording"}
						</Text>
					</TouchableOpacity>
				</View>
			</CameraView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		backgroundColor: "transparent",
		flexDirection: "row",
		justifyContent: "center",
		margin: 20,
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
	},
	button: {
		backgroundColor: "#007AFF",
		padding: 15,
		borderRadius: 25,
		alignSelf: "flex-end",
		marginBottom: 20,
	},
	recordingButton: {
		backgroundColor: "#FF3B30",
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
});
