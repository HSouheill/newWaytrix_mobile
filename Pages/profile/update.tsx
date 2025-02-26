import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text,TextInput, TouchableOpacity, Alert, ImageBackground, Image, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomHeader from '../../layout/CustomHeader'; 
import { Ionicons } from '@expo/vector-icons'; 
import ChangePassword from './ChangePassword';
import axios from 'axios';
import ipAddress from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CountryPicker from 'react-native-country-picker-modal'; // Import CountryPicker
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';




const UpdateAccount = () => {
    const [phonenb, setphonenb] = useState('');
    const [email, setemail] = useState('');
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [countryCode, setCountryCode] = useState('LB'); 
    const [callingCode, setCallingCode] = useState('961'); 
    const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);  // State to track expand/collapse
    const [username, setUsername] = useState<string>('');
    const route = useRoute<RouteProp<{ UpdateAccount: { username?: string } }>>();
    

    useEffect(() => {
      const fetchUsername = async () => {
        const routeUsername = route.params?.username;
        if (routeUsername) {
          setUsername(routeUsername);
        } else {
          const storedUsername = await AsyncStorage.getItem('username');
          if (storedUsername) {
            setUsername(storedUsername);
          }
        }
      };

      fetchUsername();
    }, [route.params?.username]);

        const toggleExpand = () => {
            setIsExpanded(!isExpanded);  // Toggle the state
          };

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
              setphonenb(numericValue);
            }
          };
                  

          const onSelectCountry = (country) => {
            setCountryCode(country.cca2); // Update country code
            setCallingCode(country.callingCode[0]); // Set the country calling code
            setIsCountryPickerVisible(false); // Hide country picker after selection
          };
         
          const handleUpdate = async () => {
              // Validate phone number length before submitting
            const expectedLength = getCurrentLimit();
            if (phonenb.length !== expectedLength) {
              Alert.alert(
                'Invalid Phone Number',
                `Please enter ${expectedLength} digits for ${countryCode} phone numbers.`
              );
              return;
            }
            const combinedPhone = `+${callingCode}${phonenb}`;
            try {
              const token = await AsyncStorage.getItem('customerToken');
              if (!token) {
                Alert.alert('Error', 'Please login again');
                return;
              }
          
              const payload = {
                email,
                phone: combinedPhone // Send phone number as entered
              };
          
              console.log('Sending payload:', payload); // Debugging log
          
              const response = await fetch(`${ipAddress}/api/Auth/updateAccount`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
              });
          
              const data = await response.json();
              console.log('Response data:', data); // Debugging log
          
              if (response.ok) {
                setModalVisible(true);
                  setTimeout(() => {
                    setModalVisible(false);
                  }, 4000); 
                // Alert.alert('Success', 'Account updated successfully');
                setemail('');
                setphonenb('');
              } else {
                Alert.alert('Error', data.message || 'Failed to update account');
              }
            } catch (error) {
              Alert.alert('Error', 'Something went wrong. Please try again.');
            }
          };
          
          


        

          
  return (
            <LinearGradient
            colors={['#3F63CB', '#003266', '#000000']}
            locations={[0, 0.4895, 0.9789]}
            style={styles.main}
          >

    <View style={styles.container}>
    <CustomHeader username={username} />

        <View style={styles.content}>
    <Text style={styles.title}>Update Account</Text>
          <Text style={styles.label}>Phone Number</Text>
          <View style={[styles.phoneInputWrapper]}>
            <TouchableOpacity 
              onPress={() => setIsCountryPickerVisible(true)} 
              style={styles.countrySelector}
            >
              <Image 
                source={{ uri: `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png` }} 
                style={styles.flagIcon} 
              />
              <Icon name="chevron-down" size={20} color="#9EA0A4" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TextInput
              value={phonenb}
              onChangeText={setphonenb}
              style={styles.phoneNumberInput}
              placeholder={`Enter ${getCurrentLimit()} digits`}
              placeholderTextColor="#9EA0A4"
              keyboardType="phone-pad"
              maxLength={getCurrentLimit()}

            />

          {/* <Text style={styles.characterCount}>
            {phonenb.length}/{getCurrentLimit()}
          </Text> */}
            
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
          {/* </View> */}
      
    {/* <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phonenb}
              onChangeText={setphonenb}
              placeholder="01 234 567"
              placeholderTextColor="#ccc"
              keyboardType="numeric" 
            /> */}
    <Text style={styles.label}>Email Address</Text>
        <TextInput
              style={styles.input}
              value={email}
              onChangeText={setemail}
              placeholder="Example@gmail.com"
              placeholderTextColor="#ccc"
            />
    <TouchableOpacity >
              <LinearGradient
              colors={['#3F63CB', '#679BFF']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {/*  */}
            
              <Text style={styles.buttonText} onPress={handleUpdate}>Submit</Text>
              </LinearGradient>
            </TouchableOpacity>
    

        <TouchableOpacity style={styles.changepass} onPress={() => navigation.navigate('ChangePassword')}>
              <View style={styles.updateAccount}>
                <Text style={styles.changepasstext}>Change Password</Text>
                <Ionicons name="chevron-down" size={20} color="white"   style={{
                  transform: [{ rotate: isExpanded ? '0deg' : '270deg' }]  // Conditional rotation
                }}/> 
              </View>
            </TouchableOpacity>

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
                                  <Text style={styles.modalText}>Your information has been updated!</Text>
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
  main: {
    flex: 1,
    // backgroundColor: '#000066',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    top: '2%',
    
    
  },
  inputWrapper: {
    flex: 1,
    marginRight: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    top: '5%',
    gap: 5,
  },
  updateAccount: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom: 20,
    top: '-5%',
    textAlign: 'center',
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  input: {
    height: 50,
    width: 570,
    borderColor: '#rgba(244, 244, 244, 0.5)',
    borderWidth: 1,
    backgroundColor: 'rgba(49, 49, 49, 0.4)',
    opacity: 0.8,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10, // Reduced margin to decrease space
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  button: {
      width: 150,
      height: 40,
    //   padding: 20,
      backgroundColor: '#3F63CB',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
  buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    changepass: {
        backgroundColor: 'rgba(49, 49, 49, 0.4)',
        borderColor: '#rgba(244, 244, 244, 0.5)',
        padding: 10,
        width: 570,
        borderRadius: 10,
        marginTop: 40,
        borderWidth: 1,
        alignItems: 'center',
        height: 50,
      },
      changepasstext: {
        color: 'white',
        fontSize: 18,
        alignSelf: 'flex-start',
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
      modalText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#rgba(244, 244, 244, 0.5)',
        borderWidth: 1,
        backgroundColor: 'rgba(49, 49, 49, 0.4)',
        borderRadius: 10,
        height: 50,
        width: 570,
        marginBottom: 15,
        // marginVertical: 9,
        overflow: 'hidden',
        position: 'relative', // Added for character count positioning
      },
      
      countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'rgba(49, 49, 49, 0.4)', // Updated to match the phone number input
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 12,
      },
      
      flagIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
      },
      
      callingCode: {
        fontSize: 16,
        // color: '#9EA0A4',
        marginRight: 4,
      },
      
      divider: {
        width: 1,
        height: '60%',
        backgroundColor: '#E5E5E5',
      },
      
      phoneNumberInput: {
        flex: 1,
        fontSize: 14,
        color: '#fff',
        paddingHorizontal: 15,
        height: 50,
      },
    
      countryPickerModal: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 10,
      },
      
      countryPickerOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
      },
      invisibleButton: {
        display: 'none',
      },
      // characterCount: {
      //   color: '#9EA0A4',
      //   fontSize: 12,
      //   marginRight: 10,
      // },
    

});

export default UpdateAccount;


