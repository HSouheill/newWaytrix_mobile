import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Linking, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import ipAddress from '../../config';
import { WebView } from 'react-native-webview';

const MenuScreen = () => {
  const [imageLink, setImageLink] = useState('');
  const [tableId, setTableId] = useState('');

  // Fetch tableId from AsyncStorage
  const fetchTableId = async () => {
    try {
      const storedTableId = await AsyncStorage.getItem('tableId');
      if (storedTableId) {
        setTableId(storedTableId);
      }
    } catch (error) {
      console.error('Failed to fetch tableId from AsyncStorage:', error);
    }
  };

  // Fetch menu image based on tableId
  const fetchMenuImage = async () => {
    try {
      if (!tableId) return; // Don't fetch if tableId is empty
      
      const tableToken = await AsyncStorage.getItem('tableToken');
  
      const response = await fetch(`${ipAddress}/api/ButtonsRoutes/SearchMenuByTableId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': tableToken ? `${tableToken}` : '',
        },
        body: JSON.stringify({ tableId }),
      });
  
      const data = await response.json();
      if (data.imageLink) {
        setImageLink(data.imageLink); // Set the imageLink to state
      }
    } catch (error) {
      console.error('Failed to fetch menu image:', error);
    }
  };

  useEffect(() => {
    fetchTableId(); // Fetch tableId when the component mounts
  }, []);

  useEffect(() => {
    if (tableId) {
      fetchMenuImage(); // Fetch menu image when tableId is available
    }
  }, [tableId]); // Re-fetch when tableId changes

  // Set up interval to check for the image link every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchMenuImage(); // Re-fetch the menu image every 10 seconds
    }, 10000); // 10 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [tableId]); // Re-run interval setup if tableId changes

  if (!imageLink) {
    return <View style={styles.container}><Text>Loading...</Text></View>; // Show loading while fetching
  }

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: imageLink }} // Use the fetched imageLink for the WebView
        style={styles.webview}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        overScrollMode="always"
        bounces={true}
        scalesPageToFit={true}
        allowsFullscreenVideo={true}
        nestedScrollEnabled={true} // Enable nested scroll
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 67 // FOR FOOTER
  },
  webview: {
    flex: 1,
  },
});

export default MenuScreen;