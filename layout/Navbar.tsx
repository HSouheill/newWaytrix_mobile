import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform, Keyboard, Animated } from 'react-native';
import { DrawerContentComponentProps, useDrawerStatus } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TapGestureHandler } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

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
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const keyboardVisibleAnim = useRef(new Animated.Value(0)).current;

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
  
  const navigateToHome = () => {
    setActiveButton(null); // Reset the active button when going to Home
    navigation.navigate('Home');
  };

  // Handle exit button press - clear tokens and navigate to Home
  const handleExitPress = async () => {
    await deleteCustomerToken();
    setActiveButton(null); // Reset the active button
    // navigation.navigate('HomeScreen'); // Navigate to HomeScreen after logout
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(keyboardVisibleAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true
      }).start();
      setKeyboardVisible(true);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(keyboardVisibleAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }).start();
      setKeyboardVisible(false);
    });
  
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <TapGestureHandler onActivated={handleTripleTap} numberOfTaps={1}>
      <Animated.View 
        style={[
          styles.drawerContent,
          {
            opacity: keyboardVisibleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0]
            }),
            transform: [{
              translateY: keyboardVisibleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 100]
              })
            }]
          }
        ]}
      >
        <View style={styles.navContainer}>
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
          
          <TouchableOpacity onPress={navigateToHome} style={styles.logoContainer}>
            <View style={styles.headerContainer}>
              <Image 
                source={require('../assets/newlogo.png')} 
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
              onPress={handleExitPress}
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
      </Animated.View>
    </TapGestureHandler>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    position: 'absolute',
    bottom: 0,
    height: 80,
    // width: '300%',
    width: width *1.1,
    justifyContent: 'center',
    alignItems: 'center',
    right: '-195%',
    // marginLeft: '90%',
    backgroundColor: '#001E3D',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
  },
  headerContainer: {
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 45,
  },
  logoContainer: {
    alignItems: 'center',
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
  },
  drawerHeaderText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingVertical: 18,
    marginBottom: 8,
    borderRadius: 15,
    letterSpacing: 2,
  },
  drawerItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
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