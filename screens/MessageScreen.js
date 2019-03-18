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

    componentDidMount() {
        
        // Firestoreの「messages」コレクションを参照
        this.ref = firestore.collection('messages');
    
        // refの更新時イベントにonCollectionUpdate登録
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }

    
    // componentWillMount() {

        /*
        firestore.collection('messages').onSnapshot((doc) => {
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
        });
        */

        // test: 初めにメッセージを登録しておく
        /*
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
        */

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
    // }

    componentWillunmount() {
        // onCollectionUpdateの登録解除
        this.unsubscribe();
    }

    onSend = (messages = []) => {

        // Firestoreのコレクションに追加
        messages.forEach((message) => {
            this.ref.doc().add(message);
        });
    
        // onCollectionUpdateが呼ばれるので、ここではstateには渡さない
        //this.setState((previousState) => ({
        //  messages: GiftedChat.append(previousState.messages, messages),
        //}));
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
  
    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend= {this.onSend}
                user={{
                    _id: 'aaa@gmail.com',
                    name: 'ryuya'
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