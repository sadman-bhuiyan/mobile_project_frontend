const MetroConfig = require('@ui-kitten/metro-config');
const evaConfig = {
    evaPackage: '@eva-design/eva', // Required (Can be `@eva-design/material`)
};

module.exports = MetroConfig.create(evaConfig, {});