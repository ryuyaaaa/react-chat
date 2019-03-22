import React from 'react';
import { AsyncStorage, Image, View, StyleSheet, TextInput, Switch, Text, Alert } from 'react-native';
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
            switch_twitter: false,
            switch_facebook: false,
            switch_instagram: false,
            switch_youtube: false,
            image: 'https://firebasestorage.googleapis.com/v0/b/react-native-chat-4a3b1.appspot.com/o/images%2Fceline-farach.jpg?alt=media&token=efd4b16b-c587-4970-9b03-1ae3a715ceea',
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

    componentDidMount() {

        // Firestoreの「users」コレクションを参照
        this.usersRef = firestore.collection('users');
        // Storageを参照
        this.imageRef = storage.ref('images/celine-farach.jpg');
        this.getImage();

        // usersRefの更新時イベントにonCollectionUpdate登録
        this.unsubscribe = this.usersRef.onSnapshot(this.onCollectionUpdate);
    }

    componentWillunmount() {
        // onCollectionUpdateの登録解除
        this.unsubscribe();
    }

    // firestoreのコレクションが更新された時のイベント
    onCollectionUpdate = (querySnapshot) => {

        var name = '';
        var comment = '';
        querySnapshot.docs.forEach((doc) => {
            if (doc.data()._id == this.uid) {
                name = doc.data().name;
                comment = doc.data().comment;
            }
        });
    
        // name, commentをstateに渡す
        this.setState({ name: name, comment: comment });
    }

    typeName = (text) => {
        this.setState({name: text});
    }

    typeComment = (text) => {
        this.setState({comment: text});
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
        }
        this.usersRef.doc(this.uid).set(data);
    }

    getImage = () => {
        this.imageRef.getDownloadURL().then((url) => {
            this.setState({image: url});
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={{uri: this.state.image}} resizeMode={'cover'} style={{flex: 1, width: undefined, height: undefined}}/>
                </View>
                <View style={styles.body}>
                    
                    <View style={styles.info}>
                        <View style={{width: '100%'}}>
                            <View style={{backgroundColor: '#c0c0c0'}}>
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
                            <View style={{backgroundColor: '#c0c0c0'}}>
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
                    </View>

                    <View style={styles.contentsContainer}>
                        <View style={{backgroundColor: '#c0c0c0', margin: 8, marginBottom: 0}}>
                            <Text style={{fontSize: 16, color: 'white'}}>公開SNS</Text>
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        // backgroundColor: 'red',
    },
    header: {
        flex: 0.7,
        // backgroundColor: 'blue',
    },
    body: {
        flex: 1,
        // backgroundColor: 'green',
    },
    input: {
        fontSize: 20,
        margin: 8
    },
    info: {
        flex: 1,
        // backgroundColor: 'red',
        alignItems: 'center'
    },
    contentsContainer: {
        flex: 1
    },
    contents: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    contentsItem: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
});