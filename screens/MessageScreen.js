import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, Button, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

var firestore = require('../firebase').db;

export default class Message extends React.Component {

    constructor(props) {
        super(props);

        this._getUid();

        this.state = {
            messages: [],
        }
    }

    componentDidMount() {
        
        // Firestoreの「messages」コレクションを参照
        this.ref = firestore.collection('messages');
    
        // refの更新時イベントにonCollectionUpdate登録
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }

    componentWillunmount() {
        // onCollectionUpdateの登録解除
        this.unsubscribe();
    }

    onSend = (messages = []) => {

        // Firestoreのコレクションに追加
        messages.forEach((message) => {
            var data = message;
            data.createdAt = message.createdAt.toISOString();
            this.ref.add(data);
        });
    }

    // firestoreのコレクションが更新された時のイベント
    onCollectionUpdate = (querySnapshot) => {
        
        // docsのdataをmessagesとして取得
        const messages = querySnapshot.docs.map((doc) => {
            return doc.data();
        });
    
        //this.state.messages.concat(messages);
        // messagesをstateに渡す
        this.setState({ messages });
    }

    _getUid = async() => {
        try {
            this.uid = await AsyncStorage.getItem('uid');
        } catch(error) {
            console.log(error);
        }
    }
  
    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend= {messages => this.onSend(messages)}
                user={{
                    _id: this.uid,
                    name: 'ryuya',
                    avatar: 'https://pbs.twimg.com/media/CsKCw7WVIAA-Ebe.jpg'
                }}
            />
        );
    }
}