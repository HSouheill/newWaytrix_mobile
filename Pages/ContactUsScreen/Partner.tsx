import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import ipAddress from '../../config';

const Partner = () => {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrcodeModal, setQrcodeModal] = useState(false);
  

  const fetchPartners = async () => {
    try {
      const restoId = await AsyncStorage.getItem('restoId');
      const token = await AsyncStorage.getItem('tableToken');

      if (restoId && token) {
        const response = await axios.post(
          `${ipAddress}/api/ContactUsRoutes/getPartnersByRestoId`,
          { restoId },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setPartners(response.data);
      } else {
        console.error('restoId or token not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  useEffect(() => {
    fetchPartners();
    const intervalId = setInterval(fetchPartners, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleViewDetails = (partner) => {
    setSelectedPartner(partner);
    setModalVisible(true);
  };

  const handleqrcode = (partner) => {
    if (!partner) {
      console.error("Attempted to show QR code for null partner");
      return;
    }
    
    setSelectedPartner(partner);
    
    // Add a small delay to ensure selectedPartner is set before opening the modal
    setTimeout(() => {
      setQrcodeModal(true);
      setModalVisible(true);
      
      // Auto-close after 10 seconds
      setTimeout(() => {
        setQrcodeModal(false);
        setModalVisible(false);
      }, 10000);
    }, 100);
  };

  useEffect(() => {
    if (selectedPartner) {
      console.log("Selected partner set:", selectedPartner.name);
      console.log("QR code URL:", selectedPartner.qrCodeImage);
    }
  }, [selectedPartner]);

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {partners.map((partner, index) => (
          <View key={index} style={styles.partnerCard}>
            <View style={styles.logoContainer}>
            <Image 
              source={{ uri: partner.logo }} 
              style={styles.logo}
              resizeMode="contain"
              onError={(e) => console.error('Image loading error:', e.nativeEvent.error, partner.logo)}
            />
            </View>

            <TouchableOpacity onPress={() => handleViewDetails(partner)}>
              <LinearGradient
                colors={['#3F63CB', '#679BFF']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>View Details</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <LinearGradient
            colors={['#000000', '#003266']}
            style={styles.modalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Partner</Text>
            
            {selectedPartner && (
              <View style={styles.partnerDetails}>
                <Image 
                  source={{ uri: selectedPartner.logo }}
                  style={styles.modalLogo}
                  resizeMode="contain"
                />
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailLabel}>Partner's Name: 
                    <Text style={styles.detailText}> {selectedPartner.name}</Text>
                  </Text>
                  <Text style={styles.detailLabel}>Partner's Phone Number: 
                    <Text style={styles.detailText}> {selectedPartner.phone}</Text>
                  </Text>
                  <Text style={styles.detailLabel}>Description: 
                    <Text style={styles.detailText}> {selectedPartner.description}</Text>
                  </Text>
                </View>
                <TouchableOpacity style={styles.socialButton} onPress={() => handleqrcode(selectedPartner)}>
                  <Text style={styles.socialButtonText}>Tap to scan for socials!</Text>
                </TouchableOpacity>
              </View>
            )}
          </LinearGradient>
        </View>
      </Modal>

      <Modal
  animationType="fade"
  transparent={true}
  visible={qrcodeModal}
  onRequestClose={() => setQrcodeModal(false)}
>
  <View style={styles.qrModalBackground}>
    <LinearGradient
      colors={['#000000', '#003266']}
      style={styles.qrModal}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.qrModalContent}>
        <Text style={styles.modalTitle}>Socials</Text>
        {selectedPartner && selectedPartner.qrCodeImage && (
          <Image source={{ uri: selectedPartner.qrCodeImage }} style={styles.qrImage} />
        )}
        {selectedPartner && !selectedPartner.qrCodeImage && (
          <Text style={{color: 'white'}}>No QR code available</Text>
        )}
      </View>
    </LinearGradient>
  </View>
</Modal>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 60) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#999999',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Changed from space-between to flex-start
    gap: 10, // Added gap for consistent spacing
  },
  partnerCard: {
    width: cardWidth,
    marginBottom: 20,
    alignItems: 'center',
  },
  logoContainer: {
    width: cardWidth - 20,
    height: cardWidth - 50,
    backgroundColor: 'rgba(49, 49, 49, 0.4)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  button: {
    paddingVertical: 8,
    borderRadius: 10,
    width: cardWidth - 20,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 25,
    textAlign: 'center',
  },
  modalLogo: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 25,
  },
  partnerDetails: {
    width: '100%',
    alignItems: 'center',
  },
  detailsContainer: {
    width: '100%',
    gap: 15,
  },
  detailLabel: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  detailText: {
    color: 'white',
    fontSize: 14,
  },
  socialButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  socialButtonText: {
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  qrModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrModal: {
    width: '90%',
    maxWidth: 250,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center'
  },
  qrModalContent: {
    width: 200,
    height: 250,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
});

export default Partner;