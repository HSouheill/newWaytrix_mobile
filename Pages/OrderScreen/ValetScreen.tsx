import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, FlatList, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipAddress from '../../config';
import { LinearGradient } from 'expo-linear-gradient';
import CustomHeader from '../../layout/CustomHeader'; 
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

type ValetScreenRouteProp = RouteProp<{
  ValetScreen: {
    username?: string;
  };
}>;

type RootStackParamList = {
  ValetScreen: { username: string } | undefined;
};




const ValetScreen = ( ) => {
  const [id, setId] = useState('');
  const [selectedCarName, setSelectedCarName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [restoId, setRestoId] = useState('');
  const [carNameSearch, setCarNameSearch] = useState('');
  const [colorSearch, setColorSearch] = useState('');
  const [isCarDropdownVisible, setIsCarDropdownVisible] = useState(false);
  const [isColorDropdownVisible, setIsColorDropdownVisible] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [username, setUsername] = useState<string>('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<ValetScreenRouteProp>();

  useEffect(() => {
    const fetchValetData = async () => {
      navigation.setOptions({
        headerShown: false,
      });

      // Try to get username from route params first
      const routeUsername = route.params?.username;
      if (routeUsername) {
        setUsername(routeUsername);
      } else {
        // Fallback to stored username if not in route params
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      }
    };

    fetchValetData();
    const interval = setInterval(fetchValetData, 2000);

    return () => clearInterval(interval);
  }, []);

  const carNames = [
    'Toyota','Camaro', 'Honda', 'Ford', 'BMW', 'Audi', 'Mercedes', 'Tesla', 'Chevrolet', 'Nissan', 'Hyundai',
    'Kia', 'Volkswagen', 'Subaru', 'Mazda', 'Lexus', 'Jaguar', 'Land Rover', 'Porsche', 'Ferrari',
    'Lamborghini', 'Maserati', 'Bentley', 'Rolls Royce', 'Aston Martin', 'Bugatti', 'Pagani',
    'McLaren', 'Volvo', 'Jeep', 'Chrysler', 'Dodge', 'Ram', 'GMC', 'Buick', 'Cadillac'
  ];

  const colors = [
    'Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown',
    'Gray', 'Silver', 'Gold', 'Beige', 'Maroon', 'Navy', 'Teal', 'Lime', 'Olive', 'Coral'
  ];

  useEffect(() => {
    retrieveRestoId();
  }, []);

  const retrieveRestoId = async () => {
    try {
      const value = await AsyncStorage.getItem('restoId');
      if (value !== null) {
        setRestoId(value);
      }
    } catch (error) {
      console.error('Error retrieving restoId from AsyncStorage:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const customerToken = await AsyncStorage.getItem('customerToken');
      const tableId = await AsyncStorage.getItem('tableId'); // Fetch tableId from AsyncStorage

      if (!customerToken) {
        console.error('tableToken not found in AsyncStorage');
        return;
      }
      if (!tableId) {
        console.error('tableId not found in AsyncStorage');
        return;
      }

      const config = {
        headers: {
          Authorization: customerToken,
        },
      };

      // Save ticketNum to AsyncStorage
    await AsyncStorage.setItem('ticketNum', id);

      const response = await axios.post(
        `${ipAddress}/api/ButtonsRoutes/AddCar`,
        {
          ticketNum: id,
          restoId: restoId,
          carName: selectedCarName,
          color: selectedColor,
          tableId, // Include tableId in the payload
        },
        config
      );

      setTimeout(async () => {
        console.log("wait");
        const { timerId } = response.data;
        await AsyncStorage.setItem('timerId', timerId);
      }, 2000);

      setModalVisible(true);
  
      // Reset the form fields here
      setId('');
      setSelectedCarName('');
      setSelectedColor('');
      setCarNameSearch('');
      setColorSearch('');
  
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('CarTimer');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

 
  return (
        <LinearGradient
          colors={['#3F63CB', '#003266', '#000000']}
          locations={[0, 0.4895, 0.9789]}
          style={styles.container}
        >  
            <CustomHeader username = {username} />
 
    <View style={styles.scrollContainer}>

      <View style={styles.content}>
        <Text style={styles.title}>Valet</Text>
        <Text style={styles.ticketlabel}>Ticket Number</Text>
        <TextInput
          style={styles.input}
          value={id}
          onChangeText={setId}
          placeholder="Enter Ticket Number"
          placeholderTextColor="#ccc"
          keyboardType="numeric" // Shows number-only keyboard
        />

<View style={styles.rowContainer}>
  <View style={styles.column}>
    <Text style={styles.label}>Car Brand</Text>
    <TouchableOpacity
      style={styles.dropdownButton}
      onPress={() => setIsCarDropdownVisible(!isCarDropdownVisible)}
    >
      <View style={styles.dropdownContent}>
        <Text style={styles.dropdownButtonText}>{selectedCarName || "Choose"}</Text>
        <Image 
          source={require('../../assets/chevron-down.png')} 
          style={styles.dropdownIcon} 
        />
      </View>
    </TouchableOpacity>
    {isCarDropdownVisible && (
      <ScrollView style={styles.dropdownList}>
        {carNames.map((car) => (
          <TouchableOpacity
            key={car}
            style={styles.dropdownItem}
            onPress={() => {
              setSelectedCarName(car);
              setIsCarDropdownVisible(false);
            }}
          >
            <Text style={styles.dropdownItemText}>{car}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )}
  </View>

  <View style={styles.column}>
    <Text style={styles.label}>Car's Color</Text>
    <TouchableOpacity
      style={styles.dropdownButton}
      onPress={() => setIsColorDropdownVisible(!isColorDropdownVisible)}
    >
      <View style={styles.dropdownContent}>
        <Text style={styles.dropdownButtonText}>{selectedColor || "Choose"}</Text>
        <Image 
          source={require('../../assets/chevron-down.png')} 
          style={styles.dropdownIcon} 
        />
      </View>
    </TouchableOpacity>
    {isColorDropdownVisible && (
      <ScrollView style={styles.dropdownList}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={styles.dropdownItem}
            onPress={() => {
              setSelectedColor(color);
              setIsColorDropdownVisible(false);
            }}
          >
            <Text style={styles.dropdownItemText}>{color}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )}
  </View>
</View>

        <TouchableOpacity onPress={handleSubmit}>
          <LinearGradient
          colors={['#3F63CB', '#679BFF']}
          style={styles.submitButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
           {/*  */}
        
          <Text style={styles.submitButtonText}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Image source={require('../../assets/valet_img.png')} style={styles.valetimage}/>

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
                                        end={{ x: 0, y: 0.9789 }}
                                      >
                            <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>Request received! The valet will soon share your waiting time.</Text>
                            </View>
                            </LinearGradient>
                          </View>
                        </Modal>
      </View>
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: '-8%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,

  },
  content: {
    alignItems: 'center',
    // top: '5%',
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    top: '5%',
  },
  // emptySpace: {
  //   width: 10, // Adjust width equal to the user icon width for balance, if necessary
  // },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 180,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
  },
  username: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  chevronIcon: {
    width: 10,
    height: 10,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  image: {
    width: 100,
    height: 100,
    top: '5%',
        
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    fontWeight:'bold',
    alignSelf: 'flex-start',
    

  },
  ticketlabel: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    fontWeight:'bold',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  valetimage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    top: '10%',
  },
  input: {
    height: 50,
    width: 560,
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: 'rgba(49, 49, 49, 0.4)',
    opacity: 0.8,
    color: 'white',
    fontWeight:'bold',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,


  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  column: {
    flex: 1,
    marginHorizontal: 10,
  },
  dropdownButton: {
    height: 50,
    width: '100%',
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: 'rgba(49, 49, 49, 0.4)',
    opacity: 0.8,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 16,
    
  },
  dropdownContainer: {
    maxHeight: 150,
    backgroundColor: 'rgba(49, 49, 49, 0.4)',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 10,
    
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },
  dropdownIcon: {
    width: 15,
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
  },
  dropdownList: {
    maxHeight: 200,
    backgroundColor: 'rgba(49, 49, 49, 0.4)',
    borderRadius: 10,
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    zIndex: 1000,
    
  },
  submitButton: {
    marginTop:20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
  },
  submitButtonText: {
        color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // valetimage: {
  //   width: 300,
  //   height: 300,
  //   top: '5%',
  //   alignSelf: 'center',
  // },
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
    maxWidth: 350,
    height: 120,
    alignItems: 'center',
    margin: 0,
    justifyContent: 'center',
    alignContent: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  }

});

export default ValetScreen;

