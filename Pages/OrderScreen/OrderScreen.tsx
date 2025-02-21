import React, { useState, useEffect, useCallback, useRef  } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Image, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // Assuming Ionicons is used for icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { WebView } from 'react-native-webview';
import { SvgUri } from 'react-native-svg';
import ipAddress from '../../config';
import { debounce } from 'lodash';
import { LinearGradient } from 'expo-linear-gradient';
import valetstartingpage from './valet_starting_page'
import CustomHeader from '../../layout/CustomHeader'; 

// import BillIcon from './svg/bill1.svg';



export default function SettingsScreen({ navigation }) {
  const [napkins, setNapkins] = useState(false);
  const [sugar, setSugar] = useState(false);
  const [salt, setSalt] = useState(false);
  const [oil, setOil] = useState(false);
  const [glassOfIce, setGlassOfIce] = useState(false);
  const [emptyGlass, setEmptyGlass] = useState(false);
  const [sousPlat, setSousPlat] = useState(false);
  const [bill, setBill] = useState(false);
  const [shishaCharcoal, setShishaCharcoal] = useState(false);
  const [toothpick, setToothpick] = useState(false);
  const [ketchup, setKetchup] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [customRequest, setCustomRequest] = useState('');
  const [customButtons, setCustomButtons] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false); // Using state to track ordering status
  const [customerName, setCustomerName] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tableId = await AsyncStorage.getItem('tableId');
        const tableToken = await AsyncStorage.getItem('tableToken');
        console.log("getCustomButtonsByTableId getCustomButtonsByTableId getCustomButtonsByTableId getCustomButtonsByTableId")
        const response = await axios.post(`${ipAddress}/api/ButtonsRoutes/getCustomButtonsByTableId`, {
          tableId
        }, {
          headers: {
            Authorization: tableToken
          }
        });
        const data = await response.data;
        setCustomerName(response.data.name);
        console.log(data);
        setCustomButtons(data); // Set custom buttons state
      } catch (error) {
        console.error('Error fetching custom buttons:', error);
      }
    };
  
    fetchData();
  
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
  
    return () => clearInterval(interval); // Clean up the interval
  }, []);
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tableId = await AsyncStorage.getItem('tableId');
        const tableToken = await AsyncStorage.getItem('tableToken');
        const response = await fetch(`${ipAddress}/api/ButtonsRoutes/getButtonsByTableId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': tableToken,
          },
          body: JSON.stringify({
            tableId,
          }),
        });
        const data = await response.json();
        console.log(data);
        if (data.length > 0) {
          const buttonData = data[0]; // Assuming data is an array with a single object
          setNapkins(buttonData.Napkins);
          setSugar(buttonData.Sugar);
          setSalt(buttonData.Salt);
          setOil(buttonData.Oil);
          setGlassOfIce(buttonData.GlassOfIce);
          setEmptyGlass(buttonData.EmptyGlass);
          setSousPlat(buttonData.SousPlat);
          setBill(buttonData.Bill);
          setShishaCharcoal(buttonData.ShishaCharcoal);
          setToothpick(buttonData.Toothpick);
          setKetchup(buttonData.Ketchup);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
  
    return () => clearInterval(interval); // Clean up the interval
  }, []);

  const handleOrder = async (order) => {
    console.log("Handle order called for:", order); // Log the order
    if (isOrdering) return; // Prevent multiple clicks
    setIsOrdering(true); // Set ordering to true

    console.log("Placing order:", order); // Debug log

    try {
      const tableId = await AsyncStorage.getItem('tableId');
      const restoId = await AsyncStorage.getItem('restoId');
      const tableToken = await AsyncStorage.getItem('tableToken');

      await axios.post(`${ipAddress}/api/ButtonsRoutes/AddOrder`, {
        tableId,
        order,
        restoId
      }, {
        headers: {
          Authorization: tableToken
        }
      });

      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsOrdering(false); // Reset ordering status
    }
  };
  

  
  return (
    <LinearGradient
      colors={['#3F63CB', '#003266', '#000000']}
      locations={[0, 0.4895, 0.9789]}
      style={styles.container}
    >    
      <View style={styles.container}>
        <View style={styles.content}>
        {/* <CustomHeader /> */}
          <Image source={require('../../assets/logo1.png')} style={styles.logo}/>
          
          <View style={styles.bigButtonContainer}>
            <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate('MenuScreen')}>
              <Image source={require('../../assets/menu.png')} style={styles.image}/>
              <Text style={styles.bigButtonText}>MENU</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate('valetstartingpage')}>
              <Image source={require('../../assets/valet.png')} style={styles.image}/>
              <Text style={styles.bigButtonText}>VALET</Text>
            </TouchableOpacity>
          </View>
  
  
          <ScrollView contentContainerStyle={styles.buttonContainer}>
          <Text style={styles.label}>Others</Text>
            <View style={styles.buttonRow}>
              {bill && (
                <View style={styles.buttonColumn}>
                  <TouchableOpacity style={styles.card} onPress={() => handleOrder('bill')}>
                    <Image source={require('../OrderScreen/svg/bill.png')} style={styles.icon} />
                  </TouchableOpacity>
                  <Text style={styles.cardText}>Bill</Text>
                </View>
              )}
              {napkins && (
                <View style={styles.buttonColumn}>
                  <TouchableOpacity style={styles.card} onPress={() => handleOrder('napkins')}>
                    <Image source={require('../OrderScreen/svg/napkins1.png')} style={styles.icon} />
                  </TouchableOpacity>
                  <Text style={styles.cardText}>Napkins</Text>
                </View>
              )}
              {emptyGlass && (
                <View style={styles.buttonColumn}>
                  <TouchableOpacity style={styles.card} onPress={() => handleOrder('emptyGlass')}>
                    <Image source={require('../OrderScreen/svg/glass.png')} style={styles.icon} />
                  </TouchableOpacity>
                  <Text style={styles.cardText}>Glass</Text>
                </View>
              )}
              {sugar && (
                <View style={styles.buttonColumn}>
                  <TouchableOpacity style={styles.card} onPress={() => handleOrder('sugar')}>
                  <Image source={require('../OrderScreen/svg/sugar.png')} style={styles.icon} />
                  </TouchableOpacity>
                  <Text style={styles.cardText}>Sugar</Text>
                </View>
              )}
              {salt && (
                <View style={styles.buttonColumn}>
                  <TouchableOpacity style={styles.card} onPress={() => handleOrder('salt')}>
                    <Image source={require('../OrderScreen/svg/salt1.png')} style={styles.icon} />
                  </TouchableOpacity>
                  <Text style={styles.cardText}>Salt</Text>
                </View>
              )}
              {oil && (
                <View style={styles.buttonColumn}>
                  <TouchableOpacity style={styles.card} onPress={() => handleOrder('oil')}>
                  <Image source={require('../OrderScreen/svg/oil.png')} style={styles.icon} />
                  </TouchableOpacity>
                  <Text style={styles.cardText}>Oil</Text>
                </View>
              )}
              {/* {customButtons.map((button) => (
                <View key={button._id} style={styles.buttonColumn}>
                  <TouchableOpacity style={styles.card} onPress={() => handleOrder(button.order)}>
                    <SvgUri width="50" height="50" uri={button.svgLink} />
                  </TouchableOpacity>
                  <Text style={styles.cardText}>{button.order}</Text>
                </View>
              ))} */}
            </View>
          </ScrollView>
  
           <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                >
                  <View style={styles.modalBackground}>
                    <LinearGradient
                                colors={['#000000', '#003266']}
                                style={styles.modalContent}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 0.9789 }}
                              >
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalText}>Your request has been recieved!</Text>
                    </View>
                    </LinearGradient>
                  </View>
                </Modal>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    top: 20,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 20,
    top: -10,
   },
  image: {
    width: 100,
    height: 100,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 10,
    top: 40,
  },
  buttonColumn: {
    alignItems: 'center',
    width: '15%',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 30,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
      backgroundColor: 'rgba(49, 49, 49, 0.4)',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    aspectRatio: 1,
    // opacity: 0.8,
    
  },
  icon: {
    width: '70%',  // Increased from fixed 40px
    height: '70%', // Increased from fixed 40px
    tintColor: 'white',
    resizeMode: 'contain' // Added to maintain aspect ratio
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  containerrow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  cardContainerrow: {
    width: '23%', // Adjusts to fit 4 cards per row
    marginBottom: 10,
    marginHorizontal: 5, // Space between buttons
  },
  cardrow: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#8e8a9b',
    borderRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 0,
  },
  label: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    alignSelf: 'flex-start',
  },
  webView: {
    width: 50,
    height: 50,
  },
  
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },

  
  bigButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 50,
    width: 580,
    height: 200,
  },
  bigButton: {
    flex: 1,
    // paddingVertical: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 230,
    // opacity: 0.8,
  },
  bigButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
  },
  modalText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  customRequestContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row', // Modify this line
  },
  input: {
    width: '60%',
    marginTop:10,
    
    height:50,
    marginRight:20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  customButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 4,  // Add this
    borderColor: '#fff',  // Add this
  },
  customButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {

    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 20,
    padding: 10,
    width: '100%',
    maxWidth: 450,
    height: 150,
    alignItems: 'center',
    margin: 0,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

