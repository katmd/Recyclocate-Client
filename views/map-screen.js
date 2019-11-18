import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { fetchLocations } from '../client/store/location';
import user from '../client/store/user';

class MapScreen extends Component {
  constructor() {
    super();
    this.state = {
      latitude: 0,
      longitude: 0
    }
  }
  async componentDidMount() {
    this.props.fetchLocations();

    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      console.log("Location granted: ", location);
    }

    this.watchId = navigator.geolocation.watchPosition((position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      }, (error) => {
        console.log('error: ', error)
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }
  render() {
    let markers = this.props.locationMarkers;
    let userLoc = { latitude: this.state.latitude, longitude: this.state.longitude };
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        >
          <Marker coordinate={userLoc}>
            <View style={styles.userLocMarker} />
          </Marker>
          {!markers
            ? null
            : markers.map(marker => {
                const coords = {
                  latitude: parseFloat(marker.latitude),
                  longitude: parseFloat(marker.longitude)
                };
                const metadata = `Marker ID: ${marker.id}`;

                return (
                  <Marker
                    key={marker.id}
                    coordinate={coords}
                    title="{metadata}"
                    description={metadata}
                  >
                    <View style={styles.recyclocationMarker} />
                  </Marker>
                );
              })}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  userLocMarker: {
    backgroundColor: 'blue',
    borderColor: 'lightblue',
    borderWidth: 2,
    padding: 3,
    borderRadius: 100
  },
  recyclocationMarker: {
    backgroundColor: 'green',
    borderColor: 'lightgreen',
    borderWidth: 2,
    padding: 5,
    borderRadius: 50
  }
});

const mapStateToProps = state => {
  return {
    locationMarkers: state.location.allLocations
  };
};

const mapDispatchToProps = dispatch => {
  return { fetchLocations: () => dispatch(fetchLocations()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
