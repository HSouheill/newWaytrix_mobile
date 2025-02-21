import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Image, KeyboardAvoidingView, Platform} from 'react-native';
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps, useDrawerStatus } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';


const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const clearAuthData = async () => {
  try {
    const keysToRemove = [
      'customerToken',
      'customerId',
      'username',
      'valetToken',
      'lastLoginTimestamp'
    ];
    await Promise.all(keysToRemove.map(key => AsyncStorage.removeItem(key)));
    
    if (Platform.OS === 'web') {
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        input.value = '';
        input.setAttribute('autocomplete', 'off');
      });
    }
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

const deleteCustomerToken = async () => {
  try {
    await clearAuthData();
    console.log('All auth data removed');
  } catch (error) {
    console.error('Error removing auth data:', error);
  }
};

// Define types for navigation
type DrawerScreens = {
  Home: undefined;
  OrderScreen: { title: string };
  SurveyScreen: { title: string };
  BonusScreen: { title: string };
  ContactUsScreen: { title: string };
  TableLogout: { title: string };
};

const CustomDrawerContent = ({ navigation }: DrawerContentComponentProps) => {
  const drawerStatus = useDrawerStatus();
  const [customerToken, setCustomerToken] = useState<string | null>(null);
  const [valetToken, setValetToken] = useState<string | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  

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

  interface NavButtonProps {
    icon: any;
    label: string;
    onPress: () => void;
    isActive: boolean;
  }

  const NavButton: React.FC<NavButtonProps> = ({ icon, label, onPress, isActive }) => (
    <TouchableOpacity 
      style={[styles.drawerItem, isActive && styles.activeButton]} 
      onPress={onPress}
    >
      <View style={[styles.iconTextContainer, isActive && styles.iconTextRow]}>
        <Image source={icon} style={[styles.icon, { opacity: isActive ? 1 : 0.6 }]} />
        {isActive && <Text style={styles.drawerText}>{label}</Text>}
      </View>
    </TouchableOpacity>
  );


  const handlePress = (screen: keyof DrawerScreens, label: string) => {
    setActiveButton(label);
    navigation.navigate(screen, { title: screen });
  };

  const dynamicGap = (customerToken || valetToken) ? 20 : 40; 

  const handleLogout = async () => {
    await deleteCustomerToken();
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
    <TapGestureHandler onActivated={handleTripleTap} numberOfTaps={1}>
        
      <View style={[styles.drawerContent, { gap: dynamicGap }]}>
        
        <NavButton
          icon={require('../assets/order.png')}
          label="Order"
          isActive={activeButton === 'Order'}
          onPress={() => handlePress('OrderScreen', 'Order')}
        />
        <NavButton
          icon={require('../assets/survey.png')}
          label="Survey"
          isActive={activeButton === 'Survey'}
          onPress={() => handlePress('SurveyScreen', 'Survey')}
        />
        
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <View style={styles.headerContainer}>
            <Image 
              source={require('../assets/output-onlinepngtools (3) 1.png')} 
              style={styles.logo} 
            />
          </View>
        </TouchableOpacity>
        <NavButton
          icon={require('../assets/bonus.png')}
          label="Bonus"
          isActive={activeButton === 'Bonus'}
          onPress={() => handlePress('BonusScreen', 'Bonus')}
        />
        <NavButton
          icon={require('../assets/contactus.png')}
          label="Contact"
          isActive={activeButton === 'Contact'}
          onPress={() => handlePress('ContactUsScreen', 'Contact')}
        />
         {(customerToken || valetToken) && (
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={deleteCustomerToken}
            >
              <View style={styles.iconTextContainer}>
                <Image
                  source={require('../assets/exit.png')}
                  style={styles.icon}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </TapGestureHandler>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  drawerContent: {
    position: 'absolute',
    bottom: 0,
    height: 70,
    flexDirection: 'row',
    width: '190%',
    paddingHorizontal: 30,
    backgroundColor: '#001E3D', 
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  headerContainer: {
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 45, 
  },
  activeButton: {
    backgroundColor: '#3F63CB33',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,

  },
  logo: {
    width: 50,
    height: 50,
    // marginBottom: 5,
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
    fontSize: 16,
    letterSpacing: 1,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  iconTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 35,
    height: 35,
  },
});

export default CustomDrawerContent;
