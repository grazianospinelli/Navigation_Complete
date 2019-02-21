/** @format */
import React, { Component } from 'react';
import {
  AppRegistry, View, Text, StyleSheet,
} from 'react-native';
import App from './app';
import { name as appName } from './app.json';
// import bgActions from './bgActions';

AppRegistry.registerComponent(appName, () => App);

// AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgActions);
