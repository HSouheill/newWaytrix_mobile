import React, { useState, useEffect } from 'react';
import images from '../assets/images';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomHeader = ({ username }) => {
  const navigation = useNavigation();
  const [verified, setVerified] = useState(false);
  
  useEffect(() => {
    // Fetch verification status
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsed = JSON.parse(userData);
          setVerified(parsed.isVerified);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}> 
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={images.back} style={styles.back}></Image>
        </TouchableOpacity>
      </View>

      <View style={styles.centerSection}>
        <Image source={images.logo} style={styles.logo} />
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.userContainer}>
            <Image source={images.profileLogo} style={styles.userIcon} />
            <View style={styles.userInfoContainer}>
              <Text style={styles.username}>
                {username ? username.charAt(0).toUpperCase() + username.slice(1) : ''}
              </Text>
              <Text style={[styles.verificationStatus, verified ? styles.verifiedText : styles.notVerifiedText]}>
                {verified ? 'Verified' : 'Not Verified'}
              </Text>
            </View>
            <Image source={images.chevronRight} style={styles.chevronIcon} />
          </View>
        </TouchableOpacity>
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
    alignItems: 'center',
    top: '7%'
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
  userInfoContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  username: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  verificationStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  verifiedText: {
    color: '#4ADE80', // Green color for verified
  },
  notVerifiedText: {
    color: '#FF4A4A', // Red color for not verified
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
  back: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default CustomHeader;