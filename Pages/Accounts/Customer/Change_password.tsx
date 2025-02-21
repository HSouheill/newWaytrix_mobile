import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, Modal, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';import ipAddress from '../../../config';
import { LinearGradient } from 'expo-linear-gradient';
import SignIn from './SignINCustomer';


// Define the type for the route params
type ChangePasswordRouteParams = {
  email: string;
  resetToken: string;
};  

// const Change_password = (props: { email: string; resetToken: string }) => {

const Change_password = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();


  // Type-safe usage of route.params
  const route = useRoute<RouteProp<{ params: ChangePasswordRouteParams }, 'params'>>();
  const { email, resetToken } = route.params;


  const handleChangePassword = async () => {
    // setModalVisible(true);
  
    // Validate passwords
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await axios.post(`${ipAddress}/api/auth/newPassword`, {
        email: route.params.email,
        newPassword
      });
      
      if (response.status === 200) {
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
        }, 4000); 
      }
    } catch (error) {
      console.error('Full Error Object:', error);
      console.error('Error Response:', error.response);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to reset password'
      );
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };


  

  return (
    <ImageBackground source={require('../../../assets/background.png')} style={styles.backgroundContainer}>
    <View style={styles.container}>
      <Image source={require('../../../assets/logo1.png')} style={styles.image}/>
      <Text style={styles.title}>Change Password</Text>
      <View style={styles.formcontainer}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          placeholder="Write here"
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
          placeholderTextColor="#CCCCCC"
          secureTextEntry
        />
        <Text style={styles.label}>Re-write Password</Text>
        <TextInput
          placeholder="Write here"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          placeholderTextColor="#CCCCCC"
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.buttonContainer} onPress={handleChangePassword}>
        <LinearGradient
          colors={['#3F63CB', '#679BFF']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.buttonText}>Change</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
     {/* Modal for Password Changed Success */}
     <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <LinearGradient
                      colors={['#000000', '#003266']}
                      style={styles.modalContent}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 0.9789 }}
                    >
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Password Changed Successfully</Text>

              <TouchableOpacity
                style={styles.donebuttonContainer}
                onPress={() => navigation.navigate('SignIn')}
                          >
                <LinearGradient
                      colors={['#3F63CB', '#679BFF']}
                      style={styles.button}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                          >
              <Text style={styles.modalButtonText}>Log In</Text>
                
              </LinearGradient>
            </TouchableOpacity>
          </View>
          </LinearGradient>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: '-15%',
    // paddingHorizontal: 20,
    // backgroundColor: 'black',
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: '-10%',
  },
  image: {
    width: 90,
    height: 90,
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 10,
    color: 'white',
    width: 559,
    textAlign: 'center',
  },
  formcontainer: {
    width:  450,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: '#FFFFFF',
    fontSize: 16,
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
  buttonContainer: {
    width: 150,
    height: 40,
    borderRadius: 99,
    overflow: 'hidden', // Ensures the gradient does not spill outside the border radius
    marginTop: 10,
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    margin: 0,
  },
  modalContainer: {

    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#3F63CB',
    borderRadius: 25,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  donebuttonContainer: {
    width: 130,
    height: 40,
    // borderRadius: 50,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default Change_password;
