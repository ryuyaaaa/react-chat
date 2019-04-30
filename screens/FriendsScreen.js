import React from 'react';
import { AsyncStorage, StyleSheet, View, Image, Modal, Alert } from 'react-native';
import { Header, Input, SocialIcon } from 'react-native-elements';
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

const firestore = require('../firebase').db;
const storage = require('../firebase').storage;

export default class FriendsScreen extends React.Component {

    constructor(props) {
        super(props);

        this._getUid();

        this.state = {
            friends: [],
            users: [],
            modal: false,
            modal_to: '',
            modal_to_name: '',
            modal_to_comment: '',
            modal_to_twitter: '',
            modal_to_facebook: '',
            modal_to_instagram: '',
            modal_to_youtube: '',
            search: '',
            error: false,
            image: 'https://firebasestorage.googleapis.com/v0/b/react-native-chat-4a3b1.appspot.com/o/images%2Fceline-farach.jpg?alt=media&token=efd4b16b-c587-4970-9b03-1ae3a715ceea',
        }
    }
    
    static navigationOptions = {
        header: <Header
                    placement="center"
                    // leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: '友達', style: { color: '#fff', fontWeight: 'bold' }}}
                    // rightComponent={{ icon: 'add', color: '#fff'}}
                />,
    };
    
    async componentWillMount() {
        await Expo.Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
    }

    componentDidMount() {
        // Firestoreの「friends」コレクションを参照
        this.friendsRef = firestore.collection('friends');

        // Firestoreの「users」コレクションを参照
        this.usersRef = firestore.collection('users');

        // Firestoreの「rooms」コレクションを参照
        this.roomsRef = firestore.collection('rooms');

        // Storageのプロフィール画像を参照
        this.imageRef = storage.ref('images/celine-farach.jpg');

        this.getImage();
    
        // friendsRefの更新時イベントにonCollectionUpdate登録
        this.unsubscribeFriends = this.friendsRef.onSnapshot(this.onFriendsCollectionUpdate);

        // usersRefの更新時イベントにonCollectionUpdate登録
        this.unsubscribeUsers = this.usersRef.onSnapshot(this.onUsersCollectionUpdate);
    }

    componentWillUnmount() {
        // onCollectionUpdateの登録解除
        this.unsubscribeFriends();
        this.unsubscribeUsers();
    }

    // firestoreのFriendsコレクションが更新された時のイベント
    onFriendsCollectionUpdate = (querySnapshot) => {

        var friends = [];
        var friends_id = [];

        querySnapshot.docs.forEach((doc) => {
            if (doc.data().from == this.uid && !friends_id.includes(doc.data().to)) {
                friends.push(doc.data());
                friends_id.push(doc.data().to);
            }
        });
    
        // roomsをstateに渡す
        this.setState({ friends: friends });
    }

    // firestoreのUsersコレクションが更新された時のイベント
    onUsersCollectionUpdate = (querySnapshot) => {

        var users = [];
        querySnapshot.docs.forEach((doc) => {
            users.push(doc.data());
        });
    
        // usersをstateに渡す
        this.setState({ users: users });
    }

    _getUid = async() => {
        try {
            //await AsyncStorage.removeItem('uid');
            this.uid = await AsyncStorage.getItem('uid');
        } catch(error) {
            console.log(error);
        }
    }

    addFriend = (to) => {
        // Firestoreのコレクションに追加
        var data = {
            from: this.uid,
            to: to,
        }
        this.friendsRef.add(data);
    }

    checkUserExist = () => {

        var searchId = this.state.search;
        var error = true;
        
        if (searchId) {
            this.usersRef.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    if (doc.data()._id == searchId) {
                        error = false;
                    }
                });
            }).then(() => {
                this.setState({error: error});
                if (!error) {
                    //this.setState({modal: true});
                    this.addFriend(searchId);
                }
            });
        } else {
            this.setState({error: false});
        }
    }

    typesearch = (text) => {
        this.setState({search: text});
    }

    getImage = () => {
        this.imageRef.getDownloadURL().then((url) => {
            this.setState({image: url});
        });
    }

    addTalkRoom = (to) => {
        // Firestoreのコレクションに追加
        var data = {
            from: this.uid,
            to: to,
        }
        this.roomsRef.add(data);
    }

    openModal = (to, name, comment, twitter, facebook, instagram, youtube) => {
        this.setState({modal: true, modal_to: to, modal_to_name: name, modal_to_comment: comment, modal_to_twitter: twitter, modal_to_facebook: facebook, modal_to_instagram: instagram, modal_to_youtube: youtube});
    }

    closeModal = () => {
        this.setState({modal: false});
    }

    render() {
        return (
            <View style={styles.container}>

                <Modal
                    visible={this.state.modal}
                    animationType={'slide'}
                    onRequestClose={() => this.closeModal()}
                    transparent={true}
                >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={styles.modalContainer}>
                            <View style={{flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                                <Image source={{uri: this.state.image}} resizeMode={'cover'} style={{flex: 1, width: undefined, height: undefined}}/>
                            </View>
                            <View style={{position: 'absolute', top: 0, right: 0}}>
                                <Text style={{fontSize: 24}} onPress={() => this.closeModal()}>✖</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
                                    <View style={{borderBottomWidth: 1, borderBottomColor: 'gray'}}>
                                        <Text style={{fontSize: 30}}>{this.state.modal_to_name}</Text>
                                    </View>
                                </View>
                                <View style={{flex: 1.3, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text>{this.state.modal_to_comment}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}> 
                                <SocialIcon raised={false} type='twitter'/>
                                <SocialIcon raised={false} type='facebook'/>
                                <SocialIcon raised={false} type='instagram'/>
                                <SocialIcon raised={false} type='youtube'/>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Input
                    placeholder='追加するユーザのIDを入力'
                    leftIcon={
                        <Icon
                        name='search'
                        size={24}
                        color='gray'
                        />
                    }
                    onChangeText={this.typesearch}
                    value={this.state.search}
                    leftIconContainerStyle={{marginRight: 12}}
                    errorMessage={this.state.error? 'IDが存在しません' : null}
                    errorStyle={{color: 'red'}}
                    onSubmitEditing={this.checkUserExist}
                />
                
                <Container>
                    <Content>
                        <List>                          
                            {this.state.friends.map((friend, i) => {

                                var name = '';
                                var comment = '';
                                var user_id = '';
                                var twitter_url = '';
                                var facebook_url = '';
                                var instagram_url = '';
                                var youtube_url = '';

                                this.state.users.forEach((user) => {
                                    if (user._id == friend.to) {
                                        name = user.name;
                                        comment = user.comment;
                                        user_id = user._id;
                                        twitter_url = user.twitter_url;
                                        facebook_url = user.facebook_url;
                                        instagram_url = user.instagram_url;
                                        youtube_url = user.youtube_url;
                                    }
                                });

                                return (
                                    <ListItem thumbnail key={i} onPress={() => this.openModal(user_id, name, comment, twitter_url, facebook_url, instagram_url, youtube_url)}>
                                        <Left>
                                            <Thumbnail avatar source={{uri: this.state.image}}/>
                                        </Left>
                                        <Body>
                                            <Text>{name}</Text>
                                            <Text note numberOfLines={1}>{comment}</Text>
                                        </Body>
                                        <Right>
                                            <Button transparent onPress={() => this.addTalkRoom(friend.to)}>
                                                <Text>...</Text>
                                            </Button>
                                        </Right>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Content>
                </Container>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContainer: {
        width: '85%',
        height: 400,
        borderColor: 'black',
        borderWidth: 1
    },
});
