import React, { useState, useEffect, useRef } from 'react';
import images from '../assets/images';
import profile from '../Pages/profile/profile'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Image } from 'react-native';
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentOptions, useDrawerStatus } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';


const CustomHeader = ({ username }) => {
        const navigation = useNavigation();
  return (

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('profile')}>
            <View style={styles.userContainer}>
                <Image source={images.profileLogo} style={styles.userIcon} />
                <Text style={styles.username}>{username}</Text>
                <Image source={images.chevronRight} style={styles.chevronIcon} />
            </View>
        </TouchableOpacity>


        <View style={styles.logoContainer}>
        <Image source={images.logo} style={styles.logo} />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
      },

      headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        // top: '-6%',
        zIndex: 1000,
        // marginTop: 10

      },
      // emptySpace: {
      //   width: 10, // Adjust width equal to the user icon width for balance, if necessary
      // },
      logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 180,
      },
      logo: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
        marginLeft: 50,
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
      },
      chevronIcon: {
        width: 10,
        height: 10,
        marginLeft: 5,
        resizeMode: 'contain',
        marginTop: 2,
      },
});

export default CustomHeader;
