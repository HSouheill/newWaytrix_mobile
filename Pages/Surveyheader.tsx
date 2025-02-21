import React from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import images from '../assets/images';

const SurveyHeader = ({ animatedWidth }) => {
    const progressBarWidth = animatedWidth ? 
        animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%']
        }) : '33%';

    return (
        <View style={styles.headerContainer}>
            <Image source={images.logo} style={styles.logo} />
            <Text style={styles.title}>Survey Name</Text>
            <Text style={styles.oneofthree}>
                {animatedWidth ? '2' : '1'}
                <Text style={styles.ofthree}> of 3</Text>
            </Text>
            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBarWrapper, { width: progressBarWidth }]}>
                    <LinearGradient
                        colors={['#8A2BE2', '#3F63CB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.progressBar}
                    />
                </Animated.View>
                <View style={styles.progressBarBackground} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        top: 30,
        gap: 20,
        padding: 20,
        zIndex: 1000,
        height: 10,
    },
    logo: {
        width: 90,
        height: 90,
    },
    title: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
        fontWeight: '500',
    },
    oneofthree: {
        fontSize: 20,
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '900',
    },
    ofthree: {
        color: 'rgba(255, 255, 255, 0.28)',
    },
    progressBarContainer: {
        width: '100%',
        height: 10,
        backgroundColor: 'transparent',
        borderRadius: 6,
        overflow: 'hidden',
        position: 'relative',
    },
    progressBar: {
        height: '100%',
        position: 'absolute',
        left: 0,
        borderRadius: 4,
    },
    progressBarBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
    },
    progressBarWrapper: {
      height: '100%',
      position: 'absolute',
      left: 0,
      borderRadius: 4,
      overflow: 'hidden',
  },
});

export default SurveyHeader;

