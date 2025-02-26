import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import images from '../assets/images';
import ipAddress from '../config';

const BonusWheelHeader = ({ username }) => {
  const navigation = useNavigation();
  const [totalPoints, setTotalPoints] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchPoints = async () => {
    try {
      const customerToken = await AsyncStorage.getItem('customerToken');
      const customerId = await AsyncStorage.getItem('customerId');
      if (customerToken && customerId) {
        const headers = {
          Authorization: customerToken,
        };
        const response = await axios.post(
          `${ipAddress}/api/ContactUsRoutes/getTotalPoints`,
          { customerId },
          { headers }
        );
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
    fetchPoints();
    const intervalId = setInterval(fetchPoints, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.userContainer}>
            <Image source={images.profileLogo} style={styles.userIcon} />
            <Text style={styles.username}>
              {username ? username.charAt(0).toUpperCase() + username.slice(1) : ''}
            </Text>
            <Image source={images.chevronRight} style={styles.chevronIcon} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.centerSection}>
        <Image source={images.logo} style={styles.logo} />
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.balanceText}>Available Points: {totalPoints}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 10,
    zIndex: 1000,
    height: 90,
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  username: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 10,
    fontWeight: '600',
  },
  chevronIcon: {
    width: 10,
    height: 10,
    marginLeft: 5,
    resizeMode: 'contain',
    marginTop: 2,
  },
  balanceText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default BonusWheelHeader;