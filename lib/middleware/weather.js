const getWeatherData = () =>
    Promise.resolve([
        {
            location: {
                name: 'Портленд',
                coordinates: { lat: 45.5154586, lng: -122.6793461 },
            },
            forecastUrl:
                'https://api.weather.gov/gridpoints/PQR/112,103/forecast',
            iconUrl:
                'https://api.weather.gov/icons/land/day/tsra,40?size=medium',
            weather: 'Вероятны грозы и ливни',
            temp: '15 C',
        },
        {
            location: {
                name: 'Бенд',
                coordinates: { lat: 44.0581728, lng: -121.3153096 },
            },
            forecastUrl:
                'https://api.weather.gov/gridpoints/PDT/34,40/forecast',
            iconUrl:
                'https://api.weather.gov/icons/land/day/tsra_sct,50?size=medium',
            weather: 'Местами грозы и ливни',
            temp: '10 C',
        },
        {
            location: {
                name: 'Манзанита',
                location: { lat: 45.7184398, lng: -123.9351354 },
            },
            forecastUrl:
                'https://api.weather.gov/gridpoints/PQR/73,120/forecast',
            iconUrl:
                'https://api.weather.gov/icons/land/day/tsra,90?size=medium',
            weather: 'Грозы и ливни',
            temp: '13 C',
        },
    ]);

const weatherMiddleware = async (req, res, next) => {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weatherContext = await getWeatherData();
    next();
};

module.exports = weatherMiddleware;
