import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PointsModal = ({ visible, points, onClose }) => {
  const handleHooray = () => {
    // Call the onClose prop to dismiss the modal
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
          <View style={styles.contentContainer}>
          <ImageBackground  style={styles.background} source={require('../../assets/redeem_points.png')}>
            <View style={styles.pointsCircleContainer}>
              <View style={styles.pointsContent}>
                <Text style={styles.pointsNumber}>{points}</Text>
                <Text style={styles.pointsText}>Points</Text>
              </View>
            </View>
            <View style={styles.congratsContainer}>
              <Text style={styles.congratsText}>
                Congratulations! You have won {points} points
              </Text>
            </View>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleHooray}
            >
              <LinearGradient
                colors={['#3F63CB', '#679BFF']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Hooray </Text>
              </LinearGradient>
            </TouchableOpacity>
            </ImageBackground>
          </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#252830',
    borderRadius: 20,
    width: 400,
    height: 400,
  },
  pointsCircleContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  pointsContent: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pointsNumber: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pointsText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  congratsContainer: {
    width: '60%',
  },
  congratsText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  buttonContainer: {
    overflow: 'hidden',
    borderRadius: 15,
  },
  button: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }
});

export default PointsModal;