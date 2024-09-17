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
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setName}
          value={name}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.label}>Phone:</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setPhone}
          value={phone}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.label}>Quality of Food:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Excellent" onPress={() => handleQualitySelection('Excellent', setFoodQuality)} color={foodQuality === 'Excellent' ? 'green' : 'black'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setFoodQuality)} color={foodQuality === 'Good' ? '#90EE90' : 'black'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setFoodQuality)} color={foodQuality === 'Average' ? '#b5ad26' : 'black'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setFoodQuality)} color={foodQuality === 'Poor' ? 'red' : 'black'} />
        </View>
      </View>

      {/* Repeat similar structures for other questions */}
      {/* Service Quality */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>Quality of Service:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Excellent" onPress={() => handleQualitySelection('Excellent', setServiceQuality)} color={serviceQuality === 'Excellent' ? 'green' : 'black'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setServiceQuality)} color={serviceQuality === 'Good' ? '#90EE90' : 'black'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setServiceQuality)} color={serviceQuality === 'Average' ? '#b5ad26' : 'black'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setServiceQuality)} color={serviceQuality === 'Poor' ? 'red' : 'black'} />
        </View>
      </View>

      {/* Friendliness of Staff */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>Friendliness of Staff:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Excellent" onPress={() => handleQualitySelection('Excellent', setStaffFriendliness)} color={staffFriendliness === 'Excellent' ? 'green' : 'black'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setStaffFriendliness)} color={staffFriendliness === 'Good' ? '#90EE90' : 'black'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setStaffFriendliness)} color={staffFriendliness === 'Average' ? '#b5ad26' : 'black'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setStaffFriendliness)} color={staffFriendliness === 'Poor' ? 'red' : 'black'} />
        </View>
      </View>

      {/* Value for Money */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>Value for Money:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Excellent" onPress={() => handleQualitySelection('Excellent', setValueForMoney)} color={valueForMoney === 'Excellent' ? 'green' : 'black'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setValueForMoney)} color={valueForMoney === 'Good' ? '#90EE90' : 'black'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setValueForMoney)} color={valueForMoney === 'Average' ? '#b5ad26' : 'black'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setValueForMoney)} color={valueForMoney === 'Poor' ? 'red' : 'black'} />
        </View>
      </View>

      {/* Cleanliness of Restaurant */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>Cleanliness of Restaurant:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Excellent" onPress={() => handleQualitySelection('Excellent', setRestaurantCleanliness)} color={restaurantCleanliness === 'Excellent' ? 'green' : 'black'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setRestaurantCleanliness)} color={restaurantCleanliness === 'Good' ? '#90EE90' : 'black'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setRestaurantCleanliness)} color={restaurantCleanliness === 'Average' ? '#b5ad26' : 'black'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setRestaurantCleanliness)} color={restaurantCleanliness === 'Poor' ? 'red' : 'black'} />
        </View>
      </View>

      {/* Restaurant Design */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>Restaurant Design:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Excellent" onPress={() => handleQualitySelection('Excellent', setRestaurantDesign)} color={restaurantDesign === 'Excellent' ? 'green' : 'black'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setRestaurantDesign)} color={restaurantDesign === 'Good' ? '#90EE90' : 'black'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setRestaurantDesign)} color={restaurantDesign === 'Average' ? '#b5ad26' : 'black'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setRestaurantDesign)} color={restaurantDesign === 'Poor' ? 'red' : 'black'} />
        </View>
      </View>

      {/* WayTrix Device Service */}
      <View style={styles.questionContainer}>
        <Text style={styles.label}>WayTrix Device Service:</Text>
        <View style={styles.buttonContainer}>
          <Button title="Excellent" onPress={() => handleQualitySelection('Excellent', setWayTrixService)} color={wayTrixService === 'Excellent' ? 'green' : 'black'} />
          <Button title="Good" onPress={() => handleQualitySelection('Good', setWayTrixService)} color={wayTrixService === 'Good' ? '#90EE90' : 'black'} />
          <Button title="Average" onPress={() => handleQualitySelection('Average', setWayTrixService)} color={wayTrixService === 'Average' ? '#b5ad26' : 'black'} />
          <Button title="Poor" onPress={() => handleQualitySelection('Poor', setWayTrixService)} color={wayTrixService === 'Poor' ? 'red' : 'black'} />
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.label}>Additional Comments:</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setAdditionalComments}
          value={additionalComments}
          placeholder="Enter your comments here"
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
  },
  questionContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
   
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderWidth:5,
    borderColor:'black',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight:'bold',
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight:'bold',

    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    minHeight: 40, // Reduced height for inputs
  },
  submitButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


export default SurveyScreen;
