import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ipAddress from '../../config';
import * as Progress from 'react-native-progress';

interface TimerCarProps {
  showTimer: boolean; // Prop to control the visibility of the timer
}

const TimerCar: React.FC<TimerCarProps> = ({ showTimer }) => {
  const [timer, setTimer] = useState<number>(0); // Timer value in seconds
  const [isVisible, setIsVisible] = useState(false);
  const [totalTime, setTotalTime] = useState<number>(0); // Store the total time for progress calculation

  const backendURL = `${ipAddress}/api/ButtonsRoutes/checkAndActivateCar`;

  useEffect(() => {
    const interval = setInterval(() => {
      checkAndFetchTimer();
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setIsVisible(false); // Hide the component when the timer ends
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer]);

  const checkAndFetchTimer = async () => {
    try {
      // Retrieve ticketNum from AsyncStorage
      const ticketNum = await AsyncStorage.getItem('ticketNum');
      if (!ticketNum) {
        return; // Do nothing if ticketNum does not exist
      }

      // Make a POST request with ticketNum
      const response = await axios.post(backendURL, { ticketNum });
      const { timeNum } = response.data;

      if (typeof timeNum === 'number' && timeNum > 0) {
        const timeInSeconds = timeNum * 60; // Convert to seconds
        setTimer(timeInSeconds);
        setTotalTime(timeInSeconds); // Set the total time for progress bar calculation
        setIsVisible(true); // Show the component only when a valid timeNum is returned
      }
    } catch (error) {
     // console.error('Error fetching timer:', error);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible || !showTimer) {
    return null; // Don't render the component if it's not visible or showTimer is false
  }

  const progress = totalTime > 0 ? timer / totalTime : 0; // Calculate progress as a fraction

  return (
    <View style={styles.popup}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Your car will be ready in:</Text>
        <Progress.Circle
          size={80}
          progress={progress}
          showsText
          formatText={() => formatTime(timer)}
          textStyle={styles.timerText}
          color="#3F63CB"
          thickness={5}
          borderWidth={2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1000,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerLabel: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  timerText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TimerCar;
