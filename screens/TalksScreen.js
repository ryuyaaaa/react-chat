import React from 'react';
import { AsyncStorage, Button, StyleSheet, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';

const firestore = require('../firebase').db;
const storage = require('../firebase').storage;

export default class TalksScreen extends React.Component {

    constructor(props) {
        super(props);

        this._getUid();

        this.state = {
            rooms: [],
            messages: [],
            users: [],
            friends: [],
            messages: {},
            image: 'https://firebasestorage.googleapis.com/v0/b/react-native-chat-4a3b1.appspot.com/o/images%2Fceline-farach.jpg?alt=media&token=efd4b16b-c587-4970-9b03-1ae3a715ceea',
        }
    }

    static navigationOptions = {
        header: <Header
                    placement="center"
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: '会話', style: { color: '#fff', fontWeight: 'bold' }}}
                    rightComponent={{ icon: 'search', color: '#fff' }}
                />,
    };

    async componentWillMount() {
        await Expo.Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
    }

    componentDidMount() {
        // Firestoreの「rooms」コレクションを参照
        this.roomsRef = firestore.collection('rooms');

        // Firestoreの「messages」コレクションを参照
        this.usersRef = firestore.collection('users');

        // Firestoreの「friends」コレクションを参照
        this.friendsRef = firestore.collection('friends');

        // Firestoreの「messages」コレクションを参照
        this.messagesRef = firestore.collection('messages');

        // Storageのプロフィール画像を参照
        this.imageRef = storage.ref('images/celine-farach.jpg');
        this.getImage();
    
        // roomsRefの更新時イベントにonCollectionUpdate登録
        this.unsubscribeRooms = this.roomsRef.onSnapshot(this.onRoomsCollectionUpdate);

        // messagesRefの更新時イベントにonCollectionUpdate登録
        this.unsubscribeUsers = this.usersRef.onSnapshot(this.onUsersCollectionUpdate);

        // friendsRefの更新時イベントにonCollectionUpdate登録
        this.unsubscribeFriends = this.friendsRef.onSnapshot(this.onFriendsCollectionUpdate);

        // messagesRefの更新時イベントにonCollectionUpdate登録
        this.unsubscribeMessages = this.messagesRef.onSnapshot(this.onMessagesCollectionUpdate);
    }

    componentWillunmount() {
        // onCollectionUpdateの登録解除
        this.unsubscribeRooms();
        this.unsubscribeUsers();
        this.unsubscribeFriends();
        this.unsubscribeMessages();
    }

    // firestoreのroomsコレクションが更新された時のイベント
    onRoomsCollectionUpdate = (querySnapshot) => {

        var rooms = [];
        var rooms_id = [];

        querySnapshot.docs.forEach((doc) => {
            if (doc.data().from == this.uid && !rooms_id.includes(doc.data().to)) {
                rooms.push(doc.data());
                rooms_id.push(doc.data().to);
            }
        });
    
        // roomsをstateに渡す
        this.setState({ rooms: rooms });
    }

    // firestoreのusersコレクションが更新された時のイベント
    onUsersCollectionUpdate = (querySnapshot) => {

        var users = [];
        querySnapshot.docs.forEach((doc) => {
            users.push(doc.data());
        });
    
        // roomsをstateに渡す
        this.setState({ users: users });
    }

    // firestoreのFriendsコレクションが更新された時のイベント
    onFriendsCollectionUpdate = (querySnapshot) => {

        var friends = [];
        querySnapshot.docs.forEach((doc) => {
            if (doc.data().from == this.uid) {
                friends.push(doc.data());
            }
        });
    
        // roomsをstateに渡す
        this.setState({ friends: friends });
    }

    // firestoreのコレクションが更新された時のイベント
    onMessagesCollectionUpdate = (querySnapshot) => {
        
        var messages = {};
        querySnapshot.docs.forEach((doc) => {    

            // 自分が送ったメッセージまたは自分あてのメッセージを取得
            if (doc.data().user._id == this.uid) {
                if (!(doc.data().to_id in messages)) {
                    messages[doc.data().to_id] = []; 
                }
                messages[doc.data().to_id].push(doc.data());
            } else if (doc.data().to_id == this.uid) {
                if (!(doc.data().user._id in messages)) {
                    messages[doc.data().user._id] = [];
                    
                }
                messages[doc.data().user._id].push(doc.data());
            }
            // if ((doc.data().user._id == this.uid && doc.data().to_id == this.toUid) || (doc.data().user._id == this.toUid && doc.data().to_id == this.uid)) {
            //     messages.push(doc.data());
            // }
        });

        for (var key in messages) {
            messages[key].sort((a, b) => {
                if (a.createdAt < b.createdAt) return 1;
                if (a.createdAt > b.createdAt) return -1;
                return 0;
            });
        }

        // messages.sort((a, b) => {
        //     if (a.createdAt < b.createdAt) return 1;
        //     if (a.createdAt > b.createdAt) return -1;
        //     return 0;
        // });
    
        // messagesをstateに渡す
        this.setState({ messages: messages });
    }

    _getUid = async() => {
        try {
            this.uid = await AsyncStorage.getItem('uid');
        } catch(error) {
            console.log(error);
        }
    }

    _moveToMessage = async(to) => {
        /*
        try {
            await AsyncStorage.setItem('messageTo', to);
        } catch(error) {
            console.log(error);
        }
        */
        this.props.navigation.navigate('Message', {uid: this.uid, toUid: to});
    }

    getImage = () => {
        this.imageRef.getDownloadURL().then((url) => {
            this.setState({image: url});
        });
    }

    render() {
        return ( 
            <Container>
                <Content>
                    <List>
                        {this.state.rooms.map((room, i) => {
                            
                            var name = '';
                            var lastMessage = '';
                            var lastCreatedAt = '';

                            this.state.users.forEach((user) => {
                                if (room.to == user._id) {
                                    name = user.name;
                                }
                            });

                            for (var key in this.state.messages) {
                                if (room.to == key) {
                                    lastMessage = this.state.messages[key][0].text;
                                    lastCreatedAt = this.state.messages[key][0].createdAt;
                                }
                            }

                            return (
                                <ListItem avatar key={i} onPress={() => this._moveToMessage(room.to)}>
                                    <Left>
                                        <Thumbnail source={{uri: this.state.image}} />
                                    </Left>
                                    <Body>
                                        <Text>{name}</Text>
                                        {/* <Text note>Doing what you like will always keep you happy . .</Text> */}
                                        <Text note style={{flex: 1, marginTop: 5}}>{lastMessage.substr(0,34)}</Text>
                                    </Body>
                                    <Right>
                                        <Text note>{lastCreatedAt? Number(lastCreatedAt.substr(11,2))+9 + lastCreatedAt.substr(13,3) : ''}</Text>
                                    </Right>
                                </ListItem>
                            );
                        })}
                    </List>
                </Content>
            </Container>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
    },
});
