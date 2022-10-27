import fetch from "node-fetch";

async function getJoke() {
    // generate joke in french language
    let url = "https://v2.jokeapi.dev/joke/Any?lang=fr&type=twopart"
    return await fetch(url)
        .then(res => {
            return res.json()
        })
        .then(data => {
            let set = data.setup;
            let del = data.delivery;
            return {
                set,
                del
            }
        })
        .catch(error => {
            console.log('ERROR while obtaining joke : ' + error.message);
            return {
                set: "ERROR",
                del: "ERROR"
            }
        });
}

export default {
    getJoke,
}