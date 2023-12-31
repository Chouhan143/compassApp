import * as React from 'react';
import 'react-native-gesture-handler';
import {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import MainScreen from './src/screens/componrnts/MainScreen';
import CompassOverlay from './src/screens/componrnts/CompassOverlay';
import {PaperProvider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import HomeScreen from './src/screens/componrnts/HomeScreen';
import CheckoutPage from './src/screens/componrnts/CheckoutPage';
import Ebook from './src/screens/componrnts/Ebook';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomSideMenu from './src/screens/componrnts/CustomSideMenu';
import Login from './src/screens/LoginSignUp/Login';
import SignUp from './src/screens/LoginSignUp/SignUp';
import ModalComponent from './src/screens/componrnts/ModalComponent';
import PaymentScreen from './src/screens/componrnts/PaymentScreen';
import {StripeProvider} from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import LoginProvider from './src/screens/utils/context/LoginProvider';
import MainNavigator from './src/screens/utils/MainNavigator';
import {useLogin} from './src/screens/utils/context/LoginProvider';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function App() {
  const publishableKey =
    'pk_live_51O1ruqGeHhuFbcSto0o2KGgUJ8Rzq2ZgTbR0KvZv39sx9mFmEqJQV3dM3HPmdHuEPrt71NU1CnGRohrv98aayuot00IQGDaawF';

  const {isLoggedIn, setIsLoggedIn} = useLogin();
  const [initializing, setInitializing] = useState(true);
  const [checkUserPayment, setCheckUserPayment] = useState('');
  console.log('isLoggedIn', isLoggedIn);
  const GradientHeader1 = () => {
    const navigation = useNavigation();
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#0a2240', '#0a2240']}
        style={{
          padding: responsiveWidth(3),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Icon
          name="arrowleft"
          size={responsiveFontSize(3)}
          color="#fff"
          style={{marginLeft: responsiveWidth(3)}}
          onPress={() => navigation.navigate('Home')}
        />
        <Text
          style={{
            color: '#fff',
            fontSize: responsiveFontSize(2.5),
            fontWeight: '700',
            paddingLeft: responsiveWidth(3),
          }}>
          Back
        </Text>
      </LinearGradient>
    );
  };

  const GradientHeader2 = () => {
    const navigation = useNavigation();
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#0a2240', '#0a2240']}
        style={{
          padding: responsiveWidth(3),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Icon
          name="arrowleft"
          size={responsiveFontSize(3)}
          color="#fff"
          style={{marginLeft: responsiveWidth(3)}}
          onPress={() => navigation.navigate('Home')}
        />
        <Text
          style={{
            color: '#fff',
            fontSize: responsiveFontSize(2.5),
            fontWeight: '700',
            paddingLeft: responsiveWidth(3),
          }}>
          Compass Overlay
        </Text>
      </LinearGradient>
    );
  };

  const GradientHeader3 = () => {
    const navigation = useNavigation();
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#0a2240', '#0a2240']}
        style={{
          padding: responsiveWidth(3),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Icon
          name="arrowleft"
          size={responsiveFontSize(3)}
          color="#fff"
          style={{marginLeft: responsiveWidth(3)}}
          onPress={() => navigation.navigate('Home')}
        />
        <Text
          style={{
            color: '#fff',
            fontSize: responsiveFontSize(2.5),
            fontWeight: '700',
            paddingLeft: responsiveWidth(3),
          }}>
          Ebook
        </Text>
      </LinearGradient>
    );
  };

  useEffect(() => {
    // Check if a token exists in AsyncStorage
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const paymentStatus = await AsyncStorage.getItem('paymentStatus');
        setCheckUserPayment(JSON.parse(paymentStatus));

        if (token) {
          setIsLoggedIn(token);
        }
        setInitializing(false);
      } catch (error) {
        // Handle AsyncStorage read error
        setInitializing(false);
      }
    };

    checkToken();
  }, [setIsLoggedIn]);

  if (initializing) {
    return null; // Render a loading screen while initializing
  }

  return (
    <NavigationContainer>
      <StripeProvider publishableKey={publishableKey}>
        <Stack.Navigator
          initialRouteName={
            isLoggedIn ? (checkUserPayment ? 'Home' : 'Login') : 'HomeScreen'
          }
          // drawerContent={props => <CustomSideMenu {...props} />}
        >
          <Stack.Screen
            name="Home"
            component={MainScreen}
            options={{
              title: 'Compass',
              headerStyle: {
                backgroundColor: '#0a2240',
              },
              headerTitleStyle: {
                alignSelf: 'center',
                fontSize: responsiveFontSize(2.5),
                fontWeight: '700',
              },
              headerShown: false,
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="ModalComponent"
            component={ModalComponent}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CustomSideMenu"
            component={CustomSideMenu}
            options={{
              header: () => <GradientHeader1 />,
              headerTitleStyle: {alignSelf: 'center'},
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="PaymentScreen"
            component={PaymentScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CompassOverlay"
            component={CompassOverlay}
            options={{
              header: () => <GradientHeader2 />,
              headerTitleStyle: {alignSelf: 'center'},
              headerTintColor: 'white',
            }}
          />

          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Ebook"
            component={Ebook}
            options={{
              header: () => <GradientHeader3 />,
              headerTitleStyle: {alignSelf: 'center'},
              headerTintColor: 'white',
            }}
          />

          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>

        {/* <MainNavigator /> */}
      </StripeProvider>
    </NavigationContainer>
  );
}

export default App;
