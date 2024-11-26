module.exports = {
    expo: {
        ...require('./app.json').expo,
        plugins: [
            ...require('./app.json').expo.plugins,
            '@react-native-firebase/app',
            [
                "expo-build-properties",
                {
                    "android": {
                        "compileSdkVersion": 33,
                        "targetSdkVersion": 33,
                        "buildToolsVersion": "33.0.0"
                    },
                    "ios": {
                        "useFrameworks": "static"
                    }
                }
            ]
        ]
    }
}; 