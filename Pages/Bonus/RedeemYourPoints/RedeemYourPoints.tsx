import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, Platform, StatusBar, TouchableWithoutFeedback, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Vouchers from './Vouchers';
import ipAddress from '../../../config';
import { LinearGradient } from 'expo-linear-gradient';
import CustomHeader from '../../../layout/CustomHeader';
import BonusScreen from '../BonusScreen';
import { useNavigation } from '@react-navigation/native';


const RedeemYourPoints = () => {
  const [totalPoints, setTotalPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const navigation = useNavigation();
  


  useEffect(() => {
    const fetchCustomerData = async () => {
      const customerToken = await AsyncStorage.getItem("customerToken");
      const customerId = await AsyncStorage.getItem("customerId");

      if (customerToken && customerId) {
        try {
          const response = await axios.post(
            `${ipAddress}/api/ContactUsRoutes/getCustomerSpinDate`,
            { customerId },
            {
              headers: { authorization: `${customerToken}` },
            }
          );

          if (response.status === 200) {
            setCustomerName(response.data.name);
            console.log("Customer Name:", response.data.name);
          }
        } catch (error) {
          console.error("Failed to fetch customer data", error);
        }
      }
    };

    // Fetch once immediately on mount
    fetchCustomerData();
    // Set up polling every 5 seconds
 const intervalId = setInterval(fetchCustomerData, 5000);
 return () => {
   clearInterval(intervalId);
   // eventSource.close();
 };
}, []);



  const fetchPoints = async () => {
    try {
      const customerToken = await AsyncStorage.getItem('customerToken');
      const customerId = await AsyncStorage.getItem('customerId');
      if (customerToken && customerId) {
        const headers = { Authorization: customerToken };
        const response = await axios.post(
          `${ipAddress}/api/ContactUsRoutes/getTotalPoints`,
          { customerId },
          { headers }
        );
        setTotalPoints(response.data?.[0]?.points ?? 0);
        setCustomerName(response.data.name);

      }
    } catch (error) {
      console.error('Error fetching points:', error);
      setTotalPoints(0);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchPoints();
    const intervalId = setInterval(fetchPoints, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const navigateToBonus = () => {
    navigation.navigate('BonusScreen');
  };

  return (
     <TouchableWithoutFeedback>
    <SafeAreaView style={styles.safeArea}>
    <LinearGradient
      colors={['#3F63CB', '#003266', '#000000']}
      style={styles.gradient}
    >

      <View style={styles.top}>
      <CustomHeader username={customerName} />
      <View style={styles.content}>
        

        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <View style={styles.header}>
            <Text style={styles.title}>Redeem Points</Text>
            <View style={styles.pointsBox}>
              <Text style={styles.pointsText}>{totalPoints} Points Available</Text>
            </View>
          </View>
        )}
              <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        <Vouchers />
        {/* <TouchableOpacity onPress={navigateToBonus} style={styles.submitButton}>
                 <LinearGradient
                                 colors={['#3F63CB', '#679BFF']}
                                 style={styles.backbutton}
                                 start={{ x: 0, y: 0 }}
                                 end={{ x: 1, y: 0 }}
                               >
                   <Text style={styles.submitButtonText}>Back</Text>
                </LinearGradient>
                 </TouchableOpacity> */}
      </ScrollView>
      </View>
      </View>

    </LinearGradient>
  </SafeAreaView>
   </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginBottom: 50,
  },
  content: {
    flex: 1,
    top: "12%",
    // paddingHorizontal: 16,
  },
  top:{
    flex: 1,
    padding: 10,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    // padding: 10,
    marginBottom: 100,
  },
  header: {
    // marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  pointsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  pointsText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  submitButton: {
    width: 200,
    height: 53,
    borderRadius: 10,
    overflow: 'hidden', // Ensures the gradient does not spill outside the border radius
    marginBottom: 100,
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backbutton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Ensure that the gradient follows this border radius
  },
});

export default RedeemYourPoints;