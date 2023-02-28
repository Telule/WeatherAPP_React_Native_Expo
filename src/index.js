import { View, Text, Alert, SafeAreaView, StyleSheet, ScrollView, RefreshControl, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';


const OpenWeatherKey = '7b8ee943183abb6725ff9a349955fd61';
let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${OpenWeatherKey}`;


const Weather = () => {

    const [forecast, setForecast] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const loadForecast = async () => {
        setRefreshing(true);

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status != 'granted') {
            Alert.alert('Permission to access location was denied');
        }


        // get location
        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

        // obtengo del API el clima
        const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
        const data = await response.json();



        if (!response.ok) {
            Alert.alert('Error', 'Something went wrong' + `${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
        } else {
            setForecast(data)
        }

    }


    useEffect(() => {
        loadForecast();
    }, [])

    if (!forecast) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}></View>
        )
    }

    const current = forecast.weather[0];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView

                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => loadForecast()} />
                }

                style={{ marginTop: 50 }}
            >

                <Text style={styles.title}>
                    Clima Actual
                </Text>
                <Text style={{ alignItems: 'center', textAlign: 'center' }}>
                    Tu Ubicación :
                </Text>
                <View styles={styles.current}>
                    <Image
                        style={styles.largeIcon}
                        source={{
                            uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`
                        }}

                    />
                    <Text style={styles.currentTemp}>
                        {Math.round(forecast.main.temp)} °C
                    </Text>

                    <Text style={styles.currentDescription}>
                        {current.description}
                    </Text>
                </View>

                <View style={styles.extraInfo}>
                    <View style={styles.info}>
                        <Image
                            source={require('../assets/temp.png')}
                            style={{ width: 40, height: 40, borderRadius: 40 / 2, marginLeft: 50 }}

                        />
                        <Text style={styles.text}>
                            {forecast.main.feels_like}°
                        </Text>
                        <Text style={styles.text}>
                            Feels Like
                        </Text>
                    </View>

                    <View style={styles.info}>
                        <Image
                            source={require('../assets/humedad.png')}
                            style={{ width: 40, height: 40, borderRadius: 40 / 2, marginLeft: 50 }}

                        />
                        <Text style={styles.text}>
                            {forecast.main.humidity}%
                        </Text>
                        <Text style={styles.text}>
                            Humidity
                        </Text>
                    </View>
                </View>


            </ScrollView>
        </SafeAreaView>

    );
}



export default Weather


const styles = StyleSheet.create(

    {

        container: {
            flex: 1,
            backgroundColor: '#ECDBBA'

        },
        title: {
            textAlign: 'center',
            fontSize: 36,
            fontWeight: 'bold',
            color: '#C84B31'
        },

        current: {
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center'

        },

        largeIcon: {
            width: 300,
            height: 250,
            marginLeft: '10%'
        },
        currentTemp: {
            fontSize: 32,
            fontWeight: 'bold',
            textAlign: 'center'
        },
        currentDescription: {
            width: '100%',
            textAlign: 'center',
            fontWeight: '200',
            fontSize: 24,
            marginBottom: 5

        },
        info: {
            width: Dimensions.get('screen').width / 2.5,
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 15,
            justifyContent: 'center'

        },
        extraInfo: {
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: 'space-between',
            padding: 10
        },
        text: {
            fontSize: 20,
            color: '#fff',
            textAlign: 'center'
        }

    }


)