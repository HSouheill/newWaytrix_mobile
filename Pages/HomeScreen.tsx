import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Video } from 'expo-av';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetRestoId from './GetRestoId';
//import LocalImage from '../Pages/waytrix.png'; // Import the local image
import ipAddress from '../config';
import { LinearGradient } from 'expo-linear-gradient';


export default function HomeScreen({ navigation }) {
  const [mediaURL, setMediaURL] = React.useState(null);
  const [isVideo, setIsVideo] = React.useState(false);
  const videoRef = React.useRef(null);
  const [showHeader, setShowHeader] = React.useState(false);

  useEffect(() => {
    const deleteCanRedeem = async () => {
      console.log("deleteeeeeeeeeedddddddddddddddddddddddddddddddddddd");
      try {
        await AsyncStorage.removeItem('canRedeem');
        console.log('canRedeem deleted from AsyncStorage');
      } catch (error) {
        console.error('Error deleting canRedeem from AsyncStorage:', error);
      }
    };
    deleteCanRedeem();
  }, []);

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: showHeader,
    });
  }, [navigation, showHeader]);

  // In HomeScreen.tsx, modify your fetchMedia function to properly handle the video URL
const fetchMedia = async () => {
  try {
    const tableId = await AsyncStorage.getItem('tableId');
    const tableToken = await AsyncStorage.getItem('tableToken');
    
    const response = await axios.post(
      `${ipAddress}/api/VideoRoutes/GetOneVideo`,  // Make sure this matches your route
      { tableId: tableId },
      { headers: { Authorization: tableToken } }
    );
    
    // Log the full response to debug
    console.log("Media response:", JSON.stringify(response.data));
    
    const url = response.data.videoURL;
    
    if (!url) {
      console.log("No media URL received");
      setIsVideo(false);
      setMediaURL(require('../assets/newlogo_waytrix.png'));
      setTimeout(fetchMedia, 10000);
      return;
    }
    
    // Make sure URL is properly formatted
    const formattedUrl = url.startsWith('http') ? url : `${ipAddress}${url.startsWith('/') ? '' : '/'}${url}`;
    console.log("Formatted URL:", formattedUrl);
    
    if (formattedUrl.endsWith('.mp4')) {
      setIsVideo(true);
      setMediaURL(formattedUrl);
      if (videoRef.current) {
        videoRef.current.setStatusAsync({ shouldPlay: true, positionMillis: 0 });
      }
    } else {
      setIsVideo(false);
      setMediaURL(formattedUrl);
      setTimeout(fetchMedia, 10000);
    }
  } catch (error) {
    console.error('Error fetching media:', error.message, error?.response?.data);
    setIsVideo(false);
    setMediaURL(require('../assets/newlogo_waytrix.png'));
    setTimeout(fetchMedia, 10000);
  }
};

  React.useEffect(() => {
    fetchMedia();
  }, []);

  React.useEffect(() => {
    if (showHeader) {
      const timeout = setTimeout(() => {
        setShowHeader(false);
      }, 10000); // 10 seconds

      return () => clearTimeout(timeout);
    }
  }, [showHeader]);

  // Improve the playback status handler
  const handlePlaybackStatusUpdate = async (playbackStatus) => {
    console.log("Playback status:", JSON.stringify(playbackStatus));
    
    if (playbackStatus.error) {
      console.error("Playback error:", playbackStatus.error);
      Alert.alert('Video Playback Error', 'Could not play the video. Trying another media.');
      fetchMedia();
      return;
    }
    
    if (playbackStatus.didJustFinish) {
      console.log("Video finished, fetching new media");
      fetchMedia();
    }
  };

  const toggleHeaderVisibility = () => {
    setShowHeader(!showHeader);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3F63CB', '#003266', '#000000']}
        locations={[0, 0.4895, 0.9789]}
        style={styles.backgroundGradient}
      />
      <TouchableOpacity activeOpacity={1} onPress={toggleHeaderVisibility} style={styles.contentContainer}>
        <GetRestoId />
        {mediaURL && isVideo ? (
          <Video
            ref={videoRef}
            source={{ uri: mediaURL }}
            rate={1.0}
            volume={1.0}
            isMuted={true}
            shouldPlay
            resizeMode="cover"
            isLooping={false}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            style={styles.video}
          />
        ) : (
          mediaURL && <Image source={typeof mediaURL === 'string' ? { uri: mediaURL } : mediaURL} style={styles.image} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    
  },
});
