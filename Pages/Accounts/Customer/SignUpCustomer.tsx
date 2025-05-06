import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal,ImageBackground, Image, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import SignIn from './SignINCustomer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipAddress from '../../../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CountryPicker from 'react-native-country-picker-modal'; // Import CountryPicker
import { NativeRouter, Route, Link } from 'react-router-native';
import { LinearGradient } from 'expo-linear-gradient';
import RNPickerSelect from 'react-native-picker-select';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import OrderScreen from '../../OrderScreen/OrderScreen';
import { useRoute } from '@react-navigation/native';


// import { format } from 'date-fns'; // Add this import

const formatMonthYear = (date) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const Calendar = ({ visible, onSelect, onClose }) => {
const [selectedDate, setSelectedDate] = useState(new Date());
const [currentMonth, setCurrentMonth] = useState(new Date());
const [yearSelectVisible, setYearSelectVisible] = useState(false);


const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();


const generateCalendarDays = () => {
  const days = [];
  const previousMonthDays = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    0
  ).getDate();

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      day: previousMonthDays - i,
      isCurrentMonth: false,
      isPreviousMonth: true
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      isCurrentMonth: true,
      isSelected: day === selectedDate.getDate() &&
                 currentMonth.getMonth() === selectedDate.getMonth() &&
                 currentMonth.getFullYear() === selectedDate.getFullYear()
    });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      isCurrentMonth: false,
      isNextMonth: true
    });
  }

  return days;
};
// const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
// const months = ['January', 'February', 'March', 'April', 'May', 'June', 
//                'July', 'August', 'September', 'October', 'November', 'December'];

const goToPreviousMonth = () => {
  setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
};

const goToNextMonth = () => {
  setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
};



const handleDateSelect = (date) => {
  const newDate = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    date
  );
  setSelectedDate(newDate);
  onSelect(newDate);
};

const changeMonth = (increment) => {
  setCurrentMonth(new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + increment,
    1
  ));
};

const changeYear = (year) => {
  setCurrentMonth(new Date(
    year,
    currentMonth.getMonth(),
    1
  ));
  setYearSelectVisible(false);
};

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 100; i <= currentYear; i++) {
    years.push(i);
  }
  return years.reverse();
};




return visible && (
  <View style={styles.calendarContainer}>
    <View style={styles.calendarHeader}>
      <TouchableOpacity 
        onPress={() => changeMonth(-1)}
        style={styles.monthNavigator}
      >
        <Text style={styles.navigationArrow}>{'<'}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => setYearSelectVisible(!yearSelectVisible)}
        style={styles.monthYearSelector}
      >
        <Text style={styles.monthYearText}>
          {formatMonthYear(currentMonth)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => changeMonth(1)}
        style={styles.monthNavigator}
      >
        <Text style={styles.navigationArrow}>{'>'}</Text>
      </TouchableOpacity>
    </View>

    {yearSelectVisible && (
      <ScrollView style={styles.yearSelector}>
        {generateYearOptions().map(year => (
          <TouchableOpacity
            key={year}
            onPress={() => changeYear(year)}
            style={styles.yearOption}
          >
            <Text style={[
              styles.yearText,
              year === currentMonth.getFullYear() && styles.selectedYearText
            ]}>
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )}

    <View style={styles.weekDayHeader}>
      {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
        <Text key={day} style={styles.weekDayText}>{day}</Text>
      ))}
    </View>

    <View style={styles.daysGrid}>
      {generateCalendarDays().map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => item.isCurrentMonth && handleDateSelect(item.day)}
          style={[
            styles.dayCell,
            item.isSelected && styles.selectedDay
          ]}
          disabled={!item.isCurrentMonth}
        >
          <Text style={[
            styles.dayText,
            !item.isCurrentMonth && styles.otherMonthDay,
            item.isSelected && styles.selectedDayText
          ]}>
            {item.day}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);
};

type RouteParams = {
  source?: string;
};

const Customer = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationKey, setVerificationKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dob, setdob] = useState(''); 
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [countryCode, setCountryCode] = useState('LB'); 
  const [callingCode, setCallingCode] = useState('961'); 
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [combinedPhone, setCombinedPhone] = useState('');
  const [usernameExists, setUsernameExists] = useState(false); // New state to track if username exists
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  const route = useRoute();
  const params = route.params as RouteParams;
  const source = params?.source || 'bonus';
  
  // Error states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [dobError, setdobError] = useState('');


    // Check username on change after a delay
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (username.trim()) {
          checkUsername(username);
        } else {
          setUsernameError('');
        }
      }, 5000);
  
      return () => clearTimeout(timeoutId);
    }, [username]);

     // Check email on change after a delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (email.trim() && /^\S+@\S+\.\S+$/.test(email)) {
        checkEmail(email);
      } else if (email.trim() && !/^\S+@\S+\.\S+$/.test(email)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [email]);

  // Check phone on change after a delay
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (phone.trim() && phone.length >= 8) {
  //       checkPhone(phone);
  //     } else if (phone.trim()) {
  //       setPhoneError('Phone number should be at least 8 digits');
  //     } else {
  //       setPhoneError('');
  //     }
  //   }, 500);

  //   return () => clearTimeout(timeoutId);
  // }, [phone, callingCode]);


  // Function to check if email already exists
  const checkEmail = async (email) => {
    try {
      if (!email.trim()) {
        setEmailError('');
        return;
      }

      const response = await axios.post(`${ipAddress}/api/auth/signup`, { 
        email 
      });

      // Email is available
      setEmailError('');
    } catch (error) {
      // If server returns email already taken error
      if (error.response && error.response.status === 400 && 
          (error.response.data === 'email already taken' || error.response.data === 'User already exists')) {
        setEmailError('Email already taken');
      } else {
        setEmailError('');
      }
    }
  };

  // Function to check if phone already exists
  const checkPhone = async (phone) => {
    try {
      if (!phone.trim()) {
        setPhoneError('');
        return;
      }

      const combinedPhone = `+${callingCode}${phone}`;
      const response = await axios.post(`${ipAddress}/api/auth/signup`, { 
        phone: combinedPhone 
      });

      // Phone is available
      setPhoneError('');
    } catch (error) {
      // If server returns phone already taken error
      if (error.response && error.response.status === 400 && 
          error.response.data === 'Phone number already exists') {
        setPhoneError('Phone number already exists');
      } else {
        setPhoneError('');
      }
    }
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
      setPhone(numericValue);
    }
  };



      // Call checkUsername on username change
      useEffect(() => {
        const timeoutId = setTimeout(() => {
          if (username.trim()) {
            checkUsername(username);
          } else {
            setUsernameExists(false);
          }
        }, 500);
    
        return () => clearTimeout(timeoutId);
      }, [username]);


      useEffect(() => {
        const interval = setInterval(() => {
          AsyncStorage.getItem('verificationModalVisible').then(value => {
            if (value !== null) {
              setVerificationModalVisible(JSON.parse(value));
            }
          });
        }, 1000);
    
        return () => clearInterval(interval);
      }, []);
    
      useEffect(() => {
        AsyncStorage.setItem('verificationModalVisible', JSON.stringify(verificationModalVisible));
      }, [verificationModalVisible]);


      useEffect(() => {
        const timeoutId = setTimeout(() => {
          if (email.trim()  && /^\S+@\S+\.\S+$/.test(email)) {
            checkEmail(email);
          } else {
            setEmailExists(false);
          }
        }, 500);
    
        return () => clearTimeout(timeoutId);
      }, [email]);
    

      useEffect(() => {
        const timeoutId = setTimeout(() => {
          if (phone.trim()  && phone.length >= 8) {
            checkPhone(phone);
          } else {
            setPhoneExists(false);
          }
        }, 500);
    
        return () => clearTimeout(timeoutId);
      }, [phone, callingCode]);



      const handleDateSelect = (date) => {
        // Format as MM/DD/YYYY for backend
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        setSelectedDate(formattedDate);
        setShowCalendar(false);
      };

    // Function to check username existence
    const checkUsername = async (username) => {
      try {
        // Only check if username is not empty
        if (!username.trim()) {
          setUsernameExists(false);
          return;
        }
  
        const response = await axios.post(`${ipAddress}/api/auth/signup`, { 
          username 
        });
  
        // The username is available (no error from server)
        // setUsernameExists(false);
        setUsernameError('');
      } catch (error) {
        // If server returns 400, username exists
        if (error.response && error.response.status === 400 && 
            error.response.data === 'Username already taken') {
              setUsernameError('Username already taken');
            } else {
          // For other errors, assume username is available
          setUsernameError('');
        }
      }
    };



  const handleToggleMode = () => {
    setIsSignIn(!isSignIn);
  };


  

  // Enhanced password validation
  const validatePasswords = (password, confirmPassword) => {
    // Check password length
    if (password && password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      setIsPasswordMatch(false);
      return false;
    }

    if (!confirmPassword) {
      setPasswordError('');
      setIsPasswordMatch(true);
      return true;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      setIsPasswordMatch(false);
      return false;
    }
    
    setPasswordError('');
    setIsPasswordMatch(true);
    return true;
  };

  const clearFormFields = () => {
    setName('');
    setLastName('');
    setUsername('');
    setEmail('');
    setPhone('');
    setPassword('');
    setconfirmpassword('');
    setGender('');
    setAge('');
    setSelectedDate('');
    // Reset any error states too
    setUsernameExists(false);
    setEmailExists(false);
    setPhoneExists(false);
    setPasswordError('');
    setIsPasswordMatch(true);
    setEmailError('');
    setPhoneError('');
  };

  const validateForm = () => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError('First name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate last name
    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      isValid = false;
    } else {
      setLastNameError('');
    }

    // Validate username
    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Phone validation
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else {
      const expectedLength = phoneNumberLimits[countryCode] || 8;
      if (phone.length !== expectedLength) {
        setPhoneError(`Phone number should be ${expectedLength} digits`);
        isValid = false;
      }
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    } else if (password !== confirmpassword) {
      setPasswordError('Passwords do not match');
      isValid = false;
    }

    // Gender validation
    if (!gender) {
      setGenderError('Please select a gender');
      isValid = false;
    } else {
      setGenderError('');
    }

    // Date of birth validation
    if (!selectedDate) {
      setdobError('Date of birth is required');
      isValid = false;
    } else {
      setdobError('');
    }

    return isValid;
  };

  const handleSubmit = () => {
    // First validate all form fields
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    // Check for existing username, email, or phone
    if (usernameError || emailError || phoneError) {
      return; // Stop if any field has an error
    }

    // Combine the country code and phone number
    const combinedPhone = `+${callingCode}${phone}`;

    const userData = {
      name,
      lastName,
      username,
      email,
      phone: combinedPhone,
      password,
      gender,
      dob: selectedDate,
      role: 'customer',
    };

    axios.post(`${ipAddress}/api/Auth/signup`, userData)
      .then(response => {
        console.log(response.data);
        AsyncStorage.setItem('customerId', response.data._id);
        AsyncStorage.setItem('verificationModalVisible', JSON.stringify(true));
        clearFormFields(); // Clear all form fields
        navigation.navigate('SignIn');
        setShowOtpModal(false);
      })
      .catch(error => {
        console.error(error);
        
        // Handle specific error messages from the server
        if (error.response?.data) {
          const errorMessage = error.response.data;
          
          if (typeof errorMessage === 'string') {
            if (errorMessage.includes('Username already taken')) {
              setUsernameError('Username already taken');
            } else if (errorMessage.includes('User already exists') || errorMessage.includes('email already taken')) {
              setEmailError('Email already taken');
            } else if (errorMessage.includes('Phone number already exists')) {
              setPhoneError('Phone number already exists');
            } else if (errorMessage.includes('Invalid date format')) {
              setdobError('Please enter a valid date of birth');
            }
          }
        }
        setShowOtpModal(false);

      });
  };

  const handleVerifyOTP = (otpValue) => {

      setShowOtpModal(false);
      setShowSuccessModal(true); // Show success modal after OTP verification
  };

  const handleDone = () => {
    setShowSuccessModal(false);
    navigation.navigate('SignIn'); // Navigate to sign in page
  };

  const handleVerify = () => {
    const verificationData = {
      email,
      verificationKey: parseInt(verificationKey),
    };

    axios.post(`${ipAddress}/api/Auth/verifyUser`, verificationData)
      .then(response => {
        console.log(response.data);
        setVerificationModalVisible(false);
        alert('User verified successfully!');
      })
      .catch(error => {
        alert('Verification failed: ' + error.response.data);
        console.error(error);
      });
  };

  const onSelectCountry = (country) => {
    setCountryCode(country.cca2); // Update country code
    setCallingCode(country.callingCode[0]); // Set the country calling code
    setIsCountryPickerVisible(false); // Hide country picker after selection
  };

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];


  const handleSignUp = () => {
    // Handle the sign-up logic here, e.g., API call
    console.log('Sign Up Details:', { name, lastName, email, password, phone, age, gender });
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setdob(currentDate.toLocaleDateString()); // Format the selected date
  };

  const handleResendOTP = () => {
    // Add your resend OTP logic here
  };

  const OTPVerificationModal = ({ visible, onVerify, onResend }) => {
    const [otp, setOtp] = useState('');
    
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {}}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#000000', '#003266']}
            style={styles.modalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.9789 }}
          >
            <Text style={styles.modalTitle}>
              An OTP has been sent to your phone number
            </Text>
            
            <View style={styles.otpContainer}>
              <Text style={styles.otpLabel}>OTP</Text>
              <TextInput
                style={styles.otpInput}
                placeholder="Write Here"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.resendLink} 
              onPress={onResend}
            >
              <Text style={styles.resendText}>Resend OTP in 2:00</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={styles.donebuttonContainer}
              onPress={() => onVerify(otp)}
            >
              <LinearGradient
              colors={['#3F63CB', '#679BFF']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
            <Text style={styles.doneButtonText}>Verify</Text>
  
            </LinearGradient>
              {/* <Text style={styles.verifyButtonText}>Verify</Text> */}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    );
  };
  
  const SuccessModal = ({ visible, onClose }) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {}}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#000000', '#003266']}
            style={styles.modalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.9789 }}
          >
            <Text style={styles.successTitle}>
              Congratulations! Your account has been created. Please check your email to verify your account to redeem prizes at a later stage.
            </Text>
            
            <Text style={styles.noteText}>
              *Note: Unverified accounts will not be able to benefit from prizes.
            </Text>
  
            <TouchableOpacity
              style={styles.donebuttonContainer}
              onPress={() => {
                onClose();
                navigation.navigate('SignIn');
              }}
            >
              <LinearGradient
              colors={['#3F63CB', '#679BFF']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
            <Text style={styles.doneButtonText}>Done</Text>
  
            </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    );
  };



  
  const CustomDropdown = ({ label, options, value, onSelect, placeholder = 'Choose' }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={[styles.placeholderText, value && styles.selectedText]}>
            {value ? options.find(opt => opt.value === value)?.label : placeholder}
          </Text>
          <Icon 
            name={isOpen ? 'chevron-up' : 'chevron-down'} 
            size={30} 
            color="#9EA0A4" 
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>
        
        {isOpen && (
          <View style={styles.dropdownList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  value === option.value && styles.selectedItemText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };
  
  


  return (
    <ImageBackground source={require('../../../assets/background.png')} style={styles.backgroundContainer}>
      <View style={styles.container}>
        <Image source={require('../../../assets/newlogo_waytrix.png')} style={styles.image} />
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.nameContainer}>
        <View style={styles.inputWrapper}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (text.trim()) setNameError('');
                }}
                style={[styles.input, nameError ? styles.inputError : null]}
                placeholder="First Name"
                placeholderTextColor="#9EA0A4"
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (text.trim()) setLastNameError('');
                }}
                style={[styles.input, lastNameError ? styles.inputError : null]}
                placeholder="Last Name"
                placeholderTextColor="#9EA0A4"
              />
              {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
            </View>
        </View>

        <View style={styles.nameContainer}>
          {/* <View style={styles.inputWrapper}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#9EA0A4"
            />
          </View> */}
        <View style={styles.inputWrapper}>
        <View style={styles.labelContainer}>
              <Text style={styles.label}>Username</Text>
              {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
            </View>
          <TextInput
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              // Username check will be triggered by useEffect
            }}
            style={[
              styles.input,
              usernameExists && styles.inputError
            ]}
            placeholder="Username"
            placeholderTextColor="#9EA0A4"
          />
        </View>

          <View style={styles.inputWrapper}>
          <View style={styles.labelContainer}>
              <Text style={styles.label}>Phone Number</Text>
              {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            </View>              
              <View style={[styles.phoneInputWrapper, phoneError ? styles.inputError : null]}>
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
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                placeholder={`Phone Number ${getCurrentLimit()} digits`}
                placeholderTextColor="#9EA0A4"
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
            </View>
        </View>

          <View style={styles.nameContainer}>
            <View style={styles.inputWrapper}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Date of Birth</Text>
              {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
            </View>
                          <TouchableOpacity 
                style={styles.input}
                onPress={() => setShowCalendar(!showCalendar)}
              >
                <Text style={[styles.dobplaceholderText, selectedDate && styles.selectedText]}>
                  {selectedDate || 'dob'}
                </Text>
                <Icon 
                  name={showCalendar ? 'chevron-up' : 'chevron-down'} 
                  size={30} 
                  color="#9EA0A4" 
                  style={styles.dropdownIcon}
                />
              </TouchableOpacity>
              <Calendar
                visible={showCalendar}
                onSelect={handleDateSelect}
                onClose={() => setShowCalendar(false)}
              />
            </View>
            <View style={styles.inputWrapper}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Gender</Text>
              {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
            </View>
              <CustomDropdown
                options={genderOptions}
                value={gender}
                onSelect={setGender}
                placeholder='Gender'
                // placeholderTextColor="#9EA0A4"
              />
            </View>
          </View>


          <View style={styles.labelContainer}>
              <Text style={styles.label}>Email Address</Text>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>
                      <View>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Email Address"
              placeholderTextColor="#9EA0A4"
              keyboardType="email-address"

            />

          </View>

           {/* <View style={styles.passwordContainer}>
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
                  </TouchableOpacity> */}
          
          <View style={styles.labelContainer}>
              <Text style={styles.label}>Password</Text>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>
            
               <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                validatePasswords(text, confirmpassword);

              }}
              style={[styles.input, !isPasswordMatch || passwordError  && styles.inputError]}
              placeholder="Password"
              placeholderTextColor="#9EA0A4"
              secureTextEntry={!showPassword}
              autoComplete="off"


            />
             <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
                        <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#000000" />
                  </TouchableOpacity>
                  </View>
            {password && password.length < 8 && (
          <Text style={styles.errorText}>Password must be at least 8 characters long</Text>
        )}
        

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
            <TextInput
                value={confirmpassword}
                onChangeText={(text) => {
                  setconfirmpassword(text);
                  validatePasswords(password, text);
                }}
                style={[styles.input, !isPasswordMatch && styles.inputError, passwordError ? styles.inputError : null]}
                placeholder="Confirm Password"
                placeholderTextColor="#9EA0A4"
                secureTextEntry={!showConfirmPassword}
                autoComplete="off"
                              />
                              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.icon}>
                        <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#000000" />
                  </TouchableOpacity>
                  {/* </View> */}
              {passwordError && password.length >= 8 ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
            </View>
          

          

        <TouchableOpacity onPress={handleSubmit} style={styles.buttonContainer}>
          <LinearGradient
            colors={['#3F63CB', '#679BFF']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText} onPress={() => handleSubmit()}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>

            <OTPVerificationModal
            visible={showOtpModal}
            onVerify={handleVerifyOTP}
            onResend={handleResendOTP}
            
          />
          <SuccessModal
            visible={showSuccessModal}
            onClose={handleDone}
          />

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn', { source: source })}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};



const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // top: '-8%',

  },
  container: {
    flex: 1,
    width: '100%',
    top: 10,
    padding: 20,
  },
  image: {
    width: 300,
    height: 90,
    alignSelf: 'center',
    resizeMode: 'contain',

  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  formContainer: {
    // width: 450,
    width: '100%',
    
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 10,
  },

  label: {
    fontSize: 14,
    color: '#fff',
    // marginBottom: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 8, 
    marginVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#000',
    height: 45,
    paddingLeft: 20, 
 
  },  
  placeholderText: {
    fontSize: 14,
    color: '#9EA0A4',
    paddingLeft: 20,
  },
  buttonContainer: {
    width: 150,
    height: 40,
    borderRadius: 50,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 10,
  },
  icon: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
  },
  footerLink: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline', 
    alignSelf: 'center',


  },
  // calendarContainer: {
  //   position: 'absolute',
  //   top: '100%',
  //   left: 0,
  //   right: 0,
  //   backgroundColor: 'white',
  //   borderRadius: 10,
  //   padding: 10,
  //   zIndex: 1000,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  // },
  // calendarHeader: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   paddingVertical: 10,
  // },
  monthYear: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  navigationButton: {
    fontSize: 20,
    color: '#3F63CB',
    padding: 5,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  dayLabel: {
    fontSize: 12,
    color: '#9EA0A4',
    width: '14.28%',
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumber: {
    fontSize: 14,
    color: '#000',
  },
  outsideMonthDay: {
    color: '#E8E8E8',
  },
  selectedDay: {
    backgroundColor: '#3F63CB',
    borderRadius: 20,
  },
  selectedDayText: {
    color: 'white',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  selectedText: {
    color: '#000',
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    padding: 6,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 45,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#000',
  },
  selectedItemText: {
    color: '#3F63CB',
    fontWeight: 'bold',
  },

  
  // countrySelector: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingHorizontal: 15,
  //   height: '100%',
  //   backgroundColor: '#fff',
  // },
  
  // flagIcon: {
  //   width: 24,
  //   height: 24,
  //   borderRadius: 12,
  //   marginRight: 8,
  // },
  
  // callingCode: {
  //   fontSize: 16,
  //   color: '#000000',
  //   marginRight: 4,
  //   opacity: 0.4,
  //   fontWeight: 'bold',
  // },
  
  // divider: {
  //   width: 1,
  //   height: '60%',
  //   backgroundColor: '#E5E5E5',
  //   marginRight: 8,
  // },
  
  // phoneNumberInput: {
  //   flex: 1,
  //   height: '100%',
  //   fontSize: 14,
  //   color: '#333',
  //   paddingHorizontal: 5,
    
  // },
  
  // invisibleButton: {
  //   display: 'none',
  // },
  dobplaceholderText: {
    color: '#9EA0A4',
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    // Add these to ensure full screen coverage
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  modalContent: {
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    // Remove any default margins that might cause spacing
    margin: 0,
  },
  
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  otpContainer: {
    width: '100%',
    marginBottom: 15,
  },
  
  otpLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
  },
  
  otpInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    fontSize: 16,
  },
  
  resendLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  
  resendText: {
    color: '#7C8DB0',
    fontSize: 14,
  },
  
  verifyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 10,
  },
  
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  
  noteText: {
    color: '#FF0000',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  doneButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 10,
    width: 150,
    alignItems: 'center',
  },
  
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  donebuttonContainer: {
    width: 130,
    height: 40,
    borderRadius: 50,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
    // top: -5,
    // marginBottom: 5,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
  userExistsText: {
    color: '#FF0000',
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 60,
  },
  passwordErrorText: {
    color: '#FF0000',
    fontSize: 10,
    // marginTop: 5
    top: -5,
    marginLeft: 10,
  },
  inputError: {
    borderColor: '#FF0000',
    borderWidth: 1,
  },
  // phoneInputWrapper: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  //   borderRadius: 10,
  //   height: 45,
  //   marginVertical: 9,
  //   overflow: 'hidden',
  // },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthNavigator: {
    padding: 10,
  },
  navigationArrow: {
    fontSize: 18,
    color: '#3F63CB',
  },
  monthYearSelector: {
    padding: 5,
    borderRadius: 15,
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  weekDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayText: {
    fontSize: 12,
    color: '#666',
    width: '14.28%',
    textAlign: 'center',
  },
  // daysGrid: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  // },
  // dayCell: {
  //   width: '14.28%',
  //   aspectRatio: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  dayText: {
    fontSize: 14,
    color: '#000',
  },
  otherMonthDay: {
    color: '#ccc',
  },
  // selectedDay: {
  //   backgroundColor: '#3F63CB',
  //   borderRadius: 20,
  // },
  // selectedDayText: {
  //   color: 'white',
  // },
  yearSelector: {
    maxHeight: 200,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
  },
  yearOption: {
    padding: 10,
    alignItems: 'center',
  },
  yearText: {
    fontSize: 16,
    color: '#000',
  },
  selectedYearText: {
    color: '#3F63CB',
    fontWeight: 'bold',
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 45,
    marginVertical: 9,
    overflow: 'hidden',
    position: 'relative', // Added for character count positioning

  },
  
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    height: '100%',
  },
  
  flagIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  
  callingCode: {
    fontSize: 16,
    color: '#9EA0A4',
    marginRight: 4,
  },
  
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E5E5E5',
    right: 5,
  },
  
  phoneNumberInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 10,
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
  

  
});

export default Customer;
