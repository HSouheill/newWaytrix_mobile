import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import VouchersPage from './Vouchers'
import ipAddress from '../../../config';
const RedeemYourPoints = () => {
  const [totalPoints, setTotalPoints] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPoints = async () => {
    try {
      const customerToken = await AsyncStorage.getItem('customerToken');
      const customerId = await AsyncStorage.getItem('customerId');
      if (customerToken && customerId) {
        const headers = {
          Authorization: customerToken,
        };
        const response = await axios.post(`${ipAddress}/api/ContactUsRoutes/getTotalPoints`, { customerId }, { headers });
        if (response.data && response.data.length > 0) {
          setTotalPoints(response.data[0].points);
        } else {
          setTotalPoints(0);
        }
      }
    } catch (error) {
      console.error('Error fetching points:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchPoints(); // Initial fetch
    const intervalId = setInterval(fetchPoints, 3000); // Fetch every 3 seconds

    return () => {
      clearInterval(intervalId); // Cleanup
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Redeem Your Points</Text> */}
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>Your Total Balance:</Text>
          <View style={styles.pointsBox}>
            <Text style={styles.pointsText}>{totalPoints}</Text>
          </View>
        </View>
      )}

<VouchersPage/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 20,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  pointsLabel: {
    fontSize: 18,
    color: '#ffffff',
    marginRight: 10,
  },
  pointsBox: {
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderColor: '#ffffff',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  pointsText: {
    fontSize: 18,
    color: '#ffffff',
  },
});

export default RedeemYourPoints;
