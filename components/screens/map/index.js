import React from 'react';
import { DrawerActions } from 'react-navigation-drawer';
import { Constants, MapView, Location, Permissions } from 'expo'
import { setLocation } from '../../../store/actions/maps/maps'
import { View } from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    Text,
    Button,
    Icon,
    Footer,
    FooterTab,
    Left,
    Right,
    Body
} from "native-base";
import styles from "./styles";
import { connect } from 'react-redux'

class Maps extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            locationResult: null,
            location: this.props.location
        }
        console.log('current locaiton', this.state.location)
    }

    componentWillMount() {
        this._getLocationAsync();
    }


    _handleMapRegionChange = mapRegion => {

    };

    _getLocationAsync = async () => {
        Permissions.askAsync(Permissions.LOCATION).then(({ status }) => {
            if (status !== 'granted') {
                this.setState({
                    locationResult: 'Permission to access location was denied'
                });

            }
            else {
                Location.getCurrentPositionAsync().then(location => {
                    this.setState({
                        locationResult: JSON.stringify(location),
                        location
                    })
                })
                    .catch(err => {
                        this.setState({
                            locationResult: err.toString()
                        })
                    })
            }
        })
            .catch(err => {

                this.setState({
                    locationResult: err.toString(),
                });
            })






    };

    render() {
        return (
            <Container style={styles.container}>
                <Header>
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
                        >
                            <Icon name="ios-menu" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Map</Title>
                    </Body>
                    <Right />
                </Header>
                <Content padder>
                    <View style={styles.container}>
                        <MapView
                            loadingEnabled
                            style={{ alignSelf: 'stretch', height: 500 }}
                            onRegionChange={this._handleMapRegionChange}
                            showsUserLocation
                            followsUserLocation
                        >
                            <MapView.Marker
                                draggable
                                coordinate={this.state.location.coords}
                                title="Current location"
                                description=""

                                onDragEnd={(e) => {
                                    this.setState({
                                        location: { coords: e.nativeEvent.coordinate },
                                        locationResult: JSON.stringify(e.nativeEvent.coordinate)
                                    })
                                }}
                            />
                        </MapView>

                        <Text>
                            Location: {this.state.locationResult}
                            State location: {JSON.stringify(this.props.location)}
                        </Text>
                        <Button
                            title='Get Current location'
                            onPress={() => {
                                this._getLocationAsync()
                            }} />
                        <Button
                            title="save my location"
                            onPress={() => {
                                this.props.setLocation(this.state.location)
                            }} />
                    </View>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button active full>
                            <Text>Footer</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}




const mapStateToProps = (state) => ({
    location: state.mapReducer.location
})

const mapDispatchToProps = (dispatch) => ({
    setLocation: (location) => {
        dispatch(setLocation(location))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Maps)