import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Pinchable from 'react-native-pinchable';
import LinearGradient from 'react-native-linear-gradient';
import CompassHeading from 'react-native-compass-heading'; // Use only CompassHeading
import Geolocation from 'react-native-geolocation-service';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import MapView, {Marker, Polyline} from 'react-native-maps'; // Import MapView from react-native-maps
import Geocoding from 'react-native-geocoding';
import ImageZoom from 'react-native-image-pan-zoom';
const CompassOverlay = ({route}) => {
  const {option} = route.params;
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const [compassHeading, setCompassHeading] = useState(0);
  const [longitude, setLongitude] = useState('');
  const [latitude, setlatitude] = useState('');
  const [qiblad, setQiblad] = useState(0);
  const [showMap, setShowMap] = useState(false); // State variable to toggle between compass and map views
  const [locationName, setLocationName] = useState('');
  Geocoding.init('AIzaSyC8US8kyT5h4eZIjWxBWuCDqLB2WOWenb4');

  useEffect(() => {
    const degree_update_rate = 1;

    CompassHeading.start(degree_update_rate, ({heading, accuracy}) => {
      setCompassHeading(heading);
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  const calculate = (latitude, longitude) => {
    const PI = Math.PI;
    const latk = (21.4225 * PI) / 180.0;
    const longk = (39.8264 * PI) / 180.0;
    const phi = (latitude * PI) / 180.0;
    const lambda = (longitude * PI) / 180.0;
    const qiblad =
      (180.0 / PI) *
      Math.atan2(
        Math.sin(longk - lambda),
        Math.cos(phi) * Math.tan(latk) -
          Math.sin(phi) * Math.cos(longk - lambda),
      );
    setQiblad(qiblad);
  };

  const getLocation = async () => {
    const locationPermission = await check(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );

    if (locationPermission === RESULTS.GRANTED) {
      // Location permission is granted, proceed to get the location
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setlatitude(latitude);
          setLongitude(longitude);
          console.log(latitude, longitude, 'latitude and longitude');
          calculate(latitude, longitude);
        },
        error => {
          console.error(error.code, error.message, 'error');
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      // Location permission is not granted, request it
      const permissionResult = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      if (permissionResult === RESULTS.GRANTED) {
        // Permission granted, proceed to get the location
        getLocation();
      } else {
        // Permission denied, handle accordingly
        console.log('Location permission denied.');
      }
    }
  };

  // location Name

  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await Geocoding.from({latitude, longitude});
      if (response.results && response.results.length > 0) {
        const addressComponent = response.results[0].formatted_address; // Adjust the index based on your requirements
        const locationName = addressComponent;
        setLocationName(locationName);
      } else {
        console.error('No results found in geocoding response.');
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
    }
  };

  useEffect(() => {
    getLocationName(latitude, longitude);
  }, [latitude, longitude]);

  useEffect(() => {
    getLocation();
  }, []);

  const getCardinalDirection = heading => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const degreePerDirection = 360 / directions.length;
    heading = (heading + 360) % 360;
    const index =
      Math.floor((heading + degreePerDirection / 2) / degreePerDirection) % 8;
    return directions[index];
  };

  const imageRotation = `${360 - compassHeading}deg`;

  return (
    <View style={styles.container}>
      {showMap ? (
        <>
          {/* Map jo pure screen me hai   */}
          <View style={{flex: 1}}>
            <MapView
              style={[styles.map]}
              region={{
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                // latitudeDelta: 0.0922,
                // longitudeDelta: 0.0421,
                latitudeDelta: 0.0922, // You can try adjusting this value
                longitudeDelta: 0.0922,
              }}
              mapType={isSatelliteView ? 'satellite' : 'standard'}>
              <Marker
                coordinate={{
                  latitude: parseFloat(latitude),
                  longitude: parseFloat(longitude),
                }}
              />

              {/* <Polyline
                coordinates={[
                  {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                  },
                  {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude) + 180,
                  },
                ]}
                strokeColor="#FF5733"
                strokeWidth={2}
              />

              <Polyline
                coordinates={[
                  {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                  },
                  {
                    latitude: parseFloat(latitude) + 180,
                    longitude: parseFloat(longitude),
                  },
                ]}
                strokeColor="#FF5733"
                strokeWidth={2}
              />

              <Polyline
                coordinates={[
                  {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                  },
                  {
                    latitude: parseFloat(latitude) - 90,
                    longitude: parseFloat(longitude),
                  },
                ]}
                strokeColor="#FF5733"
                strokeWidth={2}
              />

              <Polyline
                coordinates={[
                  {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                  },
                  {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude) + 90,
                  },
                ]}
                strokeColor="#FF5733"
                strokeWidth={2}
              /> */}

              {/* Vertical line */}
            </MapView>
          </View>

          {/* compass headinf and arrow And Comapss Image    */}
          <View
            style={{
              position: 'absolute',
              top: responsiveHeight(0),
            }}>
            <View
              style={[
                {justifyContent: 'center', alignItems: 'center'},
                styles.map,
              ]}>
              <View style={styles.horizontalLine} />

              {/* Vertical Line */}
              <View style={styles.verticalLine} />
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: responsiveHeight(2),
                  zIndex: 2,
                }}>
                <View
                  style={{
                    backgroundColor: '#000',
                    paddingHorizontal: responsiveWidth(4),
                    paddingVertical: responsiveWidth(2),
                    borderRadius: responsiveWidth(2),
                    padding: responsiveWidth(2),
                    borderColor: 'red',
                    borderWidth: 1,
                    marginTop: responsiveHeight(10),
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: responsiveFontSize(2.3),
                      fontWeight: '600',
                      textAlign: 'center',
                      // paddingBottom: responsiveHeight(2),
                    }}>
                    {`${compassHeading}° ${getCardinalDirection(
                      compassHeading,
                    )}`}
                  </Text>
                </View>

                <Image
                  source={require('../assets/images/UpArrow.png')}
                  style={{
                    width: responsiveWidth(12),
                    height: responsiveWidth(12),
                    // marginTop: responsiveHeight(14.5),
                    resizeMode: 'contain',
                  }}
                />
              </View>

              <Image
                source={
                  isSatelliteView ? option.imageSource : option.imageSource2
                }
                style={{
                  position: 'absolute',
                  // top: responsiveHeight(24),
                  top: responsiveHeight(50) - responsiveWidth(50),
                  width: responsiveWidth(100),
                  height: responsiveWidth(100),
                  resizeMode: 'cover',
                  transform: [{rotate: imageRotation}], // Rotate the image
                }}
              />
            </View>
          </View>

          {/*  lat long  box  */}
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              position: 'absolute',
              bottom: 0,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#0a2240', '#0a2240']}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'orange',
                  width: responsiveWidth(70),
                  paddingVertical: responsiveHeight(2),
                  borderRadius: responsiveWidth(1),
                  marginTop: responsiveHeight(3),
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: responsiveFontSize(1.6),
                    fontWeight: '600',
                    paddingHorizontal: responsiveWidth(8),
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginBottom: responsiveHeight(1),
                  }}>
                  {locationName}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: responsiveFontSize(1.5),
                    fontWeight: '500',
                  }}>
                  {latitude} {} {longitude}
                </Text>
              </LinearGradient>
            </View>
          </View>
        </>
      ) : (
        // MapView End here
        // Simple Compass Show  here
        <>
          <View
            style={{
              flex: 1,
              backgroundColor: '#eaf4fc',
            }}>
            <View style={styles.map}>
              <View style={styles.horizontalLine} />

              {/* Vertical Line */}
              <View style={styles.verticalLine} />

              {/* flex 1st without map  wala  */}
              <View
                style={{
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingTop: responsiveHeight(5),
                    zIndex: 3,
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      top: responsiveHeight(20),
                    }}>
                    <View
                      style={{
                        backgroundColor: '#F5F5F5',
                        paddingHorizontal: responsiveWidth(4),
                        paddingVertical: responsiveWidth(2),
                        borderRadius: responsiveWidth(2),
                        borderColor: 'gray',
                        borderWidth: 1,
                        marginBottom: responsiveHeight(2),
                      }}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: responsiveFontSize(2.5),
                          fontWeight: '600',
                          textAlign: 'center',
                        }}>
                        {`${compassHeading}° ${getCardinalDirection(
                          compassHeading,
                        )}`}
                      </Text>
                    </View>

                    <Image
                      source={require('../assets/images/UpArrow.png')}
                      style={{
                        width: responsiveWidth(12),
                        height: responsiveWidth(12),
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                </View>
                <View>
                  {showMap ? (
                    <>
                      <ImageZoom
                        cropWidth={responsiveWidth(100)}
                        cropHeight={responsiveHeight(100)}
                        imageWidth={responsiveWidth(100)}
                        imageHeight={responsiveHeight(100)}>
                        <Image
                          source={
                            isSatelliteView
                              ? option.imageSource
                              : option.imageSource2
                          }
                          style={{
                            flex: 1,
                            width: responsiveWidth(100),
                            height: responsiveWidth(100),
                            resizeMode: 'cover',
                            transform: [{rotate: imageRotation}], // Rotate the image
                          }}
                        />
                      </ImageZoom>
                    </>
                  ) : (
                    <>
                      <ImageZoom
                        cropWidth={responsiveWidth(100)}
                        cropHeight={responsiveHeight(100)}
                        imageWidth={responsiveWidth(100)}
                        imageHeight={responsiveHeight(100)}>
                        <Image
                          source={option.imageSource2}
                          style={{
                            flex: 1,
                            // top: responsiveHeight(25),
                            top: responsiveHeight(50) - responsiveWidth(50),
                            marginHorizontal: responsiveWidth(2),
                            position: 'absolute',
                            width: responsiveWidth(100),
                            height: responsiveWidth(100),
                            resizeMode: 'cover',
                            transform: [{rotate: imageRotation}], // Rotate the image
                            alignSelf: 'center',
                          }}
                        />
                      </ImageZoom>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>
          {/* main view end here */}
        </>
      )}

      {option.compasId === 1 || option.compasId2 === 3 ? (
        <TouchableOpacity
          onPress={() => setShowMap(!showMap)}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            padding: responsiveWidth(1.1),
            borderRadius: responsiveWidth(10),
            borderColor: 'red',
            borderWidth: 2,
            borderStyle: 'dashed',
          }}>
          {showMap ? (
            <Image
              source={require('../assets/images/compass.png')}
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
              }}
            />
          ) : (
            <Image
              source={require('../assets/images/map.png')}
              style={{
                width: responsiveWidth(10),
                height: responsiveWidth(10),
              }}
            />
          )}
        </TouchableOpacity>
      ) : null}

      {showMap ? (
        <TouchableOpacity
          onPress={() => setIsSatelliteView(!isSatelliteView)}
          style={{
            position: 'absolute',
            top: responsiveHeight(11),
            left: responsiveWidth(82),
          }}>
          {isSatelliteView ? (
            <Image
              source={require('../assets/images/orbit.png')}
              resizeMode="contain"
              style={{
                width: responsiveWidth(13),
                height: responsiveWidth(13),
              }}
            />
          ) : (
            <Image
              source={require('../assets/images/orbit.png')}
              resizeMode="contain"
              style={{
                width: responsiveWidth(13),
                height: responsiveWidth(13),
              }}
            />
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default CompassOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a2240',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  map: {
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    width: responsiveWidth(100),
    height: responsiveHeight(100),
  },

  // map: {
  //   width: Dimensions.get('window').width,
  //   height: Dimensions.get('window').height,
  // },

  horizontalLine: {
    position: 'absolute',
    width: '100%', // Full width
    height: 2, // Height of the horizontal line
    backgroundColor: 'red', // Color of the line
    top: '50%', // Position it vertically in the middle
  },
  verticalLine: {
    position: 'absolute',
    width: 2, // Width of the vertical line
    height: '100%', // Full height
    backgroundColor: 'red', // Color of the line
    left: '50%', // Position it horizontally in the middle
  },
  map2: {
    flex: 1,
  },
  horizontalLine2: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'red',
    top: '50%',
  },
  verticalLine2: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: 'red',
    left: '50%',
  },
});
