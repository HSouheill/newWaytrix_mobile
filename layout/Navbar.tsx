import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, SafeAreaView, Image } from 'react-native';
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentOptions, useDrawerStatus } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TapGestureHandler } from 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const deleteCustomerToken = async () => {
  try {
    await AsyncStorage.removeItem('customerToken');
    await AsyncStorage.removeItem('valetToken');
    console.log('Customer token removed');
  } catch (error) {
    console.error('Error removing customer token:', error);
  }
};

const CustomDrawerContent = ({ navigation }: DrawerContentComponentProps<DrawerContentOptions>) => {
  const drawerStatus = useDrawerStatus(); // Use drawer status to track if drawer is open
  const [customerToken, setCustomerToken] = useState<string | null>(null);
  const [valetToken, setValetToken] = useState<string | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const timeoutId = useRef(null);

  const checkCustomerToken = async () => {
    const customerToken = await AsyncStorage.getItem('customerToken');
    const valetToken = await AsyncStorage.getItem('valetToken');
    setValetToken(valetToken);
    setCustomerToken(customerToken);
    console.log('Customer navbar token:', customerToken);
  };

  useEffect(() => {
    checkCustomerToken();
    const interval = setInterval(() => {
      checkCustomerToken();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTripleTap = () => {
    setTapCount(prevCount => prevCount + 1);

    // Reset the tap count after a short delay (500ms)
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => setTapCount(0), 500);

    if (tapCount === 2) {
      // Triple tap detected, perform logout
      deleteCustomerToken();
      navigation.navigate('TableLogout', { title: 'Table Logout' });  // Redirect after logout
    }
  };

  return (
    <TapGestureHandler onActivated={handleTripleTap} numberOfTaps={1}>
      <View style={styles.drawerContent}>
        <TouchableOpacity
          style={[styles.drawerItem, { marginLeft: 74 }]}  // Add marginLeft here
          onPress={() => {
            navigation.navigate('OrderScreen', { title: 'Orders Screen' });
          }}
        >
          <View style={styles.iconTextContainer}>
            <Image source={require('../assets/pointer2.png')} style={styles.icon} />
            <Text style={styles.drawerText}>Order</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('SurveyScreen', { title: 'Survey Screen' });
          }}
        >
          <View style={styles.iconTextContainer}>
            <Image
              source={require('../assets/tick2.png')} // Assuming you have the icon as an SVG file
              style={styles.icon}
            />
            <Text style={styles.drawerText}>Survey</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home', { title: 'Home' });
          }}
        >
          <View style={styles.headerContainer}>
            <Image source={require('../Pages/waytrix2.png')} style={styles.logo} />
            <Text style={styles.drawerHeaderText}></Text>
          </View>
        </TouchableOpacity>

        {/* ContactUsScreen */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('ContactUsScreen', { title: 'Contact Us' });
          }}
        >
          <View style={styles.iconTextContainer}>
            <Image
              source={require('../assets/mobile1.png')} // Assuming you have the icon as an SVG file
              style={styles.icon}
            />
            <Text style={styles.drawerText}>Contact</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('BonusScreen', { title: 'Bonus Screen' });
          }}
        >
          <View style={styles.iconTextContainer}>
            <Image
              source={require('../assets/party1.png')} // Assuming you have the icon as an SVG file
              style={styles.icon}
            />
            <Text style={styles.drawerText}>Bonus</Text>
          </View>
        </TouchableOpacity>
        {(customerToken || valetToken) &&
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={deleteCustomerToken}
          >
            <View style={styles.iconTextContainer}>
              <Image
                source={require('../assets/logout2.png')} // Assuming you have the icon as an SVG file
                style={styles.icon}
              />
              <Text style={styles.drawerText}>Logout</Text>
            </View>
          </TouchableOpacity>
        }
      </View>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    position: 'absolute',
    bottom: 0,
    height: 70,
    flexDirection: 'row',
    width: '190%',
    paddingHorizontal: 25,
    backgroundColor: '#212121', 
  },
  headerContainer: {
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 45,  // Increased border radius for rounded corners
   // backgroundColor: '#5a459d',
    marginRight: 25,
    marginLeft: 15,
    marginTop: 4,
  },
  logo: {
    width: 50,
    height: 50,
   marginBottom: 5,
    bottom: -35,
  },
  drawerHeaderText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingVertical: 18,
    marginBottom: 8,//Johnny sadaka svg
    borderRadius: 15,  // Increased border radius for rounded corners
    letterSpacing: 2,
   
  },
  drawerItem: {
   marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  drawerText: {
    color: '#fff',  
    fontSize: 12,
    letterSpacing: 1,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  iconTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default CustomDrawerContent;
``
