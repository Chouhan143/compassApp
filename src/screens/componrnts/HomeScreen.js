import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('../assets/images/HomeImage.jpg')}
        resizeMode="cover" // You can use 'cover' to fill the entire view
        style={styles.backgroundImage}
      />

      {/* Other Components */}
      <View style={styles.content}>
        <Text style={styles.textHeading}>WELCOME BACK</Text>
        <Text style={styles.textSubHeading}>
          Let Your dreams be your compass
        </Text>
        {/* Add more components here */}
      </View>

      <View style={styles.content2}>
        <TouchableOpacity
          style={{
            borderColor: '#A69EEC',
            borderWidth: 2,
            width: responsiveWidth(75),
            height: responsiveHeight(6.5),
            borderRadius: responsiveWidth(50),
            paddingHorizontal: responsiveWidth(5),
            shadowColor: '#A69EEC',
            backgroundColor: '#fff',
            elevation: 5,

            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('Login')}>
          <Text
            style={{
              fontSize: responsiveFontSize(2.5),
              fontWeight: '700',
              color: '#A69EEC',
            }}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderColor: '#A69EEC',
            borderWidth: 2,
            width: responsiveWidth(75),
            height: responsiveHeight(6.5),
            borderRadius: responsiveWidth(50),
            paddingHorizontal: responsiveWidth(5),
            marginTop: responsiveHeight(2),
            shadowColor: '#A69EEC',
            backgroundColor: '#A69EEC',
            elevation: 5,

            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('SignUp')}>
          <Text
            style={{
              fontSize: responsiveFontSize(2.5),
              fontWeight: '700',
              color: '#fff',
            }}>
            SignUp
          </Text>
        </TouchableOpacity>

        {/* Add more components here */}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute', // To layer it behind other components
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: responsiveHeight(10),
    // justifyContent: 'center',
  },
  content2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: responsiveHeight(6),
  },
  textHeading: {
    fontSize: responsiveFontSize(3),
    fontWeight: '800',
    color: '#000',
    letterSpacing: responsiveWidth(1),
  },
  textSubHeading: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '500',
    color: '#000',
  },
  textSignUp: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    color: '#f57f17',
  },
  text: {
    fontSize: responsiveFontSize(3),
    fontWeight: '800',
    color: '#000',
  },
});