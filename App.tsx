import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, StatusBar, BackHandler, AppState } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import CustomDrawerContent from './layout/Navbar';
import HomeScreen from './Pages/HomeScreen';
import OrderScreen from './Pages/OrderScreen/OrderScreen';
import changeNavigationBarColor from 'react-native-navigation-bar-color'; // Import the package
import ValetScreen from './Pages/OrderScreen/ValetScreen'
import MenuScreen from './Pages/OrderScreen/MenuScreen'
import SurveyScreen from './Pages/SurveyScreen'
import ContactUsScreen from './Pages/ContactUsScreen/ContactUsScreen'
import BonusScreen from './Pages/Bonus/bonus'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignInUpCustomer from './Pages/Accounts/Customer/SignUpCustomer';
import ForgotPass from './Pages/Accounts/Customer/ForgotPass';
import TableSignIN from './Pages/Accounts/Table/TableSignIn';
import TableLogout from './Pages/Accounts/Table/TableLogout'
import RedeemPage from './Pages/Bonus/RedeemYourPoints/RedeemYourPoints'
import ValetLogin from './Pages/Accounts/Valet/ValetLogin'
import ValetAccountScreen from './Pages/Accounts/Valet/ValetScreen'
import CarTimer from './Pages/OrderScreen/TimerCar'
const Drawer = createDrawerNavigator();

interface HeaderProps {
  navigation: any;
  title: string;
  onPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ navigation, title, onPress }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* {navigation.canGoBack() && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={44} color="white" />
          </TouchableOpacity>
        )} */}
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
          <Feather name="menu" size={44} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  const navigationRef = useRef<NavigationContainerRef>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [customerToken, setCustomerToken] = useState<string | null>(null);
  const [tableToken, setTableToken] = useState<string | null>(null);
  const [valetToken, setValetToken] = useState<string | null>(null);
  const [currentRouteName, setCurrentRouteName] = useState<string | undefined>(undefined);
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

 

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <NavigationContainer ref={navigationRef}>
        <TouchableWithoutFeedback onPress={onPressScreen}>
          <View style={styles.content}>
            <Drawer.Navigator backBehavior="history"
              initialRouteName="Home"
              drawerContent={(props) => <CustomDrawerContent {...props} />}
            >
              {tableToken?
              <Drawer.Screen
                name="Home"
                component={valetToken ? ValetAccountScreen : HomeScreen}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Home" onPress={onPressScreen} />
                  ),
                }}
              />:
<Drawer.Screen
                name="Home"
                component={valetToken ? ValetAccountScreen : TableSignIN}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Home" onPress={onPressScreen} />
                  ),
                }}
              />
}

              <Drawer.Screen
                name="TableLogout"
                component={tableToken ? TableLogout : TableSignIN}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Table Logout" onPress={onPressScreen} />
                  ),
                }}
              />
              {/* CarTimer */}
              <Drawer.Screen
                name="SurveyScreen"
                component={tableToken ? SurveyScreen : TableSignIN}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Survey Screen" onPress={onPressScreen} />
                  ),
                }}
              />
              <Drawer.Screen
                name="CarTimer"
                component={tableToken ? CarTimer : TableSignIN}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Time To Get Your Car" onPress={onPressScreen} />
                  ),
                }}
              />
<Drawer.Screen
                name="MenuScreen"
                component={tableToken ? MenuScreen : TableSignIN}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Menu Screen" onPress={onPressScreen} />
                  ),
                }}
              />
              {customerToken ? 
<Drawer.Screen
                name="ValetScreen"
                component={tableToken ? ValetScreen : TableSignIN}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Valet Screen" onPress={onPressScreen} />
                  ),
                }}
                // fhoeruihfiuerhf8w38742y4rfhej
              /> : <Drawer.Screen
              name="ValetScreen"
              component={tableToken ? SignInUpCustomer : TableSignIN}
              options={{
                header: ({ navigation }) => (
                  <Header navigation={navigation} title="Valet Screen" onPress={onPressScreen} />
                ),
              }}
            />  }
              {/* ForgotPass */}
              <Drawer.Screen
                name="ForgotPass"
                component={ForgotPass}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Forgot Pass" onPress={onPressScreen} />
                  ),
                }}
              />
              <Drawer.Screen
                name="ContactUsScreen"
                component={tableToken ? ContactUsScreen : TableSignIN}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Contact Us" onPress={onPressScreen} />
                  ),
                }}
              />
              {/* RedeemPage */}
              {customerToken ?
              <>
              <Drawer.Screen
                name="BonusScreen"
                component={tableToken ? BonusScreen : TableSignIN}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Bonus Screen" onPress={onPressScreen} />
                  ),
                }}
              /> 
              <Drawer.Screen
                name="RedeemPage"
                component={tableToken ? RedeemPage : TableSignIN}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Redeem Page" onPress={onPressScreen} />
                  ),
                }}
              /> 
              </>
              :
              <>
              <Drawer.Screen
                name="BonusScreen"
                component={SignInUpCustomer}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Sign IN/UP Customer" onPress={onPressScreen} />
                  ),
                }}
              /> 
              <Drawer.Screen
                name="RedeemPage"
                component={SignInUpCustomer}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Sign IN/UP Customer" onPress={onPressScreen} />
                  ),
                }}
              /> 

</>
              }
              <Drawer.Screen
                name="OrderScreen"
                component={tableToken ? OrderScreen : TableSignIN}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Orders Screen" onPress={onPressScreen} />
                  ),
                }}
              />


              {/* VALETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT */}
              
              {valetToken?

              <Drawer.Screen
                name="valetlogin"
                component={ValetAccountScreen}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Valet" onPress={onPressScreen} />
                  ),
                }}
              />:
<Drawer.Screen
                name="valetlogin"
                component={ValetLogin}
                options={{
                  header: ({ navigation }) => (
                    <Header navigation={navigation} title="Valet" onPress={onPressScreen} />
                  ),
                }}
              />}

            </Drawer.Navigator>
          </View>
        </TouchableWithoutFeedback>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: '#141414',
  },
  header: {
    paddingTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
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
  content: {
    flex: 1,
  },
});

export default App;
