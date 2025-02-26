import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ImageBackground, Image, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipAddress from '../../../config';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import ForgotPass from './ForgotPass';  
import SignInUpCustomer from './SignUpCustomer';
import ValetScreen from '../Valet/ValetScreen';
import bonus from '../../Bonus/BonusScreen';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import HomeScreen from '../../HomeScreen';


type RootStackParamList = {
  ValetScreen: { username: string } | undefined;
  bonus: undefined;
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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as RouteParams;
  const source = params?.source || 'bonus'; // Default to 'bonus' if no source provided


    
  useEffect(() => {
    // Clear cached credentials when component mounts
    clearAuthData();
  }, []);


  const handleSignIn = async () => {
    if (!usernameOrPhone || usernameOrPhone.trim() === '') {
      alert('Username or Phone Number is required');
      return;
    }
    
    if (password.trim().length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
  
    const userData = {
      usernameOrPhone,
      password,
      role: "customer",
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
  
      if (params?.source === 'valet') {
        navigation.navigate('ValetScreen', { username: username });
      } else {
        navigation.navigate('bonus');
        console.log('Customer Token:', token);
        console.log('Customer ID:', _id);
        console.log('Navigating to bonus screen');
      }
  
      // Start the logout timer (5 minutes)
      setTimeout(async () => {
        await logoutUser();
      }, 30000);
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

  return (
    <ImageBackground source={require('../../../assets/background.png')} style={styles.backgroundContainer}>
    <View style={styles.container}>
    <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />
        <Image source={require('../../../assets/logo1.png')} style={styles.image}/>
        <Text style={styles.title}>Log In</Text>
        <View style={styles.formcontainer}>
        <Text style={styles.usenameLabel}>Username or Phone Number</Text>

        <TextInput
          placeholder="Username or Phone Number"
          value={usernameOrPhone}
          onChangeText={setUsernameOrPhone}
          style={styles.input}
          placeholderTextColor="#CCCCCC"
          autoComplete="off"
          />
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
       
        <TouchableOpacity onPress={() => navigation.navigate('SignInUpCustomer', { source: source })}>
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
    height: '90%',
    top: '-5%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    top: '-15%',
    // padding: 20,
  },
  image: {
    width: 90,
    height: 90,
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 30,
    // top: '-7%',
  },
  formcontainer: {
    width: '80%',
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
    // color: '#FFFFFF',
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
    // marginTop: 10,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
  signUpTextContainer: {
    flexDirection: 'row',
    // marginTop: 50,
  },
  baseText: {
    marginTop: 10,
    color: '#FFFFFF',
  }
});

export default SignIn;