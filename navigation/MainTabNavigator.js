import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
// import HomeScreen from '../screens/HomeScreen';
// import LinksScreen from '../screens/LinksScreen';
import FriendsScreen from '../screens/FriendsScreen';
import TalksScreen from '../screens/TalksScreen';
import SettingsScreen from '../screens/SettingsScreen';

/*
const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};
*/

const FriendsStack = createStackNavigator({
  Friends: FriendsScreen,
});

FriendsStack.navigationOptions = {
  tabBarLabel: '友達',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-person'
          : 'md-person'
      }
    />
  ),
};

const TalksStack = createStackNavigator({
  Talks: TalksScreen,
});

TalksStack.navigationOptions = {
  tabBarLabel: '会話',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-chatbubbles' : 'md-chatbubbles'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: '設定',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'}
    />
  ),
};

export default createBottomTabNavigator({
  FriendsStack,
  TalksStack,
  SettingsStack,
});
