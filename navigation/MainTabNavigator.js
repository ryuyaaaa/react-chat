import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import FriendsScreen from '../screens/FriendsScreen';
import TalksScreen from '../screens/TalksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MessageScreen from '../screens/MessageScreen'

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
  Message: MessageScreen,
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
