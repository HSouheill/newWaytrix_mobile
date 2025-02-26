import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, StatusBar, BackHandler } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, NavigationContainerRef, NavigationProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import CustomDrawerContent from './layout/Navbar';
import HomeScreen from './Pages/HomeScreen';
import OrderScreen from './Pages/OrderScreen/OrderScreen';
import changeNavigationBarColor from 'react-native-navigation-bar-color'; // Import the package
import ValetScreen from './Pages/OrderScreen/ValetScreen'
import MenuScreen from './Pages/OrderScreen/MenuScreen'
import SurveyScreen from './Pages/SurveyScreen'
import ContactUsScreen from './Pages/ContactUsScreen/ContactUsScreen'
import BonusScreen from './Pages/Bonus/BonusScreen'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignInUpCustomer from './Pages/Accounts/Customer/SignUpCustomer';
import SignIn from './Pages/Accounts/Customer/SignINCustomer';
import Login from './Pages/Accounts/Customer/Login';
import ForgotPass from './Pages/Accounts/Customer/ForgotPass';
import TableSignIN from './Pages/Accounts/Table/TableSignIn';
import TableLogout from './Pages/Accounts/Table/TableLogout'
import RedeemPage from './Pages/Bonus/RedeemYourPoints/RedeemYourPoints'
import ValetLogin from './Pages/Accounts/Valet/ValetLogin'
import ValetAccountScreen from './Pages/Accounts/Valet/ValetScreen'
import CarTimer from './Pages/OrderScreen/TimerCar'
import * as NavigationBar from 'expo-navigation-bar';
import TimerCar from './Pages/OrderScreen/TimerCar';
import { ParamListBase } from '@react-navigation/native';
// import Login from './Pages/Accounts/Customer/login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Change_password from './Pages/Accounts/Customer/Change_password';
import ResetPass from './Pages/Accounts/Customer/ResetPass';
import Valetstartingpage from './Pages/OrderScreen/Valetstartingpage';
import bonus from './Pages/Bonus/BonusScreen';
import { LinearGradient } from 'expo-linear-gradient';
import Profile from './Pages/profile/Profile';
import UpdateAccount from './Pages/profile/Update';
import ChangePassword from './Pages/profile/ChangePassword';
import DiningExperience from './Pages/Diningexperience'
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';





const Tab = createBottomTabNavigator();


const Drawer = createDrawerNavigator();

// interface HeaderProps {
//   navigation: any;
//   title: string;
//   onPress: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ navigation, title, onPress }) => {
//   return (
    
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.header}>
//         {/* {navigation.canGoBack() && (
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Feather name="arrow-left" size={44} color="white" />
//           </TouchableOpacity>
//         )} */}
//         <Text style={styles.title}>{title}</Text>
//         <TouchableOpacity style={styles.menuButton}>
//         {/* onPress={() => navigation.toggleDrawer()} */}
//           {/* <Feather name="menu" size={44} color="white" /> */}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

const App: React.FC = () => {
  
  const navigationRef = useRef<NavigationContainerRef>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [customerToken, setCustomerToken] = useState<string | null>(null);
  const [tableToken, setTableToken] = useState<string | null>(null);
  const [valetToken, setValetToken] = useState<string | null>(null);
  const [currentRouteName, setCurrentRouteName] = useState<string | undefined>(undefined);
  registerRootComponent(App);

  useEffect(() => {
    // Hide status bar
   // StatusBar.setHidden(true);

    // Hide the navigation bar
    NavigationBar.setVisibilityAsync('hidden');
  }, []);


  useEffect(() => {
    // Function to delete customerToken from AsyncStorage
    const deleteToken = async () => {
      try {
        await AsyncStorage.removeItem('customerToken');
        console.log('customerToken deleted from AsyncStorage');
      } catch (error) {
        console.error('Error deleting customerToken from AsyncStorage:', error);
      }
    };

    // Initial delete when component mounts
    deleteToken();

    // Set interval to delete token every 10 seconds
    const interval = setInterval(() => {
      deleteToken();
    }, 720000); 

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);
  const checkCustomerToken = async () => {
    const customerToken = await AsyncStorage.getItem('customerToken');
    const tableToken = await AsyncStorage.getItem('tableToken');
    const valetToken = await AsyncStorage.getItem('valetToken');

setTableToken(tableToken);
    setCustomerToken(customerToken);
    setValetToken(valetToken);
    console.log('Customer token:', customerToken);
    console.log('Table token:', tableToken);
    console.log('Valet token:', valetToken);


  };
  useEffect(() => {
    
    checkCustomerToken();
    const interval = setInterval(() => {
      checkCustomerToken();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const routeName = navigationRef.current?.getCurrentRoute()?.name;
      setCurrentRouteName(routeName);
    }, 1000); // 1 second interval

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Function to log the current route name
    const logCurrentRoute = () => {
      console.log('Current route name:', currentRouteName);
    };
  
    // Log the route name immediately
    logCurrentRoute();
  
    // Set up an interval to log the route name every second
    const intervalId = setInterval(logCurrentRoute, 1000);
  
    // Cleanup the interval on component unmount or when `currentRouteName` changes
    return () => clearInterval(intervalId);
  }, [currentRouteName]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (navigationRef.current && !valetToken ) {
        (currentRouteName ==='BonusScreen' || currentRouteName === 'CarTimer') ? console.log('NOTTTTTTTTTTTTTTTTTTT we have not navigated to advertisement screen')
        :
        navigationRef.current.navigate('Home');
      }
    }, 60000);
  };
  type RootStackParamList = {
    SignIn: undefined;
    ForgotPass: undefined;
    ResetPass: { email: string };
    Change_password: { 
      email: string; 
      resetToken: string 
    };
  };
  
  const Stack = createStackNavigator<RootStackParamList>();
  
  function AuthNavigator() {
    return (
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen 
          name="SignIn" 
          component={SignIn} 
          // options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ForgotPass" 
          component={ForgotPass} 
          // options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ResetPass" 
          component={ResetPass} 
          // options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Change_password" 
          component={Change_password} 
          // options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  const onPressScreen = () => {
    console.log('Pressed Successfully');
    resetTimeout();
  };

  useEffect(() => {
    resetTimeout();
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // Disable the back button
    });
    return () => {
      backHandler.remove();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // const Stack = createStackNavigator();


  return (
    <LinearGradient
    colors={['#3F63CB', '#003266', '#000000']}
    locations={[0, 0.4895, 0.9789]}
    style={styles.container}
  >
    <View style={styles.container}>
      
      {/* <AppNavigator /> */}
      <StatusBar hidden={true} />
      <NavigationContainer ref={navigationRef}  >
        <TouchableWithoutFeedback onPress={onPressScreen}>
          <View style={styles.content}>
            <Drawer.Navigator backBehavior="history"
              initialRouteName="Home"
              drawerContent={(props) => <CustomDrawerContent {...props}  />}
              screenOptions={{
                headerShown: false,  // Add this line to hide headers
                  overlayColor: 'transparent', // Make the overlay color transparent if desired
                  drawerType: tableToken ? 'none' : 'none',  // Only show drawer if tableToken exists
                 // drawerStyle: tableToken ? { // Adjust styles based on tableToken
                //  drawerType: 'slide', // This will slide the drawer and push the content above
                  //drawerStyle: {
                    drawerStyle: tableToken ? { // Adjust styles based on tableToken
                  height: 70, // Adjust the height to take up half the screen, or set to your preference
                  position: 'absolute', // Position it absolutely to control placement
                  left: 320,
                  top: '93%',
                  bottom: 0, // Align it to the bottom
                  borderTopLeftRadius: 20, // Optional: round the top corners
                  borderTopRightRadius: 20, // Optional: round the top corners
                  backgroundColor: 'black', // Drawer background color
                  
                }: { display: 'none' },  // Hide drawer when no tableToken
              }}
              //drawerLockMode={tableToken ? 'unlocked' : 'locked-closed'}  // Lock the drawer when no tableToken

            >
                      <Drawer.Screen name="SignIn" component={SignIn} />
                      <Drawer.Screen name="SignInUpCustomer" component={SignInUpCustomer} />
                      <Drawer.Screen name="ResetPass" component={ResetPass} />
                      <Drawer.Screen name="Valetstartingpage" component={Valetstartingpage} />
                      <Drawer.Screen name="Change_password" component={Change_password} />
                      <Drawer.Screen name="bonus" component={bonus} />
                      <Drawer.Screen name="Profile" component={Profile} />  
                      <Drawer.Screen name="UpdateAccount" component={UpdateAccount} />
                      <Drawer.Screen name="ChangePassword" component={ChangePassword} />
                      <Drawer.Screen name="DiningExperience" component={DiningExperience} />
                      <Drawer.Screen name="HomeScreen" component={HomeScreen} />

              {tableToken?
              <Drawer.Screen
                name="Home"
                component={valetToken ? ValetAccountScreen : HomeScreen}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="HOME" onPress={onPressScreen} />
                //   ),
                // }}
              />:
              <Drawer.Screen
                name="Home"
                component={valetToken ? ValetAccountScreen : TableSignIN}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="HOME" onPress={onPressScreen} />
                //   ),
                // }}
              />
}

              <Drawer.Screen
                name="TableLogout"
                component={tableToken ? TableLogout : TableSignIN}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="TABLE LOGOUT" onPress={onPressScreen} />
                //   ),
                // }}
              />
              {/* CarTimer */}
              <Drawer.Screen
                name="SurveyScreen"
                component={tableToken ? SurveyScreen : TableSignIN}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="SURVEY SCREEN" onPress={onPressScreen} />
                //   ),
                // }}
              />
              <Drawer.Screen
                name="CarTimer"
                component={tableToken ? CarTimer : TableSignIN}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="WAIT FOR VALET" onPress={onPressScreen} />
                //   ),
                // }}
              />
<Drawer.Screen
                name="MenuScreen"
                component={tableToken ? MenuScreen : TableSignIN}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="MENU SCREEN" onPress={onPressScreen} />
                //   ),
                // }}
              />
              {customerToken ? 
<Drawer.Screen
                name="ValetScreen"
                component={tableToken ? ValetScreen : TableSignIN}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="VALET SCREEN" onPress={onPressScreen} />
                //   ),
                // }}
                // fhoeruihfiuerhf8w38742y4rfhej
              /> : <Drawer.Screen
              name="ValetScreen"
              component={tableToken ? SignInUpCustomer : TableSignIN}
              // options={{
              //   header: ({ navigation }) => (
              //     <Header navigation={navigation} title="VALET SCREEN" onPress={onPressScreen} />
              //   ),
              // }}
            />  }
              {/* ForgotPass */}
              <Drawer.Screen
                name="ForgotPass"
                component={ForgotPass}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="FORGOT PASS" onPress={onPressScreen} />
                //   ),
                // }}
              />
              <Drawer.Screen
                name="ContactUsScreen"
                component={tableToken ? ContactUsScreen : TableSignIN}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="CONTACT US" onPress={onPressScreen} />
                //   ),
                // }}
              />
              {/* RedeemPage */}
              {customerToken ?
              <>
              {/* <Drawer.Screen
                name="BonusScreen"
                component={tableToken ? BonusScreen : TableSignIN}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="BONUS SCREEN" onPress={onPressScreen} />
                  ),
                }}
              />  */}
              <Drawer.Screen
                name="RedeemPage"
                component={tableToken ? RedeemPage : TableSignIN}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="REDEEM PAGE" onPress={onPressScreen} />
                //   ),
                // }}
              /> 
              </>
              :
              <>
              {/* <Drawer.Screen name="BonusScreen" component={BonusScreen} /> */}

              <Drawer.Screen
                name="BonusScreen"
                component={Login}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="SIGN IN/UP CUSTOMER" onPress={onPressScreen} />
                //   ),
                // }}
              /> 
              <Drawer.Screen
                name="RedeemPage"
                component={SignInUpCustomer}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="SIGN IN/UP CUSTOMER" onPress={onPressScreen} />
                //   ),
                // }}
              /> 

</>
              }
              <Drawer.Screen
                name="OrderScreen"
                component={tableToken ? OrderScreen : TableSignIN}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="ORDER SCREEN" onPress={onPressScreen} />
                //   ),
                // }}
              />


              {/* VALETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT */}
              
              {valetToken?

              <Drawer.Screen
                name="valetlogin"
                component={ValetAccountScreen}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="VALET" onPress={onPressScreen} />
                //   ),
                // }}
              />:
<Drawer.Screen
                name="valetlogin"
                component={ValetLogin}
                // options={{
                //   header: ({ navigation }) => (
                //     <Header navigation={navigation} title="VALET" onPress={onPressScreen} />
                //   ),
                // }}
              />
             }

             
              

   

            </Drawer.Navigator>
          </View>
        </TouchableWithoutFeedback>
      </NavigationContainer>


      <TimerCar showTimer={true} />  

    </View>
    </LinearGradient>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,

  },
  safeArea: {
    backgroundColor: '#fff',
    // backgroundColor: '#141414',
  },
  // header: {
  //   // paddingTop: 25,
  //   // flexDirection: 'row',
  //   // alignItems: 'center',
  //   // backgroundColor: '#8e8a9b',
  //   // paddingHorizontal: 15,
  //   // paddingVertical: 10,
  //   // borderBottomWidth: 1,
  //   // borderBottomColor: '#8e8a9b',
  // },
  backButton: {
    marginRight: 10,
  },
  menuButton: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
});


export default App;
        // "projectId": "a58edf9d-4f7f-424f-976e-ebe3c74b2b78"
