import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomHeader from '../../layout/CustomHeader'; 
// import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import UpdateAccount from './Update';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ipAddress from '../../config';
import { Navigate } from 'react-router-native';
import BonusScreen from '../Bonus/BonusScreen';
import ValetScreen from '../OrderScreen/ValetScreen';

type profileRouteProp = RouteProp<{
  Profile: {
    username?: string;
    verified?: boolean;
  };
}>;

type RootStackParamList = {
  Profile: { username: string } | undefined;
};

const Profile = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [username, setUsername] = useState('');
  const [verified, setVerified] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');;
  const navigation = useNavigation();
  const route = useRoute();
  const { fromScreen } = route.params || {}; // Destructure fromScreen from route parameters


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsed = JSON.parse(userData);
          setUsername(parsed.username);
          // Make sure you're using the right property from userData
          setVerified(parsed.isVerified);
          setEmail(parsed.email);
          setUserId(parsed._id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  // const handleVerification = async () => {
  //   setLoading(true);
  //   try {
  //     const customerToken = await AsyncStorage.getItem('customerToken');
  //     const response = await axios.post(`${ipAddress}/api/auth/sendVerificationEmail`, {}, {
  //       headers: {
  //           Authorization: customerToken
  //       }
  //   });
  //     setModalVisible(true);
  //   } catch (error) {
  //     console.error('Error sending verification email:', error);
  //     alert('Failed to send verification email. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

 

  const checkVerificationStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('customerToken');
      if (!token) return;
  
      const response = await axios.get(`${ipAddress}/api/auth/checkVerification`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data.isVerified) {
        setVerified(true);
        // Update AsyncStorage with new verification status
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          const updatedData = { ...parsedData, isVerified: true };
          await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  useEffect(() => {
    // Check verification status when component mounts
    checkVerificationStatus();
  }, []);


  const sendVerificationEmail = async () => {
    setLoading(true);
    try {
      // Get the token from AsyncStorage
      const token = await AsyncStorage.getItem('customerToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch(`${ipAddress}/api/auth/sendVerificationEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add 'Bearer' prefix
        }
      });
  
      const data = await response.json();
      
      if (response.ok) {
        setModalVisible(true); // Show success modal
        setTimeout(() => {
          setModalVisible(false);
        }, 4000);
        return {
          success: true,
          message: data.message
        };
      } else {
        throw new Error(data.error || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Verification email error:', error);
      alert(error.message || 'Failed to send verification email');
      return {
        success: false,
        message: error.message || 'Network error occurred'
      };
    } finally {
      setLoading(false);
    }
  };
    
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);  // Toggle the state
      };

      const handleBackButton = () => {
        if (fromScreen === 'BonusScreen') {
          navigation.navigate('BonusScreen');
        } else if (fromScreen === 'ValetScreen') {
          navigation.navigate('ValetScreen');
        } else {
          navigation.goBack(); // Fallback to the previous screen
        }
      };
  return (
            <LinearGradient
            colors={['#3F63CB', '#003266', '#000000']}
            locations={[0, 0.4895, 0.9789]}
            style={styles.container}
          >

    <View style={styles.content}>
    <CustomHeader username = {username}  />

        <View style={styles.profileContainer}>
    <Text style={styles.title}>Manage Account</Text>
    <View style={styles.buttonsContainer}>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UpdateAccount')}>
          <View style={styles.updateAccount}>
            <Text style={styles.buttonText}>Update Account</Text>
            <Ionicons name="chevron-down" size={20} color="white"   style={{
              transform: [{ rotate: isExpanded ? '0deg' : '270deg' }]  // Conditional rotation
            }}/> 
          </View>
        </TouchableOpacity>
        {!verified && (
            <TouchableOpacity 
              style={styles.button} 
              onPress={sendVerificationEmail}
              disabled={loading}
            >
              <View style={styles.updateAccount}>
                <Text style={styles.buttonText}>
                  {loading ? 'Sending...' : 'Verify Account'}
                </Text>
                {loading && <ActivityIndicator size="small" color="white" />}
              </View>
            </TouchableOpacity>
          )}
        </View>
    </View>

    <TouchableOpacity onPress={handleBackButton}  style={styles.submitButton}>
         <LinearGradient
                         colors={['#3F63CB', '#679BFF']}
                         style={styles.backbutton}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 1, y: 0 }}
                       >
           <Text style={styles.submitButtonText}>Back</Text>
        </LinearGradient>
         </TouchableOpacity>
     {/* Verification Modal */}

                    <Modal
                                      animationType="fade"
                                      transparent={true}
                                      visible={modalVisible}
                                      onRequestClose={() => setModalVisible(false)}
                                    >
                                      <View style={styles.modalBackground}>
                                        <LinearGradient
                                                    colors={['#000000', '#003266']}
                                                    style={styles.modalContent}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 0, y: 0.9789 }}
                                                  >
                                        <View style={styles.modalContainer}>
                                        <Text style={styles.modalText}> Please check your email to verify your account.</Text>
                                        </View>
                                        </LinearGradient>
                                      </View>
                                    </Modal>
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000066',
    // alignItems: 'center',
    // justifyContent: 'center',
    
  },
  content: {
    flex: 1,
    // width: '100%',
    // alignItems: 'center',
    // justifyContent: 'center',
    top: '2%',
    // backgroundColor: '#000066',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    marginTop: '15%',
 },
 buttonsContainer:{
  gap: 20,
 },
  updateAccount: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
  
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: '-5%',
    // width: '100%',
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    // marginBottom: 20,
    top: '-5%',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(49, 49, 49, 0.4)',
    padding: 15,
    width: 570,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonText: {
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
  submitButton: {
    width: 200,
    height: 53,
    borderRadius: 10,
    overflow: 'hidden', // Ensures the gradient does not spill outside the border radius
    marginBottom: 100,
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backbutton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Ensure that the gradient follows this border radius
  },
});

export default Profile;


