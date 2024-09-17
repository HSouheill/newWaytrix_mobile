import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Linking, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import ipAddress from '../../config';

const MenuScreen = () => {
  const [tableId, setTableId] = useState('');
  const [imageLink, setImageLink] = useState('');
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const scale = useSharedValue(1);

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

  const fetchMenuImage = async () => {
    try {
      if (!tableId) return; // Don't fetch if tableId is empty
      
      // Retrieve tableToken from AsyncStorage
      const tableToken = await AsyncStorage.getItem('tableToken');
  
      const response = await fetch(`${ipAddress}/api/ButtonsRoutes/SearchMenuByTableId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': tableToken ? `${tableToken}` : '',
        },
        body: JSON.stringify({
          tableId,
        }),
      });
  
      const data = await response.json();
      if (data.imageLink) {
        setImageLink(data.imageLink);
      }
    } catch (error) {
      console.error('Failed to fetch menu image:', error);
    }
  };
  

  useEffect(() => {
    fetchTableId();
  }, []);

  useEffect(() => {
    if (tableId) {
      fetchMenuImage();
      const interval = setInterval(fetchMenuImage, 10000); // Fetch menu image every 10 seconds
      return () => clearInterval(interval);
    }
  }, [tableId]);

  const handleOpenLink = () => {
    if (imageLink) {
      Linking.openURL(imageLink);
    }
  };

  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      scale.value = ctx.startScale * event.scale;
    },
    onEnd: () => {
      scale.value = withSpring(1);
    },
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      {imageLink ? (
        <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
          <Animated.Image
            source={{ uri: imageLink }}
            style={[styles.image, imageStyle]}
            resizeMode="contain"
          />
        </PinchGestureHandler>
      ) : (
        <Text style={styles.text}>No menu image available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  text: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default MenuScreen;
