import React,{useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, SafeAreaView, Image } from 'react-native';
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentOptions, useDrawerStatus  } from '@react-navigation/drawer';
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
const zalgoChar = (char: string) => {
  const zalgoUp = [
    '\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357', 
    '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c', 
    '\u0303', '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', 
    '\u0314', '\u033d', '\u0309', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369', 
    '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f', '\u033e', '\u035b', '\u0346', '\u031a'
  ];
  
  const zalgoDown = [
    '\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324', 
    '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', 
    '\u0331', '\u0332', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0345', '\u0347', '\u0348', 
    '\u0349', '\u034d', '\u034e', '\u0353', '\u0354', '\u0355', '\u0356', '\u0359', '\u035a', '\u0323'
  ];

  const zalgoMid = [
    '\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334', 
    '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e', '\u035f', '\u0360', '\u0362', '\u0338', 
    '\u0337', '\u0361'
  ];

  let result = char;
  for (let i = 0; i < getRandomInt(1, 8); i++) {
    result += zalgoUp[getRandomInt(0, zalgoUp.length - 1)];
    result += zalgoDown[getRandomInt(0, zalgoDown.length - 1)];
    result += zalgoMid[getRandomInt(0, zalgoMid.length - 1)];
  }
  return result;
};

const generateZalgoText = (text: string) => {
  return text.split('').map(zalgoChar).join('');
};

const CustomDrawerContent = ({ navigation }: DrawerContentComponentProps<DrawerContentOptions>) => {
  const drawerStatus = useDrawerStatus(); // Use drawer status to track if drawer is open
  //const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [zalgoText, setZalgoText] = React.useState(generateZalgoText("Waytrix"));
  const [customerToken, setCustomerToken] = useState<string | null>(null);
  const [valetToken, setValetToken] = useState<string | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const timeoutId = useRef(null);

  const checkCustomerToken = async () => {
    const customerToken = await AsyncStorage.getItem('customerToken');
    const valetToken = await AsyncStorage.getItem('valetToken');
    setValetToken(valetToken)
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
  // React.useEffect(() => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 1500,
  //     useNativeDriver: true,
  //   }).start();
  // }, [fadeAnim]);


  // useEffect(() => {
  //   if (drawerStatus === 'open') {
  //     // Trigger the fade-in animation when the drawer opens
  //     Animated.timing(fadeAnim, {
  //       toValue: 1,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }).start();
  //   } else {
  //     // Animate to opacity 0 when the drawer is closed
  //     Animated.timing(fadeAnim, {
  //       toValue: 0,
  //       duration: 800,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  // }, [drawerStatus]);
  



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
      {/* Animated.View */}
      {/* <Text style={styles.drawerHeaderText}>{zalgoText}</Text> */}
      {/* <View style={styles.headerContainer}>
          <Image source={require('../Pages/waytrix3.png')} style={styles.logo} />
          <Text style={styles.drawerHeaderText}></Text>
        </View> */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          setZalgoText(generateZalgoText("Waytrix"));
          navigation.navigate('Home', { title: 'Home' });
        }}
      >
        <View style={styles.iconTextContainer}>
            <Image source={require('../assets/home2.png')} style={styles.icon} />
            <Text style={styles.drawerText}>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          setZalgoText(generateZalgoText("Waytrix"));
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
          setZalgoText(generateZalgoText("Waytrix"));
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
          setZalgoText(generateZalgoText("Waytrix"));
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
          setZalgoText(generateZalgoText("Waytrix"));
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
      {/* logout table */}
      {/* <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          setZalgoText(generateZalgoText("Waytrix"));
          navigation.navigate('TableLogout', { title: 'Table Logout' });
        }}
      >
        
        <Text style={styles.drawerText}>Table Logout</Text>
      </TouchableOpacity> */}
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
      </TouchableOpacity>}
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
    //justifyContent: 'space-around',
    //flex: 1,
   // paddingTop: 15,
    paddingHorizontal: 25,
    //backgroundColor: 'black',
    backgroundColor: '#212121',
    // borderTopWidth: 4,        
    // borderRightWidth: 4,   
    // borderBottomWidth: 4,   
    // borderColor: 'white',      // Set border color to white
    // borderLeftWidth: 0, 
    // borderRadius: 15,  // Increased border radius for rounded corners      
  },
  headerContainer: {
    height: 60,
    width: 60,
    //marginHorizontal: -10,
    //flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
   // paddingBottom: -100,
  //  borderColor: '#fff',  // White border
   // borderWidth: 2,  // Border width to make it more visible
    borderRadius: 45,  // Increased border radius for rounded corners
    backgroundColor: '#5a459d',
    marginRight: 25,
    marginLeft: 15,
    marginTop: 4,
   // marginLeft: 0,
  },
  logo: {
    width: 50,
    height: 50,
    //marginRight: 5,
   // marginLeft: 5,
   marginBottom: 5,
    bottom: -35,
  },
  drawerHeaderText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    // marginTop: -30, 
    paddingVertical: 18,
    marginBottom: 8,//Johnny sadaka svg
    borderRadius: 15,  // Increased border radius for rounded corners
    // borderColor: '#fff',  // White border
    // borderWidth: 4,  // Border width to make it more visible
    letterSpacing: 2,
   
  },
  drawerItem: {
   // height: 20,
   marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
   // backgroundColor: '#8e8a9b',  // Lighter gray background
   // borderRadius: 35,  // Increased border radius for rounded corners
   // borderColor: '#fff',  // White border
  //  borderWidth: 2,  // Border width to make it more visible
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    // shadowOpacity: 0.27,
    // shadowRadius: 4.65,
    // elevation: 6,
  },
  drawerText: {
    color: '#fff',  
    fontSize: 12,
    //fontWeight: 'bold',
   // textTransform: 'uppercase',
    letterSpacing: 1,
    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
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
    //marginRight: 0,
  },
});

export default CustomDrawerContent;
``
