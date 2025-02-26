import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text,TextInput, TouchableOpacity, ImageBackground, Image, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomHeader from '../../layout/CustomHeader'; 
import { Ionicons } from '@expo/vector-icons'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';  // Using MaterialCommunityIcons'
import ipAddress from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';




const ChangePassword = () => {
    const [oldPassword, setoldPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [newPassword, setnewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmPassword, setconfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      const [showPassword, setShowPassword] = useState(false); 
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [username, setUsername] = useState<string>('');
    const route = useRoute<RouteProp<{ changePassword: { username?: string } }>>();
    
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

        const [isExpanded, setIsExpanded] = useState(false);  // State to track expand/collapse
        const toggleExpand = () => {
            setIsExpanded(!isExpanded);  // Toggle the state
          };

          const handleUpdate = async () => {
            try {
              // Input validation
              if (!oldPassword || !newPassword || !confirmPassword) {
                Alert.alert('Error', 'Please fill out all fields');
                return;
              }
          
              if (newPassword !== confirmPassword) {
                Alert.alert('Error', 'New password and confirm password do not match');
                return;
              }
          
              if (newPassword.length < 8) {
                Alert.alert('Error', 'Password must be at least 8 characters long');
                return;
              }
          
              // Get token from AsyncStorage
              const token = await AsyncStorage.getItem('customerToken');
              if (!token) {
                Alert.alert('Error', 'Please log in again');
                return;
              }
          
              const payload = {
                oldPassword,
                newPassword,
                confirmPassword,
              };
          
              const response = await fetch(`${ipAddress}/api/Auth/changePassword`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
              });
          
              const data = await response.json();
          
              if (response.ok) {
                // Alert.alert('Success', 'Password changed successfully');
                setoldPassword('');
                setnewPassword('');
                setconfirmPassword('');
                setModalVisible(true);
                setTimeout(() => {
                  setModalVisible(false);
                }, 4000);               } else {
                Alert.alert('Error', data.message || 'Failed to change password');
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
    <Text style={styles.title}>Change Password</Text>
    <Text style={styles.label}>Old Password</Text>
            <View style={styles.passwordContainer}>
    
            <TextInput
              style={styles.input}
              value={oldPassword}
              onChangeText={setoldPassword}
              placeholder="************"
              placeholderTextColor="#ccc"
              secureTextEntry={!showOldPassword}
            />
            <TouchableOpacity
                        onPress={() => setShowOldPassword(!showOldPassword)}
                        style={styles.icon}
                    >
                        <MaterialCommunityIcons
                            name={showOldPassword ? "eye" : "eye-off"}
                            size={24}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
        </View>

    <Text style={styles.label}>New Password</Text>
    <View style={styles.passwordContainer}>
        <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setnewPassword}
              placeholder="************"
              placeholderTextColor="#ccc"
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        style={styles.icon}
                    >
                        <MaterialCommunityIcons
                            name={showNewPassword ? "eye" : "eye-off"}
                            size={24}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
    </View>
<Text style={styles.label}>Confirm Password</Text>
    <View style={styles.passwordContainer}>
        <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setconfirmPassword}
              placeholder="************"
              placeholderTextColor="#ccc"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.icon}
                    >
                        <MaterialCommunityIcons
                            name={showConfirmPassword ? "eye" : "eye-off"}
                            size={24}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
    </View>
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
                                  <Text style={styles.modalText}>Password Changed Succesfully</Text>
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
    justifyContent: 'center',
    
  },
  container: {
    flex: 1,
    top: '2%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    top: '5%',
    gap: 15,
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
    // marginBottom: 10,
    alignSelf: 'flex-start',
  },
  input: {
    height: 50,
    width: 570,
    borderColor: '#fff',
    borderWidth: 0.5,
    backgroundColor: 'rgba(49, 49, 49, 0.4)',
    opacity: 0.8,
    color: 'white',
    fontWeight:'bold',
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
        padding: 10,
        width: 570,
        borderRadius: 10,
        marginTop: 40,
        borderColor: 'white',
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

      },
      modalContent: {
        borderRadius: 20,
        padding: 10,
        width: '100%',
        maxWidth: 450,
        height: 100,
        alignItems: 'center',
        margin: 0,
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
      },
      modalText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      icon: {
        position: 'absolute',
        right: 10,
        height: '100%',
        justifyContent: 'center',
        padding: 10,
        alignItems: 'center',
      },

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
      },

});

export default ChangePassword;


