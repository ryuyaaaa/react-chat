import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import AuthLoadingNavigator from './AuthLoadingNavigator';
import LogInScreen from '../screens/LogInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MessageScreen from '../screens/MessageScreen';

const AuthLoadingStack = createStackNavigator({AuthLoading: AuthLoadingNavigator});
const LogInStack = createStackNavigator({LogIn: LogInScreen});
const SignUpStack = createStackNavigator({SignUp: SignUpScreen});
const MessageStack = createStackNavigator({Message: MessageScreen});

export default createAppContainer(createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
    AuthLoading: AuthLoadingStack,
    LogIn: LogInStack,
    SignUp: SignUpStack,
    Message: MessageStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));