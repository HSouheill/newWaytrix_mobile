import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ipAddress from '../config';

const GetRestoId = () => {
  useEffect(() => {
    const fetchRestoId = async () => {
      try {
        const tableId = await AsyncStorage.getItem('tableId');
        if (tableId) {
          const apiUrl = `${ipAddress}/api/ButtonsRoutes/get_resto_id_from_table_id`;
          const response = await axios.post(apiUrl, {
            tableId: tableId
          });
          const { restoId } = response.data;
          await AsyncStorage.setItem('restoId', restoId);
        }
      } catch (error) {
        console.error('Error fetching or storing data:', error);
      }
    };

    fetchRestoId();
    const interval = setInterval(fetchRestoId, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <View>
    </View>
  );
};

export default GetRestoId;
