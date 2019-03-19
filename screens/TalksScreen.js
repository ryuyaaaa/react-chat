import React from 'react';
import { AsyncStorage, Button, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';

const firestore = require('../firebase').db;

export default class LinksScreen extends React.Component {

    constructor(props) {
        super(props);

        this._getUid();

        this.state = {
            rooms: [],
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

    componentDidMount() {
        // Firestoreの「rooms」コレクションを参照
        this.roomsRef = firestore.collection('rooms');
    
        // roomsRefの更新時イベントにonCollectionUpdate登録
        this.unsubscribe = this.roomsRef.onSnapshot(this.onCollectionUpdate);
    }

    componentWillunmount() {
        // onCollectionUpdateの登録解除
        this.unsubscribe();
    }

    // firestoreのコレクションが更新された時のイベント
    onCollectionUpdate = (querySnapshot) => {

        var rooms = [];
        querySnapshot.docs.forEach((doc) => {
            if (doc.data().from == this.uid) {
                rooms.push(doc.data());
            }
        });
    
        // roomsをstateに渡す
        this.setState({ rooms: rooms });
    }

    addTalkRoom = (to) => {
        // Firestoreのコレクションに追加
        var data = {
            from: this.uid,
            to: to,
        }
        this.roomsRef.add(data);
    }

    _getUid = async() => {
        try {
            this.uid = await AsyncStorage.getItem('uid');
        } catch(error) {
            console.log(error);
        }
    }

    _moveToMessage = async(to) => {
        try {
            await AsyncStorage.setItem('messageTo', to);
        } catch(error) {
            console.log(error);
        }
        this.props.navigation.navigate('Message');
    }

    render() {
        return ( 
            <Container>
                <Content>
                    <List>
                        {this.state.rooms.map((room) =>
                            
                            <ListItem avatar onPress={() => this._moveToMessage(room.to)}>
                                <Left>
                                    <Thumbnail source={require('../assets/images/celine-farach.jpg')} />
                                </Left>
                                <Body>
                                    <Text>{room.to}</Text>
                                    <Text note>I love Ryuya.......</Text>
                                </Body>
                                <Right>
                                    <Text note>3:43 pm</Text>
                                </Right>
                            </ListItem>
                            
                        )}
                    </List>
                </Content>

                <Button title='追加' onPress={() => {this.addTalkRoom('aaa@gmail.com')}}/>
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
