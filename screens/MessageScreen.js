import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, Button, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Header } from 'react-native-elements';
import v4 from 'uuid/v4';

const firestore = require('../firebase').db;
const storage = require('../firebase').storage;

export default class Message extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            image: require('../assets/images/celine-farach.jpg'),
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            header: <Header
                    placement="center"
                    leftComponent={{ text: '戻る', color: '#fff', onPress: () => navigation.goBack() }}
                    centerComponent={{ text: '会話', style: { color: '#fff', fontWeight: 'bold' }}}
                    rightComponent={{ icon: 'add', color: '#fff'}}
                />,
        };
    };

    componentDidMount() {

        // Firestoreの「messages」コレクションを参照
        this.messagesRef = firestore.collection('messages');

        // Storageのプロフィール画像を参照
        //this.imageRef = storage.ref('images/celine-farach.jpg');
        //this.getImage();

        this.uid = this.props.navigation.getParam('uid', null);
        this.toUid = this.props.navigation.getParam('toUid', null);

        // messagesRefの更新時イベントにonCollectionUpdate登録
        this.unsubscribe = this.messagesRef.onSnapshot(this.onCollectionUpdate);
    }

    componentWillunmount() {
        // onCollectionUpdateの登録解除
        this.unsubscribe();
        //this.imageRef();
    }

    onSend = (messages = []) => {

        // Firestoreのコレクションに追加
        messages.forEach((message) => {
            var data = message;
            data.to_id = this.toUid;
            data.createdAt = message.createdAt.toISOString();
            this.messagesRef.add(data);
            data = null;
        });
    }

    // firestoreのコレクションが更新された時のイベント
    onCollectionUpdate = (querySnapshot) => {
        
        var messages = [];
        querySnapshot.docs.forEach((doc) => {    
            if ((doc.data().user._id == this.uid && doc.data().to_id == this.toUid) || (doc.data().user._id == this.toUid && doc.data().to_id == this.uid)) {
                messages.push(doc.data());
            }
        });

        messages.sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            if (a.createdAt > b.createdAt) return -1;
            return 0;
        });
    
        // messagesをstateに渡す
        this.setState({ messages: messages });
    }

    /*
    getImage = () => {
        this.imageRef.getDownloadURL().then((url) => {
            this.setState({image: url});
        });
    }
    */

    generateId = () => {
        return v4();
    }

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: this.uid,
                    name: 'ryuya',
                    avatar: this.state.image,
                }}
                messageIdGenerator={this.generateId}  
            />
        );
    }
}