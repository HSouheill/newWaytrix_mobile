import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator, FlatList, Image, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ipAddress from '../../../config';
import { LinearGradient } from 'expo-linear-gradient';

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemmodalVisible, setItemModalVisible] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [userPoints, setUserPoints] = useState(0);

  const fetchUserPoints = async () => {
    try {
      const customerToken = await AsyncStorage.getItem('customerToken');
      const customerId = await AsyncStorage.getItem('customerId');
      if (customerToken && customerId) {
        const response = await axios.post(
          `${ipAddress}/api/ContactUsRoutes/getTotalPoints`,
          { customerId },
          {
            headers: { Authorization: customerToken }
          }
        );
        if (response.data && response.data.length > 0) {
          setUserPoints(response.data[0].points);
        }
      }
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  const fetchVouchers = async () => {
    try {
      const customerToken = await AsyncStorage.getItem('customerToken');
      const restoId = await AsyncStorage.getItem('restoId');
      if (!customerToken) throw new Error('Customer token not found');

      const response = await axios.post(
        `${ipAddress}/api/ContactUsRoutes/GetAllVouchers`,
        { restoId },
        {
          headers: {
            Authorization: customerToken,
          }
        }
      );

      const transformedData = response.data.map(voucher => ({
        ...voucher,
        category: voucher.category || 'Uncategorized',
        discount: voucher.discount || '20'
      }));

      setVouchers(transformedData);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchUserPoints();
    const interval = setInterval(() => {
      fetchVouchers();
      fetchUserPoints();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRedeemClick = (voucher) => {
    if (userPoints < voucher.pointsCost) {
      setErrorModal(true);
      setTimeout(() => setErrorModal(false), 3000);
      return;
    }
    setSelectedVoucher(voucher);
    setModalVisible(true);
  };


  const handleConfirmRedeem = async () => {
    if (!selectedVoucher) return;
    
    try {
      const customerToken = await AsyncStorage.getItem('customerToken');
      const customerId = await AsyncStorage.getItem('customerId');
      const restoId = await AsyncStorage.getItem('restoId');

      const response = await axios.post(
        `${ipAddress}/api/ContactUsRoutes/Redeem`,
        {
          _id: selectedVoucher._id,
          customerId,
          restoId,
          pointsCost: selectedVoucher.pointsCost
        },
        {
          headers: {
            Authorization: customerToken
          }
        }
      );

      // Update local points state after successful redemption
      setUserPoints(prevPoints => prevPoints - selectedVoucher.pointsCost);
      setModalVisible(false);
      setItemModalVisible(true);
      fetchUserPoints(); // Refresh points from server
    } catch (error) {
      console.error('Error redeeming voucher:', error);
      setErrorModal(true);
      setTimeout(() => setErrorModal(false), 3000);
    }
  };

  const renderCategoryHeader = (title) => (
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryTitle}>{title}</Text>
    </View>
  );

  const renderVoucherGrid = ({ item }) => (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}% Off</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image source={{ uri: item.image }} style={styles.logo} />
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.redeemButton,
          userPoints < item.pointsCost && styles.disabledButton
        ]}
        onPress={() => handleRedeemClick(item)}
        disabled={userPoints < item.pointsCost}
      >
        <LinearGradient
          colors={userPoints < item.pointsCost ? ['#666666', '#999999'] : ['#3F63CB', '#679BFF']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.redeemText}>
            {userPoints < item.pointsCost 
              ? `Need ${item.pointsCost - userPoints} more points` 
              : `Redeem For ${item.pointsCost} Points`}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderCategory = (category, items) => (
    <View style={styles.categorySection}>
      {renderCategoryHeader(category)}
      <View style={styles.gridContainer}>
        {items.map((item, index) => (
          <View key={item._id || index} style={styles.gridItem}>
            {renderVoucherGrid({ item })}
          </View>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const groupedVouchers = vouchers.reduce((acc, voucher) => {
    if (!acc[voucher.category]) {
      acc[voucher.category] = [];
    }
    acc[voucher.category].push(voucher);
    return acc;
  }, {});

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        {Object.entries(groupedVouchers).map(([category, items]) => 
          renderCategory(category, items)
        )}

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            
            <LinearGradient
                        colors={['#000000', '#003266']}
                        style={styles.linearContent}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                      >

<TouchableOpacity 
                          style={styles.closeButton} 
                          onPress={() => setModalVisible(false)}
                        >
                          <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>

            <View style={styles.modalContent}>
            
              <Text style={styles.modalText}>
              Are you sure do you want to redeem this voucher?</Text>
              <View style={styles.modalButtons}>
                
                <TouchableOpacity onPress={handleConfirmRedeem}>
                  <LinearGradient
                    colors={['#3F63CB', '#679BFF']}
                    style={styles.acceptbutton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.accepttext}>Redeem Voucher</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            </LinearGradient>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={errorModal}
          onRequestClose={() => setErrorModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Insufficient points to redeem this voucher!
              </Text>
            </View>
          </View>
          
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={itemmodalVisible}
          onRequestClose={() => setItemModalVisible(false)}
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
                onPress={() => setItemModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              
              <Text style={styles.modalTitle}>Voucher</Text>
              
              {selectedVoucher && (
                <View style={styles.partnerDetails}>
                  <Image 
                    source={{ uri: selectedVoucher.image }}
                    style={styles.modalLogo}
                    resizeMode="contain"
                  />
                  <View style={styles.detailsContainer}>
                    <Text style={styles.detailLabel}>Brand's Name: 
                      <Text style={styles.detailText}> {selectedVoucher.name}</Text>
                    </Text>
                    
                    <Text style={styles.detailLabel}>Description: 
                      <Text style={styles.detailText}> {selectedVoucher.description}</Text>
                    </Text>
                  </View>
                </View>
              )}
            </LinearGradient>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    marginBottom: 16,
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 5,
  },
  cardWrapper: {
    alignItems: 'center',
  },
  gridItem: {
    width: '30%',
    marginBottom: 16,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(49, 49, 49, 0.4)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
    alignItems: 'center',
    position: 'relative',

  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF5353B2',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {      
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  brandName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,

  },
  redeemButton: {
    borderRadius: 8,
    width: "100%",
    overflow: 'hidden', // Ensures the gradient does not spill outside the border radius
    
  },
  redeemText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    // backgroundColor: '#1E2A45',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  acceptbutton: {
    marginTop:20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
  },
  accepttext: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 5,
    zIndex: 1,
    // marginBottom: 40
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  linearContent: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',

  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default Vouchers;