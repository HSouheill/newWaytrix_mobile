import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, Text, TouchableOpacity, Animated, View, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Wheel from "./components/Wheel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SCREEN_WIDTH } from "./constants/screen";
import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import WalletView from "./components/WalletView";
import { useNavigation } from "@react-navigation/native";
import ipAddress from "../../config";
import BonusWheelHeader from '../../layout/BonusWheelHeader'
import PointsModal from './PointsModal'; 




const segments = ["1 ", "9 ", "6 ", "2", "10 ", "4 "];
const initialBalance = 1.7;

const BonusScreen = () => {
  const insets = useSafeAreaInsets();
  const labelOpacity = useSharedValue(0);
  const [walletBalance, setWalletBalance] = useState(initialBalance.toString());
  const amount = useSharedValue(initialBalance);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [wonPoints, setWonPoints] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
   // State to store customer data
   const [customerName, setCustomerName] = useState("");
   const [lastTimeSpinned, setLastTimeSpinned] = useState("");
   
   // Fetch customer data
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
             setLastTimeSpinned(response.data.lastTimeSpinned);
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

  // Optional: Add a WebSocket/SSE connection here for real-time updates
  // const eventSource = new EventSource(`${ipAddress}/your-sse-endpoint`);
  // eventSource.onmessage = (event) => {
  //   const data = JSON.parse(event.data);
  //   setCustomerName(data.name);
  //   setLastTimeSpinned(data.lastTimeSpinned);
  // };

  // Clean up on component unmount
  return () => {
    clearInterval(intervalId);
    // eventSource.close();
  };
}, []);


  const handleWheelEnd = async (value: number) => {
    setWalletBalance(value.toString());
    labelOpacity.value = withTiming(1, { duration: 800 });
    amount.value = withTiming(value * initialBalance, {
      duration: 800,
    });

    try {
      const customerToken = await AsyncStorage.getItem("customerToken");
      const restoId = await AsyncStorage.getItem("restoId");
      if (customerToken) {
        const response = await axios.post(
          `${ipAddress}/api/ContactUsRoutes/AddPoints`,
          { points: value, restoId: restoId },
          {
            headers: {
              authorization: `${customerToken}`,
            },
          }
        );
        if (response.status === 200) {
          setWonPoints(value);
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
          }, 5000);
        }
      } 
    } catch (error) {
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 8000);
    }
  };

  const handleOnSpin = () => {
    amount.value = initialBalance; // Set back to initial value
    setWalletBalance(initialBalance.toString());
    labelOpacity.value = 0;
  };

  const deleteCustomerToken = async () => {
    try {
      await AsyncStorage.removeItem('customerToken');
      await AsyncStorage.removeItem('valetToken');
      console.log('Customer token removed');
    } catch (error) {
      console.error('Error removing customer token:', error);
    }
  };

  const amountText = useAnimatedStyle(() => {
    return {
      opacity: labelOpacity.value,
      transform: [{ scale: labelOpacity.value }],
    };
  });

  return (
    // <LinearGradient
    //   style={[styles.container, { paddingTop: insets.top }]}
    //   colors={["#fff", "#312e2e"]}
    // >
      <ImageBackground source={require('../../assets/Sparkles_Image.png')} style={styles.backgroundContainer}>

     <View style={styles.container}>
     <BonusWheelHeader username={customerName}/>
      {/* Greeting Text */}
      <Text style={styles.greetingText}>
        Hello {customerName ? customerName.charAt(0).toUpperCase() + customerName.slice(1) : ''}, you have {lastTimeSpinned} spin available
      </Text>

      <Text style={styles.title}>Spin and Win!</Text>
      {/* Wheel Component */}
      <Wheel segments={segments} onEnd={handleWheelEnd} onSpin={handleOnSpin}  />

       {/* <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("RedeemPage")}
            >
            <LinearGradient
              colors={['#3F63CB', '#679BFF']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.homeButtonText}>Redeem Your Points</Text>
            </LinearGradient>
          </TouchableOpacity> */}
          <TouchableOpacity >
                          <LinearGradient
                          colors={['#3F63CB', '#679BFF']}
                          style={styles.button}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          {/*  */}
                        
                          <Text style={styles.buttonText} onPress={() => navigation.navigate("RedeemPage")}
                          >Redeem your points</Text>
                          </LinearGradient>
                        </TouchableOpacity>

      {/* {showModal && (
        <Animated.View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Congratulations!</Text>
            <Text style={styles.modalText}>
              You have won <Text style={styles.pointsWon}>{wonPoints}</Text> points!
            </Text>
          </View>
        </Animated.View>
      )} */}

      <PointsModal 
        visible={showModal} 
        points={wonPoints}
        onClose={() => setShowModal(false)}

      />

      {showErrorModal && (
        <Animated.View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Waytrix Team</Text>
            <Text style={styles.modalText}>
              Failed to add points. You can only spin the wheel once every 24 hours.
            </Text>
            <Text style={styles.modalText}>
              Thank you for using our services.
            </Text>
            <TouchableOpacity onPress={() => setShowErrorModal(false)}>
              <Text style={styles.homeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

    </View>
    </ImageBackground>
      );
};

export default BonusScreen;

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 2,
  },
  greetingText: {
    fontSize: 18,
    color: 'white',
    textAlign: "center",
    // marginTop: 20,
    fontWeight: "600",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
    color: 'white',
  },
  logoutButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#d9534f", // Bootstrap's 'danger' color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 50, // FOR FOOTER
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  
  container: {
    flex: 1,
    alignItems: "center",
    top: "2%",

  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: SCREEN_WIDTH / 1.4,
    alignSelf: "flex-start",
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#454D77",
    borderRadius: 14,
    paddingBottom: 10,
  },
  topBarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  divider: {
    backgroundColor: "#424677",
    width: SCREEN_WIDTH * 0.9,
    height: 1,
  },
  multiplyEarningsText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    marginBottom: 20,
  },
  walletView: {
    position: "relative",
    marginTop: 30,
  },
  walletLabel: {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 4,
    alignItems: "center",
    position: "absolute",
    top: -15,
    zIndex: 2,
    width: 100,
    left: (SCREEN_WIDTH / 2 - 100) / 2,
    borderRadius: 50,
    paddingHorizontal: 12,
    height: 35,
  },
  walletLabelText: {
    fontSize: 18,
    fontWeight: "500",
  },
  walletContent: {
    width: SCREEN_WIDTH / 2,
    height: 110,
    borderColor: "rgba(209, 177, 177,0.4)",
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  walletTextContainer: {
    rowGap: 8,
  },
  addedToWalletText: {
    color: "white",
  },
  walletAmountContainer: {
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
  },
  walletAmountText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    height: 50,
  //   padding: 20,
    backgroundColor: '#3F63CB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#000",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
    fontWeight:'bold'
  },
  pointsWon: {
    fontWeight: "bold",
  },
});
