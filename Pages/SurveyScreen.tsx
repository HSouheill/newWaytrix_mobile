import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button,Modal, StyleSheet,Animated, ScrollView, TouchableOpacity, TextInput,  Alert, TouchableWithoutFeedback, Image, KeyboardAvoidingView, Platform  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ipAddress from '../config';
import { LinearGradient } from 'expo-linear-gradient';


const AnimatedRatingButton = ({ 
  label, 
  isSelected, 
  onPress, 
  gifSource, 
  staticImageSource,
  buttonStyle, 
  selectedStyle,
  textStyle, 
  isPlaying
}) => {
  return (
    <TouchableOpacity
      style={[buttonStyle, isSelected ? selectedStyle : null]}
      onPress={onPress}
    >
      <Image 
        key={isPlaying ? 'playing' : 'static'}
        source={isPlaying ? gifSource : staticImageSource}
        style={styles.emojiicon}
        resizeMode="contain"
      />
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};


const AnimatedModal = Animated.createAnimatedComponent(Modal);
const Diningexperience = ({ navigation }) => {
  const [name, setName] = useState('');
  // const [firstname, setfirstName] = useState('');
  const [lastname, setlastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
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
  const [playingButton, setPlayingButton] = useState(null);
  const [playingFoodQuality, setPlayingFoodQuality] = useState(null);
const [playingServiceQuality, setPlayingServiceQuality] = useState(null);
const [playingStaffFriendliness, setPlayingStaffFriendliness] = useState(null);
const [playingValueForMoney, setPlayingValueForMoney] = useState(null);
const [playingRestaurantCleanliness, setPlayingRestaurantCleanliness] = useState(null);
const [playingRestaurantDesign, setPlayingRestaurantDesign] = useState(null);
const [playingWayTrixService, setPlayingWayTrixService] = useState(null);


  useEffect(() => {
    AsyncStorage.getItem('tableId').then(value => {
      setTableId(value);
    });
  }, []);
  useEffect(() => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 50000,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 50000,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);
  
  const handleQualitySelection = (quality, setter, category) => {
    setter(quality);
    // setPlayingButton(quality); 
    if (category === 'food') {
      setPlayingFoodQuality(quality); // Set playing state for food quality
    } else if (category === 'service') {
      setPlayingServiceQuality(quality); // Set playing state for service quality
    }
    else if (category === 'staff') {
      setPlayingStaffFriendliness(quality); // Set playing state for staff friendliness
    }
    else if (category === 'value') {
      setPlayingValueForMoney(quality); // Set playing state for value for money
    }
    else if (category === 'cleanliness') {
      setPlayingRestaurantCleanliness(quality); // Set playing state for restaurant cleanliness
    }
    else if (category === 'design') {
      setPlayingRestaurantDesign(quality); // Set playing state for restaurant design
    }
    else if (category === 'waytrix') {
      setPlayingWayTrixService(quality); // Set playing state for waytrix service
    }

  };

  const buttonConfig = {
    excellent: {
      gif: require('../assets/gif/excellent_anim.gif'),
      static: require('../assets/gif/excellent.png'),
    },
    good: {
      gif: require('../assets/gif/good_anim.gif'),
      static: require('../assets/gif/good.png'),
    },
    average: {
      gif: require('../assets/gif/average_anim.gif'),
      static: require('../assets/gif/average.png'),
    },
    poor: {
      gif: require('../assets/gif/sad_anim.gif'),
      static: require('../assets/gif/poor.png'),
    },
  };


  const handleSubmit = async () => {

    if (!name || !lastname || !email || !phone || !foodQuality || !serviceQuality || 
      !staffFriendliness || !valueForMoney || !restaurantCleanliness || 
      !restaurantDesign || !wayTrixService || !additionalComments || !tableId) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert('Error', 'Please enter a valid email address');
    return;
  }

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
        lastname,
        email,
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
        setlastName('');
        setEmail('');
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
    <LinearGradient
          colors={['#3F63CB', '#003266', '#000000']}
          style={styles.gradientContainer}
        >
          {/* <View style={styles.headerContainer}> */}
            <Image source={require('../assets/newlogo_waytrix.png')} style={styles.logo} />
          {/* </View> */}


    <ScrollView contentContainerStyle={styles.container}>
          <TouchableWithoutFeedback>
          <View style={styles.content}>
          <Text style={styles.title}>Survey Name</Text>

      <Text style={styles.sectionTitle}>Personal Info</Text>
      <View style={styles.nameContainer}>
                <View style={styles.nameInput}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                  style={styles.textInput}
                  onChangeText={setName}
                  value={name}
                  placeholder="Write Here"
                  placeholderTextColor="#ccc" 
                />
              </View>
                <View style={styles.nameInput}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={setlastName}
                    value={lastname}
                    placeholder="Write Here"
                    placeholderTextColor="#ccc" 
                  />
                </View>
              </View>

       <View style={styles.questionContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setEmail}
          value={email}
          placeholder="Write Here"
          placeholderTextColor="#ccc" 
        />
        </View>
        
      <View style={styles.questionContainer}>
      <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setPhone}
          value={phone}
          placeholder="Write Here"
          placeholderTextColor="#ccc" 
          keyboardType="phone-pad"
        />
      </View>

        
     

      <Text style={[styles.sectionTitle, styles.diningExperience]} >Dining Experience</Text>
      <View style={styles.diningExperienceContainer}>
      <View style={styles.questionContainer}>
        <Text style={styles.label}>1. Quality Food</Text>
        <View style={styles.buttonContainer}>
      {Object.entries({
        Excellent: 'excellent',
        Good: 'good',
        Average: 'average',
        Poor: 'poor'
      }).map(([label, key]) => (
        <AnimatedRatingButton
          key={key}
          label={label}
          isSelected={foodQuality === label}
          onPress={() => handleQualitySelection(label, setFoodQuality, 'food')}
          gifSource={buttonConfig[key].gif}
          staticImageSource={buttonConfig[key].static}
          buttonStyle={styles[`${key}RatingButton`]}
          selectedStyle={styles[`${key}Button`]}
          textStyle={[
            styles.buttonText,
            foodQuality === label ? styles[`${key}ButtonText`] : styles.buttonText
          ]}
          isPlaying={playingFoodQuality === label}
        />
      ))}
    </View>
      </View>

      <View style={styles.questionContainer}>
      <Text style={styles.label}>2. Quality Of Service</Text>
      <View style={styles.buttonContainer}>
      {Object.entries({
        Excellent: 'excellent',
        Good: 'good',
        Average: 'average',
        Poor: 'poor'
      }).map(([label, key]) => (
        <AnimatedRatingButton
          key={key}
          label={label}
          isSelected={serviceQuality === label}
          onPress={() => handleQualitySelection(label, setServiceQuality, 'service')}
          gifSource={buttonConfig[key].gif}
          staticImageSource={buttonConfig[key].static}
          buttonStyle={styles[`${key}RatingButton`]}
          selectedStyle={styles[`${key}Button`]}
          textStyle={[
            styles.buttonText,
            serviceQuality === label ? styles[`${key}ButtonText`] : styles.buttonText
          ]}
          isPlaying={playingServiceQuality === label}
        />
      ))}
    </View>
      </View>

      <View style={styles.questionContainer}>
      <Text style={styles.label}>3. Friendliness Of Staff</Text>
      <View style={styles.buttonContainer}>
      {Object.entries({
        Excellent: 'excellent',
        Good: 'good',
        Average: 'average',
        Poor: 'poor'
      }).map(([label, key]) => (
        <AnimatedRatingButton
          key={key}
          label={label}
          isSelected={staffFriendliness === label}
          onPress={() => handleQualitySelection(label, setStaffFriendliness, 'staff')}
          gifSource={buttonConfig[key].gif}
          staticImageSource={buttonConfig[key].static}
          buttonStyle={styles[`${key}RatingButton`]}
          selectedStyle={styles[`${key}Button`]}
          textStyle={[
            styles.buttonText,
            staffFriendliness === label ? styles[`${key}ButtonText`] : styles.buttonText
          ]}
          isPlaying={playingStaffFriendliness === label}
        />
      ))}
    </View>
      </View>

      <View style={styles.questionContainer}>
      <Text style={styles.label}>4. Value Of Money</Text>
      <View style={styles.buttonContainer}>
      {Object.entries({
        Excellent: 'excellent',
        Good: 'good',
        Average: 'average',
        Poor: 'poor'
      }).map(([label, key]) => (
        <AnimatedRatingButton
          key={key}
          label={label}
          isSelected={valueForMoney === label}
          onPress={() => handleQualitySelection(label, setValueForMoney, 'value')}
          gifSource={buttonConfig[key].gif}
          staticImageSource={buttonConfig[key].static}
          buttonStyle={styles[`${key}RatingButton`]}
          selectedStyle={styles[`${key}Button`]}
          textStyle={[
            styles.buttonText,
            valueForMoney === label ? styles[`${key}ButtonText`] : styles.buttonText
          ]}
          isPlaying={playingValueForMoney === label}
        />
      ))}
    </View>
      </View>

      <View style={styles.questionContainer}>
      <Text style={styles.label}>5. Cleanliness Of Restaurant</Text>

      <View style={styles.buttonContainer}>
      {Object.entries({
        Excellent: 'excellent',
        Good: 'good',
        Average: 'average',
        Poor: 'poor'
      }).map(([label, key]) => (
        <AnimatedRatingButton
          key={key}
          label={label}
          isSelected={restaurantCleanliness === label}
          onPress={() => handleQualitySelection(label, setRestaurantCleanliness, 'cleanliness')}
          gifSource={buttonConfig[key].gif}
          staticImageSource={buttonConfig[key].static}
          buttonStyle={styles[`${key}RatingButton`]}
          selectedStyle={styles[`${key}Button`]}
          textStyle={[
            styles.buttonText,
            restaurantCleanliness === label ? styles[`${key}ButtonText`] : styles.buttonText
          ]}
          isPlaying={playingRestaurantCleanliness === label}
        />
      ))}
    </View>
      </View>

      <View style={styles.questionContainer}>
      <Text style={styles.label}>6. Restaurant Design</Text>
      <View style={styles.buttonContainer}>
      {Object.entries({
        Excellent: 'excellent',
        Good: 'good',
        Average: 'average',
        Poor: 'poor'
      }).map(([label, key]) => (
        <AnimatedRatingButton
          key={key}
          label={label}
          isSelected={restaurantDesign === label}
          onPress={() => handleQualitySelection(label, setRestaurantDesign, 'design')}
          gifSource={buttonConfig[key].gif}
          staticImageSource={buttonConfig[key].static}
          buttonStyle={styles[`${key}RatingButton`]}
          selectedStyle={styles[`${key}Button`]}
          textStyle={[
            styles.buttonText,
            restaurantDesign === label ? styles[`${key}ButtonText`] : styles.buttonText
          ]}
          isPlaying={playingRestaurantDesign === label}
        />
      ))}
    </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.label}>7. Waitrex Device Service</Text>

        <View style={styles.buttonContainer}>
      {Object.entries({
        Excellent: 'excellent',
        Good: 'good',
        Average: 'average',
        Poor: 'poor'
      }).map(([label, key]) => (
        <AnimatedRatingButton
          key={key}
          label={label}
          isSelected={ wayTrixService === label}
          onPress={() => handleQualitySelection(label, setWayTrixService, 'waytrix')}
          gifSource={buttonConfig[key].gif}
          staticImageSource={buttonConfig[key].static}
          buttonStyle={styles[`${key}RatingButton`]}
          selectedStyle={styles[`${key}Button`]}
          textStyle={[
            styles.buttonText,
            wayTrixService === label ? styles[`${key}ButtonText`] : styles.buttonText
          ]}
          isPlaying={playingWayTrixService === label}
        />
      ))}
    </View>
      </View>


      
      </View>
    
      <Text style={[styles.sectionTitle, styles.othersSection ]}>Others</Text>

      <View style={[styles.questionContainer, styles.commentsContainer]}>
        <Text style={styles.label}>1. Additional Comments</Text>
        <TextInput
          style={[styles.textInput, styles.commentsInput]}
          onChangeText={setAdditionalComments}
          value={additionalComments}
          placeholder="Write Here"
          placeholderTextColor="#ccc" 
          multiline
          textAlignVertical="top"
          
        />
      </View>

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
                                              <Text style={styles.modalText}>Thank you for completing our survey!</Text>
                                            </View>
                                            </LinearGradient>
                                          </View>
                                        </Modal>
      

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
      <LinearGradient
                      colors={['#3F63CB', '#679BFF']}
                      style={styles.button}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
        <Text style={styles.submitButtonText}>Submit</Text>
     </LinearGradient>
      </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
    </ScrollView>
    </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  emojiicon: {
    width: 20,
    height: 20,
  },
  gradientContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
    // top: '5%',
    // backgroundColor: '#757575', // Background color changed to black
  },
  logo: {
    width: 300,
    height: 90,
    alignSelf: 'center',
    resizeMode: 'contain',
    // top: '3%',
    marginTop : '5%',
    // marginBottom: '10%'
  },
  title: {
      fontSize: 24,
      color: 'white',
      textAlign: 'center',
      fontWeight: '500',
      marginTop: 20,
  },
  content: {
    flex: 1,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  nameInput: {
    flex: 1,
    gap: 20,
  },
  textInput: {
    backgroundColor: 'rgba(49, 49, 49, 0.4)',
    borderWidth: 0.8,
    borderColor: 'white',
    borderRadius: 12,
    padding: 10,
    color: 'white',
    minHeight: 50,
    width: '100%',
    // resizeMode: 'contain',
  },
  questionContainer: {
    // marginBottom: 10,
    gap: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white', // Text color changed to white
  },
  modalContainer: {
    borderRadius: 10,
    width: '90%',
  },
  modalText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContent: {
    borderRadius: 20,
    padding: 10,
    width: '100%',
    maxWidth: 350,
    height: 130,
    alignItems: 'center',
    margin: 0,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 10,
    width: '100%',
  },
  // textInput: {
  //   backgroundColor: 'black', // Darker background for input
  //   borderWidth: 4,
  //   borderColor: '#5c5c5c',
  //   fontWeight: 'bold',
  //   borderRadius: 4,
  //   padding: 10,
  //   color: 'white', // Text color inside inputs changed to white
  //   minHeight: 40,
  // },
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
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Ensure that the gradient follows this border radius
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
    fontWeight: '400',
    // textTransform: 'uppercase', // Force text to uppercase
  },

  excellentButtonText: {
    color: '#fff',
    fontWeight: '400',
    // textTransform: 'uppercase', // Force text to uppercase
  },
  goodButtonText: {
    color: '#fff',
    fontWeight: '400',
    // textTransform: 'uppercase', // Force text to uppercase
  },
  averageButtonText: {
    color: '#fff',
    fontWeight: '400',
    // textTransform: 'uppercase', // Force text to uppercase
  },
  poorButtonText: {
    color: '#fff',
    fontWeight: '400',
    // textTransform: 'uppercase', // Force text to uppercase
  },

  excellentRatingButton: {
    flexDirection: 'row',
    gap: 5,
    // justifyContent: 'center',
    paddingVertical: 10,
    // paddingHorizontal: 20,
    borderWidth: 2,
    backgroundColor: 'black',
    borderColor: '#A6A6A680',
    borderRadius: 5,
    // marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
  },
  goodRatingButton: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 10,
    // paddingHorizontal: 20,
    borderWidth: 2,
    backgroundColor: 'black',
    borderColor: '#A6A6A680',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,

  },
  averageRatingButton: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 10,
    // paddingHorizontal: 20,
    borderWidth: 2,
    backgroundColor: 'black',
    borderColor: '#A6A6A680',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,

  },
  poorRatingButton: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 10,
    // paddingHorizontal: 20,
    borderWidth: 2,
    backgroundColor: 'black',
    borderColor: '#A6A6A680',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,

  },

  defaultButton: {
    backgroundColor: 'black', // Default background color for unselected buttons
    borderColor: '#fff',
  },
  
  excellentButton: {
    backgroundColor: '#3F63CB', // Background color for Excellent
    borderColor: '#fff',
    color: '#fff',
    borderWidth: 1,
  },
  
  goodButton: {
    backgroundColor: '#3F63CB', // Background color for Good
    borderColor: '#fff',
    borderWidth: 1,

  },
  
  averageButton: {
    backgroundColor: '#3F63CB', // Background color for Average
    borderColor: '#fff',
    borderWidth: 1,

  },
  
  poorButton: {
    backgroundColor: '#3F63CB', // Background color for Poor
    borderColor: '#fff',
    borderWidth: 1,
  },
  diningExperience: {
    marginTop: 30,
  },
  othersSection: {
    marginTop: 30,
  },
  diningExperienceContainer: {
    padding: 10,
    gap:20,
  },
  commentsContainer: {
    padding: 10,
  },
  commentsInput: {
    height: 120,
    paddingStart: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
});


export default Diningexperience;
