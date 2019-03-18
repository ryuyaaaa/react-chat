import React from 'react';
import { Image, View, StyleSheet, TextInput, Switch } from 'react-native';
import { Header, SocialIcon, Divider } from 'react-native-elements';
import { requireNativeViewManager } from 'expo-core';

export default class SettingsScreen extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            comment: '',
            switch_twitter: false,
            switch_facebook: false,
            switch_instagram: false,
            switch_youtube: false,
        }
    }
    static navigationOptions = {
        header: <Header
                    placement="center"
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: '設定', style: { color: '#fff', fontWeight: 'bold' }}}
                    rightComponent={{ icon: 'search', color: '#fff' }}
                />,
    };

    typeName = (text) => {
        this.setState({name: text});
    }

    typeComment = (text) => {
        this.setState({comment: text});
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={require('../assets/images/celine-farach.jpg')} resizeMode={'contain'} style={{flex: 1, width: undefined, height: undefined}}/>
                </View>
                <View style={styles.body}>
                    
                    <View style={styles.info}>
                        
                        <TextInput
                            style={styles.inputname}
                            placeholder='NAME'
                            value={this.state.name}
                            onChangeText={this.typeName}
                        />

                        <TextInput
                            style={styles.inputname}
                            placeholder='COMMENT'
                            value={this.state.comment}
                            onChangeText={this.typeComment}
                        />

                    </View>

                    <View style={styles.contents}>
                        <View style={styles.contentsItem}>
                            <SocialIcon raised={false} type='twitter'/>
                            <Switch value={this.state.switch_twitter} onValueChange={(value) => this.setState({switch_twitter: value})}/>
                        </View>
                        <View style={styles.contentsItem}>
                            <SocialIcon raised={false} type='facebook'/>
                            <Switch value={this.state.switch_facebook} onValueChange={(value) => this.setState({switch_facebook: value})}/>
                        </View>
                        <View style={styles.contentsItem}>
                            <SocialIcon raised={false} type='instagram'/>
                            <Switch value={this.state.switch_instagram} onValueChange={(value) => this.setState({switch_instagram: value})}/>
                        </View>
                        <View style={styles.contentsItem}>
                            <SocialIcon raised={false} type='youtube'/>
                            <Switch value={this.state.switch_youtube} onValueChange={(value) => this.setState({switch_youtube: value})}/>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        backgroundColor: 'red',
    },
    header: {
        flex: 1,
        backgroundColor: 'blue',
    },
    body: {
        flex: 1,
        backgroundColor: 'green',
    },
    inputname: {
        padding: 10,
        fontSize: 24
    },
    info: {
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center'
    },
    contents: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    contentsItem: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    }
});