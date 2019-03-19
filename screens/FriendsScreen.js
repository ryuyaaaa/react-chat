import React from 'react';
import { AsyncStorage, StyleSheet, Button, Modal, View } from 'react-native';
import { Header, SearchBar } from 'react-native-elements';
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';

const firestore = require('../firebase').db;

export default class FriendsScreen extends React.Component {

    constructor(props) {
        super(props);

        this._getUid();

        this.state = {
            friends: [],
            users: [],
            modal: false,
            search: '',
        }
    }
    
    static navigationOptions = {
        header: <Header
                    placement="center"
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: '友達', style: { color: '#fff', fontWeight: 'bold' }}}
                    rightComponent={{ icon: 'add', color: '#fff'}}
                />,
    };

    componentDidMount() {
        // Firestoreの「friends」コレクションを参照
        this.friendsRef = firestore.collection('friends');

        // Firestoreの「users」コレクションを参照
        this.usersRef = firestore.collection('users');
    
        // friendsRefの更新時イベントにonCollectionUpdate登録
        this.unsubscribeFriends = this.friendsRef.onSnapshot(this.onFriendsCollectionUpdate);

        // usersRefの更新時イベントにonCollectionUpdate登録
        this.unsubscribeUsers = this.usersRef.onSnapshot(this.onUsersCollectionUpdate);
    }

    componentWillunmount() {
        // onCollectionUpdateの登録解除
        this.unsubscribeFriends();
        this.unsubscribeUsers();
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
            this.uid = await AsyncStorage.getItem('uid');
        } catch(error) {
            console.log(error);
        }
    }

    createAddModal = () => {
        this.setState({modal: true});
    }

    addFriend = (to) => {
        // Firestoreのコレクションに追加
        var data = {
            from: this.uid,
            to: to,
        }
        this.friendsRef.add(data);
    }

    closeModal = () => {
        this.setState({modal:false});
    }

    updateSearch = (search) => {
        this.setState({ search: search });
    };

    render() {
        return (
            <View style={styles.container}>

            <SearchBar
                placeholder='追加するメールアドレスを入力'
                onChangeText={this.updateSearch}
                value={this.state.search}
                containerStyle={{backgroundColor: 'white'}}
                round
                lightTheme
                inputStyle={{color: 'black'}}
            />
                
                <Container>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.modal}
                        onRequestClose={() => this.closeModal}>
                    
                        <View style={styles.modalContainer}>
                            <Text>test</Text>
                        </View>
                    </Modal>
                    <Content>
                        <List>
                            {/*                         
                            {this.state.friends.map((friend) => 
                                <ListItem thumbnail>
                                    <Left>
                                        <Thumbnail avatar source={require('../assets/images/celine-farach.jpg')} />
                                    </Left>
                                    <Body>
                                        <Text>Sankhadeep</Text>
                                        <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                                    </Body>
                                    <Right>
                                        <Button transparent>
                                            <Text>View</Text>
                                        </Button>
                                    </Right>
                                </ListItem>    
                            )} */}
                            {/*                         
                            <ListItem thumbnail>
                                <Left>
                                    <Thumbnail avatar source={require('../assets/images/celine-farach.jpg')} />
                                </Left>
                                <Body>
                                    <Text>Sankhadeep</Text>
                                    <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                                </Body>
                                <Right>
                                    <Button transparent>
                                        <Text>View</Text>
                                    </Button>
                                </Right>
                            </ListItem> */}
                        </List>
                    </Content> 
                    <Button title='push' onPress={() => {this.addFriend('bbb@gmail.com')}}/>  
                </Container>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});
