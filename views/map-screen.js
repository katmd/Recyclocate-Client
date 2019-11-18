import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Dimensions, Button, Text, SafeAreaView } from 'react-native';
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
      longitude: 0,
      userMarkers: []
    }
    this.handlePress = this.handlePress.bind(this);
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
  handlePress(event) {
    let currentCoords = {
      latitude: this.state.latitude,
      longitude: this.state.longitude
    }
    this.setState({
      userMarkers: [
        ...this.state.userMarkers, {
          coords: currentCoords
        }
      ]
    })
  }
  render() {
    let markers = this.props.locationMarkers;
    let userLoc = { latitude: this.state.latitude, longitude: this.state.longitude };
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1}}>
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
            {/* Database markers */}
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
                {/* User Markers */}
                {this.state.userMarkers.map((marker, idx) => {
                  const coords = {
                    latitude: parseFloat(marker.latitude),
                    longitude: parseFloat(marker.longitude)
                  };

                  return (
                    <Marker
                      key={idx}
                      coordinate={marker.coords}
                      title="User Marker"
                      description={'Marker: ' + idx}
                    >
                      <View style={styles.recyclocationMarker} />
                    </Marker>
                  );
                })}
          </MapView>
        </View>
        <View style={styles.addBtnView}>
          <Button
            title="Add Recyclocation"
            onPress={this.handlePress}
          />
        </View>
      </SafeAreaView>
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
  },
  addBtnView: {
      position: 'absolute', //use absolute position to show button on top of the map
      top: '90%' //for center align
  },
  addBtnText: {
    textAlign: 'center',
    marginVertical: 8,
  },
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
