import React, { useState, useEffect } from 'react';
import { View, Text,Alert, StyleSheet, ActivityIndicator, FlatList, Image, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ipAddress from '../../../config';
const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [canRedeem, setCanRedeem] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showFormModall, setShowFormModall] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();
// redeemKey
const [redeemKey, setRedeemKey] = useState();
const fetchVouchers = async () => {
  console.log("hiewufhiuefhiurfhiuerhhiiiiiiiii")
  console.log("hiewufhiuefhiurfhiuerhhiiiiiiiii")
  console.log("hiewufhiuefhiurfhiuerhhiiiiiiiii")
  console.log("hiewufhiuefhiurfhiuerhhiiiiiiiii")
  console.log("hiewufhiuefhiurfhiuerhhiiiiiiiii")
  try {
    const customerToken = await AsyncStorage.getItem('customerToken');
    const restoId = await AsyncStorage.getItem('restoId');
console.log(restoId)
    if (!customerToken) throw new Error('Customer token not found');

    const response = await axios.post(`${ipAddress}/api/ContactUsRoutes/GetAllVouchers`, { restoId: restoId }, {
      headers: {
        Authorization: customerToken
      }
    });
    console.log(response)
    
    setVouchers(response.data);

  } catch (error) {
    console.error('Error fetching vouchers:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchVouchers();
    const interval = setInterval(fetchVouchers, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCanRedeem = async () => {
      const canRedeemValue = await AsyncStorage.getItem('canRedeem');
      setCanRedeem(canRedeemValue === 'true');
    };
  
    // Initial fetch when component mounts
    fetchCanRedeem();
  
    // Set interval to fetch every one second
    const interval = setInterval(fetchCanRedeem, 1000);
  
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);
  

  const redeemVoucher = async (voucherId, redeemKey) => {
    const customerId = await AsyncStorage.getItem('customerId');
    const restoId = await AsyncStorage.getItem('restoId');

    const customerToken = await AsyncStorage.getItem('customerToken');
    
    axios.post(`${ipAddress}/api/ContactUsRoutes/Redeem`, {
      _id: voucherId,
      customerId: customerId,
      restoId:restoId,
      redeemKey: redeemKey // Include redeemKey in the request body
    }, {
      headers: {
        Authorization: customerToken
      }
    })
      .then(async response => {
        setTimeout(() => {
          setShowFormModall(false);
        }, 3000);
  
        console.log('Voucher redeemed:', response.data);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          setTimeout(() => {
            navigation.navigate("Home")
          }, 1500);
        }, 5000);
        await AsyncStorage.removeItem('canRedeem'); // Remove the item from AsyncStorage
        setCanRedeem(false);
      })
      .catch(error => {
        console.error('Error redeeming voucher:', error);
        setErrorModal(true);
        setTimeout(() => {
          setErrorModal(false);
          setTimeout(() => {
            navigation.navigate("Home")
          }, 1500);
        }, 4000);
  
        setTimeout(() => {
          setShowFormModall(false);
        }, 2000);
      });
  };
  
  

  const renderVoucherCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.cardText}>{item.name}</Text>
        <Text style={styles.cardText}>{item.pointsCost} points</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        {canRedeem ? (
          <>
          <TouchableOpacity
          style={styles.redeemButton}
          onPress={() => setShowFormModall(true)}
        >
          <Text style={styles.redeemText}>Redeem</Text>
        </TouchableOpacity>
        {/* setErrorModal */}
        <Modal
        animationType="slide"
        transparent={true}
        visible={errorModal}
        onRequestClose={() => {
          setErrorModal(false);
        }}
      >
        <View style={styles.formModalContainer}>
          <View style={styles.formModalContent}>
          <Text style={styles.cardText}>Waytrix Team</Text>

            <Text style={styles.cardText}>We Feel sorry to inform you that your voucher is not redeemed</Text>
           
          </View>
        </View>
      </Modal>
        <Modal
        animationType="slide"
        transparent={true}
        visible={showFormModall}
        onRequestClose={() => {
          setShowFormModall(false);
        }}
      >
        <View style={styles.formModalContainer}>
          <View style={styles.formModalContent}>
            <Text style={styles.cardText}>Redeem Key:</Text>
            <TextInput
              style={styles.input}
              placeholder="Redeem Key"
              value={redeemKey}
              onChangeText={setRedeemKey}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.requestSMSButton}
              onPress={() => {
                redeemVoucher(item._id, redeemKey); // Pass redeemKey to redeemVoucher
                setShowFormModal(false);
              }}
            >
              <Text style={styles.requestSMSText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal></>
      
        ) : (
          <TouchableOpacity
          style={styles.redeemButton}
          onPress={() => setShowFormModal(true)}
        >
          <Text style={styles.redeemText}>Fill Form</Text>
        </TouchableOpacity>
          
        )}
      </View>
    </View>
  );

  const handleRequestSMS = async () => {
    try {
        const customerToken = await AsyncStorage.getItem('customerToken');
        const customerId = await AsyncStorage.getItem('customerId');
        
        const response = await axios.post(
            `${ipAddress}/api/ContactUsRoutes/UserRedeemInfo`,
            {
                customerId: customerId,
                redeemName: name,
                redeemPhone: phone
            },
            {
                headers: {
                    Authorization: customerToken
                }
            }
        );

        console.log('User redeem info sent:', response.data);
        await AsyncStorage.setItem('canRedeem', 'true');
        setCanRedeem(true);
        setShowFormModal(false);
    } catch (error) {
        console.error('Error sending user redeem info:', error);
        // You can add logic here to handle the error
    }
};


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={vouchers}
        renderItem={renderVoucherCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatListContent}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Redeemed Successfully!</Text>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showFormModal}
        onRequestClose={() => {
          setShowFormModal(false);
        }}
      >
        <View style={styles.formModalContainer}>
          <View style={styles.formModalContent}>
          <Text style={styles.cardText}>Name:</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
                    <Text style={styles.cardText}>Phone Num:</Text>

            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={styles.requestSMSButton}
              onPress={handleRequestSMS}
            >
              <Text style={styles.requestSMSText}>Request SMS Key</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  cardText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardDescription: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 50,
  },
  redeemButton: {
    backgroundColor: '#444',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  redeemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  flatListContent: {
    flexGrow: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(211, 211, 211, 0.5)',
    justifyContent: 'center',
    borderWidth: 1,
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#111',
    borderColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  formModalContainer: {
    flex: 1,
    
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formModalContent: {
    backgroundColor: '#111',
    borderWidth:2,
    borderColor:'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderWidth:2,
    borderColor:'gray',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  requestSMSButton: {
    backgroundColor: '#444',
    borderWidth:2,
    borderColor:'gray',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  requestSMSText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export default Vouchers;
