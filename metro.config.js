const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure .js files are preferred over .mjs on web to avoid import.meta usage
// in libraries like zustand that use import.meta.env in their ESM builds
const sourceExts = config.resolver.sourceExts || [];
config.resolver.sourceExts = sourceExts.filter(ext => ext !== 'mjs');

module.exports = config;
