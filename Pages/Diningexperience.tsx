import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
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

  const fetchMedia = async () => {
    try {
      const tableId = await AsyncStorage.getItem('tableId');
      const tableToken = await AsyncStorage.getItem('tableToken');
      console.log(tableId);
      console.log(tableToken);
      const response = await axios.post(
        `${ipAddress}/api/VideoRoutes/GetOneVideo`,
        { tableId: tableId },
        { headers: { Authorization: tableToken } }
      );
      const url = response.data.videoURL;
      // console.log(response.data.videoURL);
      // console.log(JSON.stringify(response))
      //the video creates entries in the database according to every table and plays them differently on
      //different tables

      if (url.endsWith('.mp4')) {
        setIsVideo(true);
        setMediaURL(url);
        if (videoRef.current) {
          videoRef.current.setStatusAsync({ shouldPlay: true, positionMillis: 0 });
        }
      } else if (url) {
        setIsVideo(false);
        setMediaURL(url);
        setTimeout(fetchMedia, 10000); // Fetch new media after 10 seconds if it's an image
      } else {
        // No media URL received, display the local image
        setIsVideo(false);
        setMediaURL(require('../Pages/waytrix.png'));//setMediaURL(LocalImage);
        setTimeout(fetchMedia, 10000); // Fetch new media after 10 seconds
      }
    } catch (error) {
      //console.error('Error fetching media:', error);
      // In case of an error, display the local image
      //this error appears also when the video for current table has been deleted from the DB
      setIsVideo(false);
      setMediaURL(require('../Pages/waytrix.png'));//setMediaURL(LocalImage);
      setTimeout(fetchMedia, 10000); // Retry fetching new media after 10 seconds
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

  const handlePlaybackStatusUpdate = async (playbackStatus) => {
    if (playbackStatus.didJustFinish) {
      fetchMedia();
    }
  };

  const toggleHeaderVisibility = () => {
    setShowHeader(!showHeader);
  };

  return (
        <LinearGradient
        colors={['#3F63CB', '#003266', '#000000']}
        locations={[0, 0.4895, 0.9789]}
        style={styles.container}
      >
    <TouchableOpacity activeOpacity={1} onPress={toggleHeaderVisibility} style={styles.container}>
      <GetRestoId />
      {mediaURL && isVideo ? (
        <Video
          ref={videoRef}
          source={{ uri: mediaURL }}
          rate={1.0}
          volume={1.0}
          isMuted={true}

          // resizeMode="cover"
          shouldPlay
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          style={styles.video}
        />
      ) : (
        mediaURL && <Image source={typeof mediaURL === 'string' ? { uri: mediaURL } : mediaURL} style={styles.image} />
      )}
    </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40, // FOR FOOTER
    // backgroundColor: 'rgba(113, 176, 58, 0.5)', // Semi-transparent background
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
    resizeMode: 'cover',
  },
});
