import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SignIn from '../Accounts/Customer/SignINCustomer'
import SignInUpCustomer from '../Accounts/Customer/SignUpCustomer';
import { useNavigation } from '@react-navigation/native';


const valet_starting_page = () => {
    const navigation = useNavigation();
  
  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.backgroundContainer}>
    <View style={styles.container}>
    <Image source={require('../../assets/logo1.png')} style={styles.image}/>
      {/* <StatusBar barStyle="light-content" backgroundColor="#000066" /> */}
      <Text style={styles.title}>Your Car is</Text>
      <Text style={styles.title}>"JUST"</Text>
      <Text style={styles.title}>a Login Away</Text>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('SignIn', { source: 'valet' })}>
                <LinearGradient
                  colors={['#3F63CB', '#679BFF']}
                  style={styles.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signupbutton} onPress={() => navigation.navigate('SignInUpCustomer')}>
                  <Text style={styles.signupbuttonText}>Sign Up</Text>
              </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000066',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: '-15%',
  },
  image: {
    width: 170,
    height: 170,
    top: '-7%',
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    // marginBottom: 20,
    top: '-5%',
    textAlign: 'center',
  },
  buttonContainer: {
    width: 200,
    height: 53,
    borderRadius: 99,
    overflow: 'hidden', // Ensures the gradient does not spill outside the border radius
    marginBottom: 15,
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
  signupbutton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    backgroundColor: "#C3C3C3",
    width: 200,
    height: 53,
  },
  signupbuttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default valet_starting_page;
