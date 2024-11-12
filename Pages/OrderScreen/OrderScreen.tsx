import React, { useState, useEffect, useCallback, useRef  } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // Assuming Ionicons is used for icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { WebView } from 'react-native-webview';
import { SvgUri } from 'react-native-svg';
import ipAddress from '../../config';
import { debounce } from 'lodash';
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
        console.log("hdioewhodiweuuuuuuuuuuuuuuuuuuuuuuuuu")
        console.log("hdioewhodiweuuuuuuuuuuuuuuuuuuuuuuuuu")
        console.log("hdioewhodiweuuuuuuuuuuuuuuuuuuuuuuuuu")
        console.log("hdioewhodiweuuuuuuuuuuuuuuuuuuuuuuuuu")
        console.log("hdioewhodiweuuuuuuuuuuuuuuuuuuuuuuuuu")
        console.log("hdioewhodiweuuuuuuuuuuuuuuuuuuuuuuuuu")
        console.log("hdioewhodiweuuuuuuuuuuuuuuuuuuuuuuuuu")
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
  

  const handleCustomRequest = async () => {
    try {
      const tableId = await AsyncStorage.getItem('tableId');
      const tableToken = await AsyncStorage.getItem('tableToken');
      const restoId = await AsyncStorage.getItem('restoId');

      await axios.post(
        `${ipAddress}/api/ButtonsRoutes/AddOrder`,
        {
          tableId,
          order: customRequest,
          restoId: restoId
        },
        {
          headers: {
            Authorization: tableToken,
          },
        }
      );
      setModalVisible(true);
      setCustomRequest('');
      setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    } catch (error) {
      console.error('Error placing custom order:', error);
    }
  };
  
  return (
    
    <View style={styles.container}>
      <View style={styles.bigButtonContainer}>
        <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate('MenuScreen')}>
          <Text style={styles.bigButtonText}>MENU</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate('ValetScreen')}>
          <Text style={styles.bigButtonText}>VALET</Text>
        </TouchableOpacity>
      </View>
            {/* <SvgUri width="100%" height="100%" uri="http://74.208.98.3:3030/uploads/image-1719996835746.svg" />
      <Image
        source={{ uri: 'http://74.208.98.3:3030/uploads/image-1719996835746.svg' }}
        style={{width:250, height:250,backgroundColor: 'white', borderColor: 'black', borderWidth: 1 }}
      /> */}
      <Text style={styles.label}>Request: </Text>
      

      <ScrollView contentContainerStyle={styles.buttonContainer} showsVerticalScrollIndicator={false}>
  <View style={styles.buttonRow}>
    {napkins && (
      <TouchableOpacity 
      style={styles.card}
      onPress={() => handleOrder('napkins')}
      disabled={isOrdering} // Disable button when ordering
      >
        <Image source={require('./svg/napkins.png')} style={styles.icon} />
        <Text style={styles.cardText}>Napkins</Text>
      </TouchableOpacity>
    )}
    {sugar && (
      <TouchableOpacity style={styles.card} onPress={() => handleOrder('sugar')}>
        <Ionicons name="cube" size={40} color="#fff" />
        <Text style={styles.cardText}>Sugar</Text>
      </TouchableOpacity>
    )}
    {salt && (
      <TouchableOpacity style={styles.card} onPress={() => handleOrder('salt')}>
        <Image source={require('./svg/salt.png')} style={styles.icon} />
        <Text style={styles.cardText}>Salt</Text>
      </TouchableOpacity>
    )}
    {oil && (
      <TouchableOpacity style={styles.card} onPress={() => handleOrder('oil')}>
        <Ionicons name="water" size={40} color="#fff" />
        <Text style={styles.cardText}>Oil</Text>
      </TouchableOpacity>
    )}
    {glassOfIce && (
      <TouchableOpacity style={styles.card} onPress={() => handleOrder('glassOfIce')}>
        <Image source={require('./svg/glassofice.png')} style={styles.icon} />
        <Text style={styles.cardText}>Glass of Ice</Text>
      </TouchableOpacity>
    )}
    {emptyGlass && (
      <TouchableOpacity style={styles.card} onPress={() => handleOrder('emptyGlass')}>
        <Image source={require('./svg/emptyGlass.png')} style={styles.icon} />
        <Text style={styles.cardText}>Empty Glass</Text>
      </TouchableOpacity>
    )}
    {sousPlat && (
      <TouchableOpacity style={styles.card} onPress={() => handleOrder('sousPlat')}>
        <Image source={require('./svg/emptyPlate.png')} style={styles.icon} />
        <Text style={styles.cardText}>Sous Plat</Text>
      </TouchableOpacity>
    )}
    {bill && (
      <TouchableOpacity style={styles.card} onPress={() => handleOrder('bill')}>
        <Image source={require('./svg/bill.png')} style={styles.icon} />
        <Text style={styles.cardText}>Bill</Text>
      </TouchableOpacity>
    )}
    {shishaCharcoal && (
      <TouchableOpacity style={styles.card} onPress={() => handleOrder('shishaCharcoal')}>
        <Ionicons name="flame" size={40} color="#fff" />
        <Text style={styles.cardText}>Shisha Charcoal</Text>
      </TouchableOpacity>
    )}
    {toothpick && (
      <TouchableOpacity style={styles.card} onPress={() => handleOrder('toothpick')}>
        <Image source={require('./svg/toothpick.png')} style={styles.icon} />
        <Text style={styles.cardText}>Toothpick</Text>
      </TouchableOpacity>
    )}
    {ketchup && (
      <TouchableOpacity style={styles.card} onPress={() => handleOrder('ketchup')}>
        <Image source={require('./svg/ketchup.png')} style={styles.icon} />
        <Text style={styles.cardText}>Ketchup</Text>
      </TouchableOpacity>
    )}
    {customButtons.map((button) => (
      <TouchableOpacity key={button._id} style={styles.card} onPress={() => handleOrder(button.order)}>
        <SvgUri width="50" height="50" uri={button.svgLink} />
        <Text style={styles.cardText}>{button.order}</Text>
      </TouchableOpacity>
    ))}
  </View>
</ScrollView>
 
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <Text style={styles.modalText}>Order Placed Successfully!</Text>
        </View>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8e8a9b',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: '30%', // Adjust width for better responsiveness
    borderWidth: 4,
    borderColor: '#fff',
  },
  icon: {
    width: 50,
    height: 50,
    tintColor: 'white',
  },
  cardText: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 18,
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
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 50, // FOR FOOTER
  },
  label: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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
    marginTop: 20,
    width: '100%',
  },
  bigButton: {
    flex: 1,
    backgroundColor: '#8e8a9b',
    paddingVertical: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,  // Add this
    borderColor: '#fff',  // Add this
  },
  bigButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
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
});
