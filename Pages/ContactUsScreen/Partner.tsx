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
    setSelectedPartner(partner);
    setModalVisible(true);
    setQrcodeModal(true);
    setTimeout(() => {
      setQrcodeModal(false);
      setModalVisible(false);
    }, 4000);
  };

//   const fetchQrCode = async () => {
//     try {
//         const response = await axios.get(`${ipAddress}/api/ContactUsRoutes/getQrCode`, {
//             headers: {
//                 'Authorization': localStorage.getItem('waytrixToken')
//             }
//         });
//         if (response.data.qrCodeImage) {
//             setPreviewUrl(response.data.qrCodeImage);
//         }
//     } catch (error) {
//         console.error('Error fetching QR code:', error);
//     }
// };

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
              {/* <Image source={{ uri: selectedPartner.qrCodeImage }} style={styles.qrImage} /> */}
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
    // backgroundColor: '#001220',
    // padding: 15,
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
    justifyContent: 'space-between',
    // paddingHorizontal: 5,
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
  // partnersContainer: {
  //   width: '100%',
  //   marginBottom: 20,
  // },
  // contentContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   gap: 20,
  //   marginTop: 10,
  //   marginBottom: 10,
  // },
  // partnerCard: {
  //   backgroundColor: 'rgba(49, 49, 49, 0.4)',
  //   borderRadius: 10,
  //   padding: 20,
  //   width: 160,
  //   alignItems: 'center',
  // },
  // partnerImage: {
  //   width: 150,
  //   height: 80,
  //   resizeMode: 'contain',
  // },
  // buttonsContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   gap: 20,
  //   paddingHorizontal: 20,
  //   marginBottom: 20,
  // },
  // viewDetailsButton: {
  //   backgroundColor: '#3F63CB',
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  //   borderRadius: 10,
  //   width: 160,
  // },
  // viewDetailsText: {
  //   color: 'white',
  //   textAlign: 'center',
  //   fontSize: 16,
  // },
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
    width: 200, // Decreased width
    height: 250, // Keeping the height the same
    // backgroundColor: 'white',
    borderRadius: 20,
    padding: 10, // Adjust padding if necessary
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: 180, // Adjust the image width to fit the new modal size
    height:180, // Adjust the image height if necessary
    resizeMode: 'contain',
  },
});

export default Partner;

