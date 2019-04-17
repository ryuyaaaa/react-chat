import React from 'react';
import { AsyncStorage, Image, View, StyleSheet, TextInput, Switch, Text, ScrollView, Alert } from 'react-native';
import { Header, SocialIcon } from 'react-native-elements';

const firestore = require('../firebase').db;
const storage = require('../firebase').storage;

export default class SettingsScreen extends React.Component {
    
    constructor(props) {
        super(props);

        this._getUid();

        this.state = {
            name: '',
            comment: '',
            twitter_url: '',
            facebook_url: '',
            instagram_url: '',
            youtube_url: '',
            switch_twitter: false,
            switch_facebook: false,
            switch_instagram: false,
            switch_youtube: false,
            image: 'https://firebasestorage.googleapis.com/v0/b/react-native-chat-4a3b1.appspot.com/o/images%2Fceline-farach.jpg?alt=media&token=efd4b16b-c587-4970-9b03-1ae3a715ceea',
        }
    }

    static navigationOptions = ({navigation}) => {

        logOut = async() => {
            try {
                await AsyncStorage.removeItem('uid');
            } catch(error) {
                console.log(error);
            }
            navigation.navigate('AuthLoading');
        }

        return {
            header: <Header
                    placement="center"
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: '設定', style: { color: '#fff', fontWeight: 'bold' }}}
                    rightComponent={{ text: 'ログアウト', style: {color: '#fff'}, onPress: logOut}}
                />,
        }
    };

    componentDidMount() {

        // Firestoreの「users」コレクションを参照
        this.usersRef = firestore.collection('users');
        // Storageを参照
        this.imageRef = storage.ref('images/celine-farach.jpg');
        this.getImage();

        // usersRefの更新時イベントにonCollectionUpdate登録
        this.unsubscribe = this.usersRef.onSnapshot(this.onCollectionUpdate);
    }

    componentWillUnmount() {
        // onCollectionUpdateの登録解除
        this.unsubscribe();
    }

    // firestoreのコレクションが更新された時のイベント
    onCollectionUpdate = (querySnapshot) => {

        var name = '';
        var comment = '';
        var twitter_url = '';
        var facebook_url = '';
        var instagram_url = '';
        var youtube_url = '';
        var switch_twitter = false;
        var switch_facebook = false;
        var switch_instagram = false;
        var switch_youtube = false;
        querySnapshot.docs.forEach((doc) => {
            if (doc.data()._id == this.uid) {
                name = doc.data().name;
                comment = doc.data().comment;
                twitter_url = doc.data().twitter_url;
                facebook_url = doc.data().facebook_url;
                instagram_url = doc.data().instagram_url;
                youtube_url = doc.data().youtube_url;
                switch_twitter = doc.data().switch_twitter;
                switch_facebook = doc.data().switch_facebook;
                switch_instagram = doc.data().switch_instagram;
                switch_youtube = doc.data().switch_youtube;
            }
        });
    
        // name, commentをstateに渡す
        this.setState({
            name: name,
            comment: comment,
            twitter_url: twitter_url,
            facebook_url: facebook_url,
            instagram_url: instagram_url,
            youtube_url: youtube_url,
            switch_twitter: switch_twitter,
            switch_facebook: switch_facebook,
            switch_instagram: switch_instagram,
            switch_youtube: switch_youtube,
        });
    }

    typeName = (text) => {
        this.setState({name: text});
    }

    typeComment = (text) => {
        this.setState({comment: text});
    }

    typeTwitter = (text) => {
        this.setState({twitter_url: text});
    }

    typeFacebook = (text) => {
        this.setState({facebook_url: text});
    }

    typeInstagram = (text) => {
        this.setState({instagram_url: text});
    }

    typeYoutube = (text) => {
        this.setState({youtube_url: text});
    }

    _getUid = async() => {
        try {
            this.uid = await AsyncStorage.getItem('uid');
        } catch(error) {
            console.log(error);
        }
    }

    saveProfile = () => {
        // Firestoreのコレクションに追加
        var data = {
            _id: this.uid,
            name: this.state.name,
            comment: this.state.comment,
            twitter_url: this.state.twitter_url,
            facebook_url: this.state.facebook_url,
            instagram_url: this.state.instagram_url,
            youtube_url: this.state.youtube_url,
            switch_twitter: this.state.switch_twitter,
            switch_facebook: this.state.switch_facebook,
            switch_instagram: this.state.switch_instagram,
            switch_youtube: this.state.switch_youtube
        }
        this.usersRef.doc(this.uid).set(data);
    }

    getImage = () => {
        this.imageRef.getDownloadURL().then((url) => {
            this.setState({image: url});
        });
    }

    changeSwitch = (value, num) => {
        switch (num % 10) {
            case 1:
                this.setState({switch_twitter: value});
                break;
            case 2:
                this.setState({switch_facebook: value});
                break;
            case 3:
                this.setState({switch_instagram: value});
                break;
            case 4:
                this.setState({switch_youtube: value});
                break;
            default:
                Alert.alert('Error');
                break;
        }
        this.saveProfile();
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{flex: 1}}>
                    <View style={styles.header}>
                        <Image source={{uri: this.state.image}} resizeMode={'cover'} style={{flex: 1, width: undefined, height: undefined}}/>
                    </View>
                    <View style={styles.body}>
                        
                        <View style={styles.info}>
                            <View style={{width: '100%'}}>
                                <View style={{backgroundColor: '#c0c0c0', margin: 8}}>
                                    <Text style={{fontSize: 16, color: 'white'}}>名前</Text>
                                </View>
                                <View style={{}}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='---NAME---'
                                        value={this.state.name}
                                        onChangeText={this.typeName}
                                        onEndEditing={this.saveProfile}
                                    />
                                </View>
                            </View>
                        
                            <View style={{width: '100%'}}>
                                <View style={{backgroundColor: '#c0c0c0', margin: 8}}>
                                    <Text style={{fontSize: 16, color: 'white'}}>ひとこと</Text>
                                </View>
                                <View style={{}}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='---COMMENT---'
                                        value={this.state.comment}
                                        onChangeText={this.typeComment}
                                        onEndEditing={this.saveProfile}
                                    />
                                </View>
                            </View>

                            <View style={{width: '100%', display: this.state.switch_twitter}}>
                                <View style={{backgroundColor: '#c0c0c0', margin: 8}}>
                                    <Text style={{fontSize: 16, color: 'white'}}>Twitter URL</Text>
                                </View>
                                <View style={{}}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='---Twitter URL---'
                                        value={this.state.twitter_url}
                                        onChangeText={this.typeTwitter}
                                        onEndEditing={this.saveProfile}
                                    />
                                </View>
                            </View>

                            <View style={{width: '100%', display: this.state.switch_facebook}}>
                                <View style={{backgroundColor: '#c0c0c0', margin: 8}}>
                                    <Text style={{fontSize: 16, color: 'white'}}>Facebook URL</Text>
                                </View>
                                <View style={{}}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='---Facebook URL---'
                                        value={this.state.facebook_url}
                                        onChangeText={this.typeFacebook}
                                        onEndEditing={this.saveProfile}
                                    />
                                </View>
                            </View>

                            <View style={{width: '100%', display: this.state.switch_instagram}}>
                                <View style={{backgroundColor: '#c0c0c0', margin: 8}}>
                                    <Text style={{fontSize: 16, color: 'white'}}>Instagram URL</Text>
                                </View>
                                <View style={{}}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='---Instagram URL---'
                                        value={this.state.instagram_url}
                                        onChangeText={this.typeInstagram}
                                        onEndEditing={this.saveProfile}
                                    />
                                </View>
                            </View>

                            <View style={{width: '100%', display: this.state.switch_youtube}}>
                                <View style={{backgroundColor: '#c0c0c0', margin: 8}}>
                                    <Text style={{fontSize: 16, color: 'white'}}>Youtube URL</Text>
                                </View>
                                <View style={{}}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder='---Youtube URL---'
                                        value={this.state.youtube_url}
                                        onChangeText={this.typeYoutube}
                                        onEndEditing={this.saveProfile}
                                    />
                                </View>
                            </View>

                        </View>
                    </View>
                </ScrollView>

                <View style={styles.contentsContainer}>
                    <View style={{backgroundColor: '#c0c0c0'}}>
                        <View style={{backgroundColor: '#c0c0c0'}}>
                            <Text style={{fontSize: 16, color: 'white'}}>公開SNS</Text>
                        </View>
                    </View>
                    <View style={styles.contents}>
                        <View style={styles.contentsItem}>
                            <SocialIcon raised={false} type='twitter'/>
                            <Switch value={this.state.switch_twitter} onValueChange={(value) => this.changeSwitch(value, 1)}/>
                        </View>
                        <View style={styles.contentsItem}>
                            <SocialIcon raised={false} type='facebook'/>
                            <Switch value={this.state.switch_facebook} onValueChange={(value) => this.changeSwitch(value, 2)}/>
                        </View>
                        <View style={styles.contentsItem}>
                            <SocialIcon raised={false} type='instagram'/>
                            <Switch value={this.state.switch_instagram} onValueChange={(value) => this.changeSwitch(value, 3)}/>
                        </View>
                        <View style={styles.contentsItem}>
                            <SocialIcon raised={false} type='youtube'/>
                            <Switch value={this.state.switch_youtube} onValueChange={(value) => this.changeSwitch(value, 4)}/>
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
        //backgroundColor: 'red',
    },
    header: {
        margin: 10,
        height: 200,
        //backgroundColor: 'blue',
    },
    body: {
        marginTop: 10,
        //backgroundColor: 'green',
    },
    input: {
        fontSize: 20,
        margin: 8
    },
    info: {
        flex: 1,
        //backgroundColor: 'red',
        alignItems: 'center'
    },
    contentsContainer: {
        flex: 0.3,
        margin: 10,
    },
    contents: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentsItem: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
