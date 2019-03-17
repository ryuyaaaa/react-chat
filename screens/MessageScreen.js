import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

const firebase = require('../firebase');
require("firebase/firestore");

export default class Message extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            messages: this._messages,
            typingMessage: ''
        };

        firebase.firestore().enablePersistence()
                        .then(() => {
                            // Initialize firestore
                            var db = firebase.firestore();
                        }).catch((err) => {
                            console.log(err);
                        });

        db.collection('uid').add({
            first: "Alan",
            middle: "Mathison",
            last: "Turing",
            born: 1912
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    componentWillMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'こんにちは、りゅーやさん！今日もかっこいいですね!!!',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'みんみ',
                        avatar: 'https://pbs.twimg.com/media/CsKCw7WVIAA-Ebe.jpg',
                    },
                },
            ],
        })
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
    }
  
    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 1,
                }}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        flex: 1,
        justifyContent: 'center',
    },
});