import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ipAddress from '../../config';

const TimerCar = () => {
  const [initialMinutes, setInitialMinutes] = useState(0);
  const [timer, setTimer] = useState(initialMinutes * 60); // Initial timer value in seconds
  const [minutes, setMinutes] = useState(Math.floor(timer / 60));
  const [seconds, setSeconds] = useState(timer % 60);
  const [counting, setCounting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true); // Initially disable button

  const navigation = useNavigation();

  useEffect(() => {
    handleStart(); // Start countdown automatically on page load
  }, []);

  useEffect(() => {
    if (counting) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 0) {
            clearInterval(countdown);
            setCounting(false); // Stop counting
            setButtonDisabled(false); // Reactivate button
            navigation.navigate('Home'); // Navigate to Home route after timer finishes
            return 0;
          }
          const newTimer = prevTimer - 1;
          setMinutes(Math.floor(newTimer / 60));
          setSeconds(newTimer % 60);
          return newTimer;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [counting]);

  const handleStart = async () => {
    try {
      setLoading(true); // Show loader
      setButtonDisabled(true); // Disable button
      const timerId = await AsyncStorage.getItem('timerId');
      await startCountdown(timerId);
      setLoading(false); // Hide loader after countdown starts
    } catch (error) {
      console.error('Error starting countdown:', error);
      setLoading(false); // Hide loader on error
      setButtonDisabled(false); // Reactivate button on error
    }
  };

  const startCountdown = async (timerId) => {
    try {
      // Fetch tableToken from AsyncStorage
      const tableToken = await AsyncStorage.getItem('tableToken');
  
      const response = await axios.post(
        `${ipAddress}/api/ButtonsRoutes/get_count_down_valet`,
        { timerId: timerId },
        {
          headers: {
            Authorization: tableToken,
          },
        }
      );
  
      const { timer } = response.data;
      setTimer(timer * 60); // Convert minutes to seconds for timer countdown
      setCounting(true);
    } catch (error) {
      console.error('Error in initial countdown request:', error);
      await retryStart(timerId); // Retry the request
    }
  };

  const retryStart = async (timerId) => {
    while (!counting) {
      try {
        // Fetch tableToken from AsyncStorage
        const tableToken = await AsyncStorage.getItem('tableToken');
  
        const response = await axios.post(`${ipAddress}/api/ButtonsRoutes/get_count_down_valet`, {
          timerId: timerId,
        }, {
          headers: {
            Authorization: tableToken,
          },
        });
  
        const { timer } = response.data;
        setTimer(timer * 60); // Convert minutes to seconds for timer countdown
        setCounting(true);
        break; // Exit loop if successful
      } catch (error) {
        console.error('Retry failed:', error);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.timerText, { color: 'white' }]}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="white" style={styles.loader} />
      ) : (
        <Button title="Start Countdown" onPress={handleStart} disabled={counting || buttonDisabled} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  timerText: {
    fontSize: 50,
    color: 'white',
  },
  loader: {
    marginTop: 20,
  },
});

export default TimerCar;
