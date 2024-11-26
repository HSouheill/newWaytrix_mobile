import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipAddress from '../../config';

const Partner = () => {
  const [partners, setPartners] = useState([]);


    const fetchPartners = async () => {
      try {
        // Get restoId and token from AsyncStorage
        const restoId = await AsyncStorage.getItem('restoId');
        const token = await AsyncStorage.getItem('tableToken');

        if (restoId && token) {
          // Make a POST request to fetch partners by restoId
          const response = await axios.post(
            `${ipAddress}/api/ContactUsRoutes/getPartnersByRestoId`,
            { restoId }, // Pass restoId in the request body
            {
              headers: {
                Authorization: token, // Include token in headers
              },
            }
          );
          setPartners(response.data); // Update the state with fetched partners
        } else {
          console.error('restoId or token not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };

    useEffect(() => {
      // Fetch partners initially
      fetchPartners();
  
      // Set an interval to fetch partners every 10 seconds
      const intervalId = setInterval(fetchPartners, 10000); // 10000ms = 10 seconds
  
      // Cleanup the interval on component unmount
      return () => clearInterval(intervalId);
    }, []); // Empty dependency array means this effect runs only once when the component mounts


  return (
    <View style={styles.container}>
      <Text style={styles.title}>OUR PARTNERS</Text>
      <ScrollView>
        {partners.map((partner, index) => (
          <TouchableOpacity activeOpacity={1} key={index} style={styles.partnerContainer}>
            <Image source={{ uri: partner.logo }} style={styles.logo} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{partner.name}</Text>
              <Text style={styles.phone}>{partner.phone}</Text>
              <Text style={styles.description}>{partner.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    borderColor: '#5c5c5c',
    borderWidth: 4,
    marginBottom: 60, // FOR FOOTER
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  partnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    borderColor: '#5c5c5c',
    borderWidth: 4,
   // shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  phone: {
    color: '#fff',
    marginBottom: 5,
  },
  description: {
    color: '#fff',
  },
});

export default Partner;
