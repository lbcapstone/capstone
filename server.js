const express = require('express');
const app = express();
const path = require('path');
const superfaceClient = require('@superfaceai/one-sdk');
const ip = require('ip');

const sdk = new superfaceClient.SuperfaceClient();

const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);
app.set('view engine', 'ejs');

const API_KEY = process.env.API_KEY;
async function run(ip) {
    const profile = await sdk.getProfile("address/ip-geolocation@1.0.1");

    const result = await profile.getUseCase("IpGeolocation").perform(
        {
            ipAddress: ip
        },
        {
            provider: "ipdata",
            security: {
                apikey: {
                    apikey: API_KEY
                }
            }
        }
    );

    try {
        const data = result.unwrap();
        return data;
    } catch (error) {
        console.error(error);
    }
}

app.get('/', async (req, res) => {
    //res.sendFile('./views/index.html', { root: __dirname });
    //res.sendFile(path.join(__dirname, 'views', 'index.html'));
    res.render('index', { location: run("73.16.87.132") });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));