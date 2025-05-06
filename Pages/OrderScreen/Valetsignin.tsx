import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ImageBackground, Image, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipAddress from '../../config';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import ForgotPass from '../Accounts/Customer/ForgotPass';  
import SignInUpCustomer from '../Accounts/Customer/SignUpCustomer';
import ValetScreen from './/ValetScreen';
import BonusScreen from '../Bonus/BonusScreen';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import HomeScreen from '../HomeScreen';
import { AuthContext } from '../../App'; // Adjust the path as needed
import CountryPicker from 'react-native-country-picker-modal'; // Import CountryPicker


type RootStackParamList = {
  ValetScreen: { username: string } | undefined;
  BonusScreen:  { username: string } | undefined;
  SignInUpCustomer: { source?: string } | undefined;
  ForgotPass: { source?: string } | undefined;
  SignIn: { source?: string } | undefined;
  HomeScreen: undefined;
};

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

type RouteParams = {
  source?: string;
};

const clearAuthData = async () => {
  try {
    // Clear all auth-related data from AsyncStorage
    const keysToRemove = [
      'customerToken',
      'customerId',
      'username',
      'valetToken',
      'lastLoginTimestamp'
    ];
    await Promise.all(keysToRemove.map(key => AsyncStorage.removeItem(key)));
    
    // Clear any cached credentials
    if (Platform.OS === 'web') {
      // For web platform
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

const SignIn = () => {
  const [usernameOrPhone, setUsernameOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('username'); // 'username' for username, 'phone' for phone number
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as RouteParams;
  const source = params?.source || 'bonus'; // Default to 'bonus' if no source provided
  const { checkCustomerToken } = useContext(AuthContext);
  
  // Country code picker states
  const [countryCode, setCountryCode] = useState('LB'); 
  const [callingCode, setCallingCode] = useState('961'); 
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
    
  useEffect(() => {
    // Clear cached credentials when component mounts
    clearAuthData();
  }, []);

  // Phone number validation based on country
  const phoneNumberLimits = {
    'LB': 8,  // Lebanon
    'US': 10, // United States
    'UK': 11, // United Kingdom
    'AE': 9,  // UAE
    'CA': 10, // Canada
    'DE': 10, // Germany
    'FR': 9,  // France
    'ES': 9,  // Spain
    'IT': 10, // Italy
    'RU': 10, // Russia
    'CN': 11, // China
    'IN': 10, // India
    'BR': 11, // Brazil
    'SA': 9,  // Saudi Arabia
    'JP': 10, // Japan
    'AU': 9,  // Australia
    'NZ': 10, // New Zealand
    'EG': 10, // Egypt
    'ZA': 9,  // South Africa
    'NG': 10, // Nigeria
    'KR': 10, // South Korea
    'SE': 9,  // Sweden
    'NO': 8,  // Norway
    'FI': 9,  // Finland
    'DK': 8,  // Denmark
    'BE': 9,  // Belgium
    'AT': 10, // Austria
    'CH': 9,  // Switzerland
    'PL': 9,  // Poland
    'GR': 10, // Greece
    'PT': 9,  // Portugal
    'TR': 10, // Turkey
    'PH': 10, // Philippines
    'ID': 10, // Indonesia
    'MY': 9,  // Malaysia
    'TH': 9,  // Thailand
    'VN': 10, // Vietnam
    'MX': 10, // Mexico
    'CO': 10, // Colombia
    'PE': 9,  // Peru
    'CL': 9,  // Chile
    'AR': 10, // Argentina
    'EC': 9,  // Ecuador
    'BO': 8,  // Bolivia
    'UY': 9,  // Uruguay
    'PY': 9,  // Paraguay
    'HN': 8,  // Honduras
    'CR': 8,  // Costa Rica
    'GT': 8,  // Guatemala
    'SV': 8,  // El Salvador
    'NI': 8,  // Nicaragua
    'PA': 8,  // Panama
    'DO': 10, // Dominican Republic
    'HT': 10, // Haiti
    'JM': 10, // Jamaica
    'BB': 10, // Barbados
    'TT': 10, // Trinidad and Tobago
    'BS': 10, // Bahamas
    'LC': 10, // Saint Lucia
    'GD': 10, // Grenada
    'VC': 10, // Saint Vincent and the Grenadines
    'KY': 10, // Cayman Islands
    'BM': 10, // Bermuda
    'AI': 10, // Anguilla
    'VG': 10, // British Virgin Islands
    'MP': 10, // Northern Mariana Islands
    'GU': 10, // Guam
    'FM': 10, // Federated States of Micronesia
    'MH': 10, // Marshall Islands
    'PW': 10, // Palau
    'LA': 10, // Laos
    'KH': 10, // Cambodia
    'MM': 10, // Myanmar
    'LK': 10, // Sri Lanka
    'BD': 11, // Bangladesh
    'PK': 11, // Pakistan
    'IR': 10, // Iran
    'SY': 9,  // Syria
    'IQ': 10, // Iraq
    'KW': 8,  // Kuwait
    'JO': 9,  // Jordan
    'LY': 9,  // Libya
    'MA': 9,  // Morocco
    'DZ': 9,  // Algeria
    'TN': 8,  // Tunisia
    'MW': 10, // Malawi
    'KE': 10, // Kenya
    'UG': 10, // Uganda
    'TZ': 10, // Tanzania
    'RW': 10, // Rwanda
    'ET': 10, // Ethiopia
    'ZM': 10, // Zambia
    'ZW': 9,  // Zimbabwe
    'MG': 10, // Madagascar
    'MO': 9,  // Macau
    'BT': 8,  // Bhutan
    'NP': 10, // Nepal
    'AF': 9,  // Afghanistan
    'SG': 8,  // Singapore
    'HK': 8,  // Hong Kong
    'TW': 10, // Taiwan
    'AL': 8,  // Albania
    'AD': 9,  // Andorra
    'AO': 9,  // Angola
    'AG': 10, // Antigua and Barbuda
    'AM': 8,  // Armenia
    'AW': 10, // Aruba
    'AZ': 9,  // Azerbaijan
    'BH': 8,  // Bahrain
    'BY': 9,  // Belarus
    'BZ': 8,  // Belize
    'BJ': 10, // Benin
    'BA': 8,  // Bosnia and Herzegovina
    'BW': 8,  // Botswana
    'BN': 8,  // Brunei
    'BG': 10, // Bulgaria
    'BF': 10, // Burkina Faso
    'BI': 8,  // Burundi
    'CV': 9,  // Cape Verde
    'CM': 10, // Cameroon
    'KM': 9,  // Comoros
    'CG': 9,  // Congo
    'CD': 9,  // Congo (Democratic Republic)
    'CI': 10, // Côte d'Ivoire
    'HR': 10, // Croatia
    'CU': 8,  // Cuba
    'CY': 10, // Cyprus
    'CZ': 9,  // Czech Republic
    'DJ': 9,  // Djibouti
    'DM': 10, // Dominica
    'ER': 9,  // Eritrea
    'EE': 9,  // Estonia
    'FJ': 8,  // Fiji
    'FO': 8,  // Faroe Islands
    'GA': 8,  // Gabon
    'GM': 9,  // Gambia
    'GE': 9,  // Georgia
    'GH': 10, // Ghana=
    'GN': 9,  // Guinea
    'GW': 8,  // Guinea-Bissau
    'GY': 10, // Guyana
    'HU': 9,  // Hungary
    'IS': 8,  // Iceland
    'IE': 9,  // Ireland
    'IL': 9,  // Israel
    'KI': 9,  // Kiribati
    'LR': 8,  // Liberia
    'LI': 9,  // Liechtenstein
    'LT': 9,  // Lithuania
    'LU': 9,  // Luxembourg
    'MK': 8,  // North Macedonia
    'ML': 10, // Mali
    'MT': 9,  // Malta
    'MQ': 10, // Martinique
    'MR': 10, // Mauritania
    'MU': 10, // Mauritius
    'YT': 10, // Mayotte
    'MD': 9,  // Moldova
    'MC': 9,  // Monaco
    'MN': 8,  // Mongolia
    'ME': 9,  // Montenegro
    'MS': 10, // Montserrat
    'MZ': 10, // Mozambique
    'NA': 10, // Namibia
    'NR': 8,  // Nauru
    'NL': 9,  // Netherlands
    'NC': 10, // New Caledonia
    'NE': 9,  // Niger
    'OM': 9,  // Oman
    'PG': 10, // Papua New Guinea
    'PR': 10, // Puerto Rico
    'QA': 8,  // Qatar
    'RO': 10, // Romania
    'RS': 9,  // Serbia
    'SD': 10, // Sudan
    'SN': 10, // Senegal
    'SK': 9,  // Slovakia
    'SI': 9,  // Slovenia
    'SB': 10, // Solomon Islands
    'SO': 10, // Somalia
    'TJ': 10, // Tajikistan
    'TG': 10, // Togo
    'TO': 10, // Tonga
    'TM': 10, // Turkmenistan
    'TC': 10, // Turks and Caicos Islands
    'TV': 10, // Tuvalu
    'UA': 10, // Ukraine
    'GB': 11, // United Kingdom
    'UZ': 10, // Uzbekistan
    'VE': 10, // Venezuela
    'WF': 10, // Wallis and Futuna
    'YE': 10, // Yemen
};

const clearFormFields = () => {
  setUsernameOrPhone('');
  setPassword('');
};

  const getCurrentLimit = () => {
    return phoneNumberLimits[countryCode] || 10; // Default to 10 if country not found
  };

  // Handle phone number input with validation
  const handlePhoneNumberChange = (text) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Get the limit for the current country
    const limit = getCurrentLimit();
    
    // Only update if within limit
    if (numericValue.length <= limit) {
      setUsernameOrPhone(numericValue);
    }
  };

  const onSelectCountry = (country) => {
    setCountryCode(country.cca2); // Update country code
    setCallingCode(country.callingCode[0]); // Set the country calling code
    setIsCountryPickerVisible(false); // Hide country picker after selection
  };

  const handleSignIn = async () => {
    // Validate based on login method
    if (loginMethod === 'phone') {
      // Validate phone number length before submitting
      const expectedLength = getCurrentLimit();
      if (usernameOrPhone.length !== expectedLength) {
        alert(`Please enter ${expectedLength} digits for ${countryCode} phone numbers.`);
        return;
      }
    } else if (!usernameOrPhone || usernameOrPhone.trim() === '') {
      alert('Username is required');
      return;
    }
    
    if (password.trim().length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
  
    const userData = {
      usernameOrPhone: loginMethod === 'phone' ? `+${callingCode}${usernameOrPhone}` : usernameOrPhone,
      password,
      role: "customer",
      loginMethod: loginMethod // Send login method to backend
    };
  
    try {
      const response = await axios.post(`${ipAddress}/api/Auth/login`, userData);
      const { token, _id, username, isVerified } = response.data;
  
      // Store all the user data
      await Promise.all([
        AsyncStorage.setItem('lastLoginTimestamp', Date.now().toString()),
        AsyncStorage.setItem('customerToken', token),
        AsyncStorage.setItem('customerId', _id),
        AsyncStorage.setItem('username', username),
        AsyncStorage.setItem('userData', JSON.stringify({
          token,
          _id,
          username,
          isVerified
        }))
      ]);
  
      console.log('Token stored successfully:', token);
      console.log('Verification status:', isVerified);
  
      // Call the API to increment totalTimesSigned
      await incrementTotalTimesSigned(_id);
  
      // Run checkCustomerToken to update app state before navigation
      await checkCustomerToken();

      navigation.navigate('ValetScreen', { username: username });
      console.log('Customer Token:', token);
      console.log('Customer ID:', _id)
      console.log('Navigating to bonus screen');
      clearFormFields(); // Clear all form fields

      // Start the logout timer (5 minutes)
      setTimeout(async () => {
        await logoutUser();
      }, 3000000);
    } catch (error) {
      console.error('Error signing in:', error);
      await clearAuthData();
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(error.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        alert('Login failed. Please check your connection and try again.');
      }
    }
  };
  
  // Function to increment totalTimesSigned
  const incrementTotalTimesSigned = async (userId) => {
    try {
      const response = await axios.post(`${ipAddress}/api/Auth/incrementTotalTimesSigned`, { userId });
      console.log('Total times signed incremented:', response.data);
    } catch (error) {
      console.error('Error incrementing totalTimesSigned:', error);
    }
  };
  
  const logoutUser = async () => {
    await clearAuthData();
    console.log('User logged out due to inactivity.');
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }]
    });
  };

  // Toggle between email (username) and phone login methods
  const toggleLoginMethod = (method) => {
    setLoginMethod(method);
    setUsernameOrPhone(''); // Clear the input when switching methods
  };

  return (
    <ImageBackground source={require('../../assets/StartingScreen.png')} style={styles.backgroundContainer}>
      <View style={styles.container} >
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />
        <Image source={require('../../assets/newlogo_waytrix.png')} style={styles.image}/>
        <Text style={styles.title}>Log In</Text>
        
        <View style={styles.formcontainer}>
          {/* Login method selector */}
          <View style={{ width: '100%', alignItems: 'flex-start' }}>
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, loginMethod === 'username' ? styles.activeTab : null]} 
                onPress={() => toggleLoginMethod('username')}
              >
                <Text style={[styles.tabText, loginMethod === 'username' ? styles.activeTabText : null]}>Username</Text>
              </TouchableOpacity>
              <Text style={styles.dash}>|</Text>
              <TouchableOpacity 
                style={[styles.tab, loginMethod === 'phone' ? styles.activeTab : null, styles.phone]} 
                onPress={() => toggleLoginMethod('phone')}
              >
                <Text style={[styles.tabText, loginMethod === 'phone' ? styles.activeTabText : null]}>Phone Number</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Conditional input based on login method */}
          {loginMethod === 'username' ? (
            // Username input
            <TextInput
              placeholder="Enter your username"
              value={usernameOrPhone}
              onChangeText={setUsernameOrPhone}
              style={styles.input}
              placeholderTextColor="#CCCCCC"
              autoComplete="off"
            />
          ) : (
            // Phone input with country code picker
            <View style={styles.phoneInputWrapper}>
              <TouchableOpacity 
                onPress={() => setIsCountryPickerVisible(true)} 
                style={styles.countrySelector}
              >
                <Image 
                  source={{ uri: `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png` }} 
                  style={styles.flagIcon} 
                />
                <Icon name="chevron-down" size={20} color="#CCCCCC" />
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TextInput
                value={usernameOrPhone}
                onChangeText={handlePhoneNumberChange}
                style={styles.phoneNumberInput}
                placeholder={`Enter ${getCurrentLimit()} digits`}
                placeholderTextColor="#CCCCCC"
                keyboardType="phone-pad"
                maxLength={getCurrentLimit()}
              />
              
              <CountryPicker
                visible={isCountryPickerVisible}
                onClose={() => setIsCountryPickerVisible(false)}
                onSelect={onSelectCountry}
                countryCode={countryCode}
                withFlag
                withCallingCode
                withAlphaFilter
                containerButtonStyle={styles.invisibleButton}
                theme={{
                  backgroundColor: '#fff',
                  flagSize: 24,
                  fontSize: 16,
                  filterPlaceholderTextColor: '#9EA0A4',
                  onBackgroundTextColor: '#333',
                }}
              />
            </View>
          )}
          
          <Text style={styles.usenameLabel}>Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"  
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[styles.input, styles.passwordInput]}
              placeholderTextColor="#CCCCCC"
              autoComplete="off"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
              <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#000000" />
            </TouchableOpacity>
          </View>
          
          <View style={{ width: '100%', alignItems: 'flex-start' }}>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
              <Text style={styles.forgetpassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity onPress={handleSignIn} style={styles.buttonContainer}>
          <LinearGradient
            colors={['#3F63CB', '#679BFF']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>
       
        <TouchableOpacity style={styles.linkcontent} onPress={() => navigation.navigate('SignInUpCustomer', { source: source })}>
          <Text style={styles.baseText}>Don't have an account yet?</Text>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
    
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    top: '0%',
  },
  container: {
    flexGrow: 1 ,
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    top: '-15%',
    // padding: 20,
  },
  dash: {
    fontSize: 20,
    color: '#ffffff',
  },
  phone: {
    marginLeft: 15,
  },
  image: {
    width: 300,
    height: 90,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 30,
    top: '7%',
  },
  formcontainer: {
    width: '80%',
    top: '7%'
  },
  // Tab styles for login method selection
  tabContainer: {
    flexDirection: 'row',
    width: 'auto', // Change from '50%' to 'auto' to allow natural width
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginBottom: 10, // Add some bottom margin
    alignItems: 'center', // Change from 'flex-start' to 'center' for vertical alignment
    paddingLeft: 0, // Ensure there's no left padding
    marginLeft: 0, // Ensure there's no left margin
  },
  tab: {
    paddingRight: 10, // Add right padding instead of using flex
    alignItems: 'flex-start', // Align text to the left
  },
  activeTab: {
    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  tabText: {
    color: 'rgba(162, 162, 162, 0.74)',
    fontWeight: '500',
    fontSize: 16,
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  usenameLabel: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: '#FFFFFF',
    fontSize: 16,
  },
  icon: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',  // Set background color to white
    color: '#000000',   
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 45,
  },
  forgetpassword: {
    color: '#FFFFFF',
    marginTop: 10,
    alignSelf: 'flex-start',
    textDecorationLine: 'underline', 
  },
  buttonContainer: {
    width: 200,
    height: 53,
    borderRadius: 99,
    overflow: 'hidden', // Ensures the gradient does not spill outside the border radius
    marginTop: 20,
    top: '7%'
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99, // Ensure that the gradient follows this border radius
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
  signUpTextContainer: {
    flexDirection: 'row',
  },
  baseText: {
    marginTop: 10,
    color: '#FFFFFF',
  },
  linkcontent:{
    top:'7%'
  },
  
  // Country code picker styles
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    height: 48,
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  flagIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E5E5E5',
  },
  phoneNumberInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingHorizontal: 10,
  },
  invisibleButton: {
    display: 'none',
  },
});

export default SignIn;