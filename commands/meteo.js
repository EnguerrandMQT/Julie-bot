import 'dotenv/config'
import fetch from "node-fetch";

async function getCityCoord(city) {
    let pos = new Object;

    let url = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + process.env.OW_KEY + '&units=metric';

    return await fetch(url).then(res => {
        return res.json();
    }).then(res => {
        pos.city = city;
        pos.latitude = res[0].lat;
        pos.longitude = res[0].lon;
        return pos;
    }).catch(error => {
        console.log('ERROR while obtaining city location : ' + error.message);
        return pos;
    });
}

function createWeatherMessage(pos, data) {
    // console.log(pos)
    // console.log(data)
    let msg = `
Météo à **${pos.city}**, *${data.timezone}* :
    *Actuellement :*
        - Ressenti : ${data.current.feels_like} °C
        - ${data.current.weather[0].description}

    *Aujourd'hui :*
        - Minimimum : ${data.daily[0].temp.min} °C
        - Maximum : ${data.daily[0].temp.max} °C
        - ${data.daily[0].weather[0].description}

    *Demain :*
        - Minimimum : ${data.daily[1].temp.min} °C
        - Maximum : ${data.daily[1].temp.max} °C
        - ${data.daily[1].weather[0].description}
`
    if (data.alerts) {
        msg += `
    **Alertes par *${data.alerts[0].sender_name}*:**
                **${data.alerts[0].event}**
${data.alerts[0].description}        
`
    }
    return msg;
}

async function getMeteo(cityName) {
    let url = '';
    let pos = new Object;

    pos = await getCityCoord(cityName)

    if (pos.latitude || pos.longitude) {
        url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + pos.latitude + '&lon=' + pos.longitude + '&exclude=minutely,hourly&lang=fr&appid=' + process.env.OW_KEY + '&units=metric';
        
        let data = await fetch(url).then(response => {
            return response.json();
        }).catch(error => {
            console.log('ERROR while obtaining wheather data :' + error.message);
        });

        let msg = createWeatherMessage(pos, data)
        return msg
    } else {
        return "Erreur dans la recherche de la ville, impossible de trouver les coordonnées GPS correspondantes"
    }

}

export default {
    getMeteo
}