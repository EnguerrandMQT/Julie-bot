import 'dotenv/config'
import fetch from "node-fetch";
import geoIP from "geoip-lite"


async function getCityCoord(city) {
    let pos = new Object;

    let url = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + process.env.OW_KEY + '&units=metric';

    await fetch(url).then(res => {
        return res.json();
    }).then(res => {
        pos.city = city;
        pos.latitude = res[0].lat;
        pos.longitude = res[0].lon;
    }).catch(error => {
        console.log('ERROR with fetch: ' + error.message);
    });
    return pos;

}


async function getCurrentLocation() {
    let pos = new Object;

    await fetch("https://api.ipify.org?format=json").then(res => {
        return res.json();
    }).then(res => {
        let geo = geoIP.lookup(res.ip);
        pos.city = geo.city
        pos.latitude = geo.ll[0];
        pos.longitude = geo.ll[1];
    }).catch(error => {
        console.log('ERROR with fetch: ' + error.message);
    });
    return pos;
}

function createWeatherMessage(pos, data) {
    console.log(pos)
    console.log(data)

    let msg = "Actuellement à " + pos.city + ", il fait " + data.main.temp + "°C"
    return msg;
}

async function getMeteo(byCity, cityName) {
    let url = '';
    let pos = new Object;
    let data;

    if (byCity == true) {
        pos = await getCityCoord(cityName)
    } else {
        pos = await getCurrentLocation()
    }

    url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + pos.latitude + '&lon=' + pos.longitude + '&lang=fr&appid=' + process.env.OW_KEY + '&units=metric';
    await fetch(url).then(response => {
        return response.json();;
    }).then(res => {
        data = res
    }).catch(error => {
        console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
    });

    let msg = createWeatherMessage(pos, data)
    return msg
}

export default {
    getMeteo
}