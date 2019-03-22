import React from 'react';
import { AsyncStorage, StyleSheet, View, Text, Modal, ActivityIndicator } from 'react-native';
import { Header } from 'react-native-elements'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Sae } from 'react-native-textinput-effects';
import Button from 'apsl-react-native-button';

const PORT = 'https://nameless-crag-96674.herokuapp.com/api/users/signup';

export default class LogInScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            modal: false,
        }
    }

    static navigationOptions = {
        header: <Header
                    placement="center"
                    centerComponent={{ text: '新規登録', style: { color: '#fff' } }}
                />,
    };

    render() {
        return(
            <View style={styles.body}>
                <Sae
                    label={'メールアドレス'}
                    iconClass={FontAwesomeIcon}
                    iconName={'pencil'}
                    iconColor={'#7fffd4'}
                    labelStyle={{ color: 'black', fontWeight: 'normal' }}
                    inputStyle={{ color: 'gray'}}
                    inputPadding={16}
                    labelHeight={24}
                    // active border height
                    borderHeight={2}
                    // TextInput props
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    textContentType={'emailAddress'}
                    onChangeText={(text) => this.setState({email: text})}
                />
                <Sae
                    label={'パスワード'}
                    iconClass={FontAwesomeIcon}
                    iconName={'pencil'}
                    iconColor={'#7fffd4'}
                    labelStyle={{ color: 'black', fontWeight: 'normal' }}
                    inputStyle={{ color: 'gray' }}
                    inputPadding={16}
                    labelHeight={24}
                    // active border height
                    borderHeight={2}
                    // TextInput props
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    textContentType={'password'}
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({password: text})}
                />

                <Button 
                    style={{backgroundColor: '#fff', borderColor: '#7fffd4', marginTop: 24, marginBottom: 24}}
                    textStyle={{fontSize: 18, color: '#7fffd4'}}
                    onPress={this.signUp}>
                    新規登録
                </Button>

                <Text style={{textAlign: 'right'}} onPress={() => this.props.navigation.navigate('LogIn')}>ログイン⇒</Text>

                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.modal}
                    onRequestClose={() => this.closeModal}>
                
                    <View style={styles.modalContainer}>
                        <ActivityIndicator size="large" color="#7fffd4" />
                    </View>

                </Modal>
             </View>
        );
    }

    signUp = () => {
        
        this.setState({modal:true});

        fetch(PORT, {
            method: 'POST',
            headers: {
                Accept: 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'uid': this.state.email,
                'email': this.state.email,
                'password': this.state.password
            }),
        })
        .then((response) => {
            response.json().then((json) => {
                if (json.uid != null) {
                    this.setUidToStorage(json.uid);
                    this.props.navigation.navigate('Main');
                } else {
                    this.setState({modal: false});
                }
            });          
        });
        
    }

    closeModal = () => {
        this.setState({modal:false});
    }

    setUidToStorage = async(uid) => {
        try {
            await AsyncStorage.setItem('uid', uid);
            this.props.navigation.navigate('Main');
        } catch(error) {
            console.log(error);
        }
    }
}

const styles = StyleSheet.create({
    body: {
      margin: 20,
      marginBottom: 200,
      padding: 20,
      flex: 1,
      borderStyle: 'solid',
      borderColor: '#7fffd4',
      borderWidth: 2,
      borderRadius: 20,
      backgroundColor: '#fff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
    },
  });
  