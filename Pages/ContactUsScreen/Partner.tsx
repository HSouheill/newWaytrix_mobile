import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipAddress from '../../config';

const Partner = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('tableToken').then(token => {
        axios.get(`${ipAddress}/api/ContactUsRoutes/GetAllPartners`, {
            headers: {
                Authorization: token
            }
        })
        .then(response => {
            setPartners(response.data);
        })
        .catch(error => {
            console.error('Error fetching partners:', error);
        });
    });
}, []);


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
    borderColor: '#fff',
    borderWidth: 4,
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
    backgroundColor: '#333333',
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 4,
    shadowColor: '#fff',
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
    color: '#b8b8b8',
    marginBottom: 5,
  },
  description: {
    color: '#b8b8b8',
  },
});

export default Partner;
