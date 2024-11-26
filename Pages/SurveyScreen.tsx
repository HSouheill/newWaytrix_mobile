import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button,Modal, StyleSheet,Animated, ScrollView, TouchableOpacity, TextInput,  Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ipAddress from '../config';

const AnimatedModal = Animated.createAnimatedComponent(Modal);
const SurveyScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [foodQuality, setFoodQuality] = useState('');
  const [serviceQuality, setServiceQuality] = useState('');
  const [staffFriendliness, setStaffFriendliness] = useState('');
  const [valueForMoney, setValueForMoney] = useState('');
  const [restaurantCleanliness, setRestaurantCleanliness] = useState('');
  const [restaurantDesign, setRestaurantDesign] = useState('');
  const [wayTrixService, setWayTrixService] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [tableId, setTableId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    AsyncStorage.getItem('tableId').then(value => {
      setTableId(value);
    });
  }, []);
  useEffect(() => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);
  
  const handleQualitySelection = (quality, setter) => {
    setter(quality);
  };


  const handleSubmit = async () => {
    try {
      const tableToken = await AsyncStorage.getItem('tableToken');
  
      const data = {
        foodQuality,
        serviceQuality,
        staffFriendliness,
        valueForMoney,
        restaurantCleanliness,
        restaurantDesign,
        wayTrixService,
        additionalComments,
        name,
        phone,
        tableId
      };
  
      axios.post(`${ipAddress}/api/ContactUsRoutes/AddSurvey`, data, {
        headers: {
          Authorization: `${tableToken}`
        }
      })
      .then(response => {
        // Alert.alert('Survey submitted successfully');
        setModalVisible(true); // Show modal on success
        setTimeout(() => {
          setModalVisible(false); 
          setTimeout(() => {
            navigation.navigate('Home')
          }, 1500);
        }, 4000);
  
        setName('');
        setPhone('');
        setFoodQuality('');
        setServiceQuality('');
        setStaffFriendliness('');
        setValueForMoney('');
        setRestaurantCleanliness('');
        setRestaurantDesign('');
        setWayTrixService('');
        setAdditionalComments('');
      })
      .catch(error => {
        Alert.alert('Some fields are missing');
        console.error('Error submitting survey:', error);
      });
    } catch (error) {
      console.error('Error retrieving tableToken from AsyncStorage:', error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.questionContainer}>
        {/* <Text style={styles.label}>Name:</Text> */}
        <TextInput
          style={styles.textInput}
          onChangeText={setName}
          value={name}
          placeholder="ENTER YOUR NAME"
          placeholderTextColor="#fff" 
        />
      </View>

      <View style={styles.questionContainer}>
        {/* <Text style={styles.label}>Phone:</Text> */}
        <TextInput
          style={styles.textInput}
          onChangeText={setPhone}
          value={phone}
          placeholder="ENTER YOUR PHONE NUMBER"
          placeholderTextColor="#fff" 
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.label}>QUALITY OF FOOD:</Text>
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.excellentRatingButton, foodQuality === 'Excellent' ? styles.excellentButton : styles.excellentRatingButton]}
          onPress={() => handleQualitySelection('Excellent', setFoodQuality)}
        >
          <Text style={[styles.buttonText, foodQuality === 'Excellent' ? styles.excellentButtonText : styles.buttonText]}>
            Excellent</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.goodRatingButton, foodQuality === 'Good' ? styles.goodButton : styles.goodRatingButton]}
          onPress={() => handleQualitySelection('Good', setFoodQuality)}
        >
          <Text style={[styles.buttonText, foodQuality === 'Good' ? styles.goodButtonText : styles.buttonText]}>
            Good</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.averageRatingButton, foodQuality === 'Average' ? styles.averageButton : styles.averageRatingButton]}
          onPress={() => handleQualitySelection('Average', setFoodQuality)}
        >
          <Text style={[styles.buttonText, foodQuality === 'Average' ? styles.averageButtonText : styles.buttonText]}
          >Average</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.poorRatingButton, foodQuality === 'Poor' ? styles.poorButton : styles.poorRatingButton]}
          onPress={() => handleQualitySelection('Poor', setFoodQuality)}
        >
          <Text style={[styles.buttonText, foodQuality === 'Poor' ? styles.poorButtonText : styles.buttonText]}
          >Poor</Text>
        </TouchableOpacity>
      </View>
      </View>

      {/* Repeat similar structures for other questions */}
      {/* Service Quality */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>QUALITY OF SERVICE:</Text>
        <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.excellentRatingButton, serviceQuality === 'Excellent' ? styles.excellentButton : styles.excellentRatingButton]}
        onPress={() => handleQualitySelection('Excellent', setServiceQuality)}
      >
        <Text style={[styles.buttonText, serviceQuality === 'Excellent' ? styles.excellentButtonText : styles.buttonText]}
        >Excellent</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.goodRatingButton, serviceQuality === 'Good' ? styles.goodButton : styles.goodRatingButton]}
        onPress={() => handleQualitySelection('Good', setServiceQuality)}
      >
        <Text style={[styles.buttonText, serviceQuality === 'Good' ? styles.goodButtonText : styles.buttonText]}
        >Good</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.averageRatingButton, serviceQuality === 'Average' ? styles.averageButton : styles.averageRatingButton]}
        onPress={() => handleQualitySelection('Average', setServiceQuality)}
      >
        <Text style={[styles.buttonText, serviceQuality === 'Average' ? styles.averageButtonText : styles.buttonText]}
        >Average</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.poorRatingButton, serviceQuality === 'Poor' ? styles.poorButton : styles.poorRatingButton]}
        onPress={() => handleQualitySelection('Poor', setServiceQuality)}
      >
        <Text style={[styles.buttonText, serviceQuality === 'Poor' ? styles.poorButtonText : styles.buttonText]}
        >Poor</Text>
      </TouchableOpacity>
    </View>
      </View>

      {/* Friendliness of Staff */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>FRIENDLINESS OF STAFF:</Text>
        <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={[styles.excellentRatingButton, staffFriendliness === 'Excellent' ? styles.excellentButton : styles.excellentRatingButton]}
      onPress={() => handleQualitySelection('Excellent', setStaffFriendliness)}
    >
      <Text style={[styles.buttonText, staffFriendliness === 'Excellent' ? styles.excellentButtonText : styles.buttonText]}
      >Excellent</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.goodRatingButton, staffFriendliness === 'Good' ? styles.goodButton : styles.goodRatingButton]}
      onPress={() => handleQualitySelection('Good', setStaffFriendliness)}
    >
      <Text style={[styles.buttonText, staffFriendliness === 'Good' ? styles.goodButtonText : styles.buttonText]}
      >Good</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.averageRatingButton, staffFriendliness === 'Average' ? styles.averageButton : styles.averageRatingButton]}
      onPress={() => handleQualitySelection('Average', setStaffFriendliness)}
    >
      <Text style={[styles.buttonText, staffFriendliness === 'Average' ? styles.averageButtonText : styles.buttonText]}
      >Average</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.poorRatingButton, staffFriendliness === 'Poor' ? styles.poorButton : styles.poorRatingButton]}
      onPress={() => handleQualitySelection('Poor', setStaffFriendliness)}
    >
      <Text style={[styles.buttonText, staffFriendliness === 'Poor' ? styles.poorButtonText : styles.buttonText]}
      >Poor</Text>
    </TouchableOpacity>
      </View>
      </View>

      {/* Value for Money */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>VALUE FOR MONEY:</Text>
        <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={[styles.excellentRatingButton, valueForMoney === 'Excellent' ? styles.excellentButton : styles.excellentRatingButton]}
    onPress={() => handleQualitySelection('Excellent', setValueForMoney)}
  >
    <Text style={[styles.buttonText, valueForMoney === 'Excellent' ? styles.excellentButtonText : styles.buttonText]}
    >Excellent</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.goodRatingButton, valueForMoney === 'Good' ? styles.goodButton : styles.goodRatingButton]}
    onPress={() => handleQualitySelection('Good', setValueForMoney)}
  >
    <Text style={[styles.buttonText, valueForMoney === 'Good' ? styles.goodButtonText : styles.buttonText]}
    >Good</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.averageRatingButton, valueForMoney === 'Average' ? styles.averageButton : styles.averageRatingButton]}
    onPress={() => handleQualitySelection('Average', setValueForMoney)}
  >
    <Text style={[styles.buttonText, valueForMoney === 'Average' ? styles.averageButtonText : styles.buttonText]}
    >Average</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.poorRatingButton, valueForMoney === 'Poor' ? styles.poorButton : styles.poorRatingButton]}
    onPress={() => handleQualitySelection('Poor', setValueForMoney)}
  >
    <Text style={[styles.buttonText, valueForMoney === 'Poor' ? styles.poorButtonText : styles.buttonText]}
    >Poor</Text>
  </TouchableOpacity>
</View>
      </View>

      {/* Cleanliness of Restaurant */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>CLEANLINESS OF RESTAURANT:</Text>
        <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={[styles.excellentRatingButton, restaurantCleanliness === 'Excellent' ? styles.excellentButton : styles.excellentRatingButton]}
    onPress={() => handleQualitySelection('Excellent', setRestaurantCleanliness)}
  >
    <Text style={[styles.buttonText, restaurantCleanliness === 'Excellent' ? styles.excellentButtonText : styles.buttonText]}
    >Excellent</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.goodRatingButton, restaurantCleanliness === 'Good' ? styles.goodButton : styles.goodRatingButton]}
    onPress={() => handleQualitySelection('Good', setRestaurantCleanliness)}
  >
    <Text style={[styles.buttonText, restaurantCleanliness === 'Good' ? styles.goodButtonText : styles.buttonText]}
    >Good</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.averageRatingButton, restaurantCleanliness === 'Average' ? styles.averageButton : styles.averageRatingButton]}
    onPress={() => handleQualitySelection('Average', setRestaurantCleanliness)}
  >
    <Text style={[styles.buttonText, restaurantCleanliness === 'Average' ? styles.averageButtonText : styles.buttonText]}
    >Average</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.poorRatingButton, restaurantCleanliness === 'Poor' ? styles.poorButton : styles.poorRatingButton]}
    onPress={() => handleQualitySelection('Poor', setRestaurantCleanliness)}
  >
    <Text style={[styles.buttonText, restaurantCleanliness === 'Poor' ? styles.poorButtonText : styles.buttonText]}
    >Poor</Text>
  </TouchableOpacity>
</View>
      </View>

      {/* Restaurant Design */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>RESTAURANT DESIGN:</Text>
        <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={[styles.excellentRatingButton, restaurantDesign === 'Excellent' ? styles.excellentButton : styles.excellentRatingButton]}
    onPress={() => handleQualitySelection('Excellent', setRestaurantDesign)}
  >
    <Text style={[styles.buttonText, restaurantDesign === 'Excellent' ? styles.excellentButtonText : styles.buttonText]}
    >Excellent</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.goodRatingButton, restaurantDesign === 'Good' ? styles.goodButton : styles.goodRatingButton]}
    onPress={() => handleQualitySelection('Good', setRestaurantDesign)}
  >
    <Text style={[styles.buttonText, restaurantDesign === 'Good' ? styles.goodButtonText : styles.buttonText]}
    >Good</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.averageRatingButton, restaurantDesign === 'Average' ? styles.averageButton : styles.averageRatingButton]}
    onPress={() => handleQualitySelection('Average', setRestaurantDesign)}
  >
    <Text style={[styles.buttonText, restaurantDesign === 'Average' ? styles.averageButtonText : styles.buttonText]}
    >Average</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.poorRatingButton, restaurantDesign === 'Poor' ? styles.poorButton : styles.poorRatingButton]}
    onPress={() => handleQualitySelection('Poor', setRestaurantDesign)}
  >
    <Text style={[styles.buttonText, restaurantDesign === 'Poor' ? styles.poorButtonText : styles.buttonText]}
    >Poor</Text>
  </TouchableOpacity>
</View>
      </View>

      {/* WayTrix Device Service */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>WAYTRIX DEVICE SERVICE:</Text>
        <View style={styles.buttonContainer}>
  <TouchableOpacity
    style={[styles.excellentRatingButton, wayTrixService === 'Excellent' ? styles.excellentButton : styles.excellentRatingButton]}
    onPress={() => handleQualitySelection('Excellent', setWayTrixService)}
  >
    <Text style={[styles.buttonText, wayTrixService === 'Excellent' ? styles.excellentButtonText : styles.buttonText]}
    >Excellent</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.goodRatingButton, wayTrixService === 'Good' ? styles.goodButton : styles.goodRatingButton]}
    onPress={() => handleQualitySelection('Good', setWayTrixService)}
  >
    <Text style={[styles.buttonText, wayTrixService === 'Good' ? styles.goodButtonText : styles.buttonText]}
    >Good</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.averageRatingButton, wayTrixService === 'Average' ? styles.averageButton : styles.averageRatingButton]}
    onPress={() => handleQualitySelection('Average', setWayTrixService)}
  >
    <Text style={[styles.buttonText, wayTrixService === 'Average' ? styles.averageButtonText : styles.buttonText]}
    >Average</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.poorRatingButton, wayTrixService === 'Poor' ? styles.poorButton : styles.poorRatingButton]}
    onPress={() => handleQualitySelection('Poor', setWayTrixService)}
  >
    <Text style={[styles.buttonText, wayTrixService === 'Poor' ? styles.poorButtonText : styles.buttonText]}
    >Poor</Text>
  </TouchableOpacity>
</View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.label}>ADDITIONAL COMMENTS:</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setAdditionalComments}
          value={additionalComments}
          placeholder="ENTER YOUR COMMENTS HERE"
          placeholderTextColor="#fff" 
          multiline
        />
      </View>
      <AnimatedModal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
          <Text style={styles.modalText}>Survey submitted successfully,</Text>
          <Text style={styles.modalText}>Thanks for your review</Text>

          
        </Animated.View>
      </View>
    </AnimatedModal>
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#757575', // Background color changed to black
  },
  questionContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white', // Text color changed to white
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  modalContent: {
    backgroundColor: 'black',
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  textInput: {
    backgroundColor: 'black', // Darker background for input
    borderWidth: 4,
    borderColor: '#5c5c5c',
    fontWeight: 'bold',
    borderRadius: 4,
    padding: 10,
    color: 'white', // Text color inside inputs changed to white
    minHeight: 40,
  },
  submitButton: {
    backgroundColor: 'black', // Darker button background
    borderWidth: 4,
    borderColor: '#5c5c5c',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 60, // FOR FOOTER
  },
  submitButtonText: {
    color: '#157f44',
    fontWeight: 'bold',
    textTransform: 'uppercase', // Force text to uppercase
  },

  ratingButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 4,
    backgroundColor: 'black',
    borderColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase', // Force text to uppercase
  },

  excellentButtonText: {
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'uppercase', // Force text to uppercase
  },
  goodButtonText: {
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'uppercase', // Force text to uppercase
  },
  averageButtonText: {
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'uppercase', // Force text to uppercase
  },
  poorButtonText: {
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'uppercase', // Force text to uppercase
  },

  excellentRatingButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 4,
    backgroundColor: 'black',
    borderColor: '#76ff78',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goodRatingButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 4,
    backgroundColor: 'black',
    borderColor: '#daff9e',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  averageRatingButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 4,
    backgroundColor: 'black',
    borderColor: '#ffe3aa',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poorRatingButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 4,
    backgroundColor: 'black',
    borderColor: '#ff8a8a',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  defaultButton: {
    backgroundColor: 'black', // Default background color for unselected buttons
    borderColor: '#fff',
  },
  
  excellentButton: {
    backgroundColor: '#76ff78', // Background color for Excellent
    borderColor: '#000',
    color: '#fff',
  },
  
  goodButton: {
    backgroundColor: '#daff9e', // Background color for Good
    borderColor: '#000',
  },
  
  averageButton: {
    backgroundColor: '#ffe3aa', // Background color for Average
    borderColor: '#000',
  },
  
  poorButton: {
    backgroundColor: '#ff8a8a', // Background color for Poor
    borderColor: '#000',
  },
  
});


export default SurveyScreen;
