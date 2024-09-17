import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipAddress from '../../../../config';

const GetRestoId = () => {
  const [restoId, setRestoId] = useState('');

  const fetchRestoId = async () => {
    try {
      const valetId = await AsyncStorage.getItem('valetId');
      if (valetId) {
        const response = await axios.post(`${ipAddress}/api/ButtonsRoutes/get_resto_id_from_valet_id`, {
          valetId: valetId
        });
        const { restoId } = response.data;
        setRestoId(restoId);
        await AsyncStorage.setItem('restoId', restoId);
      } else {
        Alert.alert('Error', 'Valet ID not found in AsyncStorage');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch resto ID');
    }
  };

  useEffect(() => {
    fetchRestoId();
    const interval = setInterval(() => {
      fetchRestoId();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      {/* <Text style={{color: 'white'}}>hello</Text> */}
      {/* {restoId ? <Text style={{color: 'white'}}>Resto ID: {restoId}</Text> : null} */}
    </View>
  );
};

export default GetRestoId;
