import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Header } from 'react-native-elements';

export default class SettingsScreen extends React.Component {
    
    static navigationOptions = {
        header: <Header
                    placement="center"
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: '設定', style: { color: '#fff', fontWeight: 'bold' }}}
                    rightComponent={{ icon: 'search', color: '#fff' }}
                />,
    };

    render() {
        return (
            <View style={styles.container}>
                <Text>test comment</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
});