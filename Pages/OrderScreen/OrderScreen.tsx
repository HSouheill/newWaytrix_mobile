import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // Assuming Ionicons is used for icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { WebView } from 'react-native-webview';
import { SvgUri } from 'react-native-svg';
import ipAddress from '../../config';
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
    console.log("jewoidhiiiiiiiiiiii")
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
          <Text style={styles.bigButtonText}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate('ValetScreen')}>
          <Text style={styles.bigButtonText}>Valet</Text>
        </TouchableOpacity>
      </View>
            {/* <SvgUri width="100%" height="100%" uri="http://74.208.98.3:3030/uploads/image-1719996835746.svg" />
      <Image
        source={{ uri: 'http://74.208.98.3:3030/uploads/image-1719996835746.svg' }}
        style={{width:250, height:250,backgroundColor: 'white', borderColor: 'black', borderWidth: 1 }}
      /> */}
      <Text style={styles.label}>Request: </Text>
      

      <ScrollView contentContainerStyle={styles.buttonContainer}>
          <View style={styles.row}>
          {napkins && (
            <TouchableOpacity style={styles.card} onPress={() => handleOrder('napkins')}>
{/* https://www.svgrepo.com/show/235732/napkins-napkin.svg */}
      <Image
        source={require('./svg/napkins.png')}
        style={{width:50,height:50}}
      />
              <Text style={styles.cardText}>Napkins</Text>
            </TouchableOpacity>
          )}
          {sugar && (
            <TouchableOpacity style={styles.card} onPress={() => handleOrder('sugar')}>
              <Ionicons name="cube" size={40} color="#000" />
              <Text style={styles.cardText}>Sugar</Text>
            </TouchableOpacity>
          )}
          {salt && (
            <TouchableOpacity style={styles.card} onPress={() => handleOrder('salt')}>
{/* https://www.svgrepo.com/show/398243/salt.svg */}
<Image
        source={require('./svg/salt.png')}
        style={{width:50,height:50}}
      />
              <Text style={styles.cardText}>Salt</Text>
            </TouchableOpacity>
          )}
          {oil && (
            <TouchableOpacity style={styles.card} onPress={() => handleOrder('oil')}>
              <Ionicons name="water" size={40} color="#000" />
              <Text style={styles.cardText}>Oil</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* <View style={styles.row}>
          
        </View> */}
        <View style={styles.row}>
          {glassOfIce && (
            <TouchableOpacity style={styles.card} onPress={() => handleOrder('glassOfIce')}>
{/* https://www.svgrepo.com/show/490113/glass-of-whiskey.svg */}
<Image
        source={require('./svg/glassofice.png')}
        style={{width:50,height:50}}
      />
              <Text style={styles.cardText}>Glass of Ice</Text>
            </TouchableOpacity>
          )}
          {emptyGlass && (
            <TouchableOpacity style={styles.card} onPress={() => handleOrder('emptyGlass')}>
<Image
        source={require('./svg/emptyGlass.png')}
        style={{width:50,height:50}}
      /> 
                   <Text style={styles.cardText}>Empty Glass</Text>
            </TouchableOpacity>
          )}
           {sousPlat && (
            <TouchableOpacity style={styles.card} onPress={() => handleOrder('sousPlat')}>
{/* https://www.svgrepo.com/show/104306/plate.svg */}
<Image
        source={require('./svg/emptyPlate.png')}
        style={{width:50,height:50}}
      /> 
              <Text style={styles.cardText}>Sous Plat</Text>
            </TouchableOpacity>
          )}
          {bill && (
            <TouchableOpacity style={styles.card} onPress={() => handleOrder('bill')}>
{/* https://www.svgrepo.com/show/483175/bill.svg */}
<Image
        source={require('./svg/bill.png')}
        style={{width:50,height:50}}
      /> 
              <Text style={styles.cardText}>Bill</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.row}>
          {shishaCharcoal && (
            <TouchableOpacity style={styles.card} onPress={() => handleOrder('shishaCharcoal')}>
              <Ionicons name="flame" size={40} color="#000" />
              <Text style={styles.cardText}>Shisha Charcoal</Text>
            </TouchableOpacity>
          )}
          {toothpick && (
            <TouchableOpacity style={styles.card} onPress={() => handleOrder('toothpick')}>
<Image source ={require('./svg/toothpick.png')}
style={{width:50,height:50}}/>
{/* https://www.svgrepo.com/show/117366/dish-and-toothpick.svg */}
              <Text style={styles.cardText}>Toothpick</Text>
            </TouchableOpacity>
          )}
          {ketchup && (
            <TouchableOpacity style={styles.card} onPress={() => handleOrder('ketchup')}>
<Image source ={require('./svg/ketchup.png')}
style={{width:50,height:50}}/>

              <Text style={styles.cardText}>Ketchup</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.containerrow}>
        {customButtons.map((button) => (
                  <View key={button._id} style={styles.cardContainerrow}>
    <TouchableOpacity key={button._id} style={styles.cardrow} onPress={() => handleOrder(button.order)}>
     
      <SvgUri width="50" height="50" uri={button.svgLink} />
      <Text style={styles.cardText}>{button.order}</Text>
    </TouchableOpacity></View>
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
  cardrow:{
    justifyContent: 'center',
    alignItems: 'center',
    margin:5,
    padding: 10,
    backgroundColor: '#fff', // Adjust this according to your design
    borderRadius: 8,
    elevation: 2,
  },
  cardContainerrow:{
    width: '23%', // Adjust the width to fit 4 cards in a row with some spacing
    marginBottom: 10,
  },
  containerrow:{
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: '20%',
  },
  cardText: {
    marginTop: 10,
    fontWeight:'bold',
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  bigButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  bigButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigButtonText: {
    color: '#000',
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
  },
  customButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
