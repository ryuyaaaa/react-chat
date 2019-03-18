import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

var firestore = require('../firebase').db;

export default class Message extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            messages: [],
        }
    }

    
    componentWillMount() {

        firestore.collection("messages").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data());

                this.setState({
                    messages: this.state.messages.concat(
                        {
                            _id: doc.data().to,
                            text: doc.data().text,
                            createdAt: doc.data().createdAt.toDate(),
                            user: {
                                _id: doc.data().from,
                                avatar: 'https://pbs.twimg.com/media/CsKCw7WVIAA-Ebe.jpg',
                            }
                        }
                    )
                })
            });
        });

        /*
        this.setState({
            messages: [
                {
                    _id: 1, // to_id
                    text: 'こんにちは、りゅーやさん！今日もかっこいいですね!!!',
                    createdAt: new Date(),
                    user: {
                        _id: 'aaa@gmail.com',
                        name: 'みんみ', // メッセージを送信しているユーザ
                        avatar: 'https://pbs.twimg.com/media/CsKCw7WVIAA-Ebe.jpg',
                    },
                },
            ],
        })
        */
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
                    _id: 'aaa@gmail.com',
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