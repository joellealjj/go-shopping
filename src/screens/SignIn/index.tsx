import React, { useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

import { Container, Account, Title, Subtitle } from './styles';
import { ButtonText } from '../../components/ButtonText';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // login anonimo, sem email e senha
  async function handleSignInAnonymously() {
    const { user } = await auth().signInAnonymously();
    // console.log('user -->', user)
  }

  // criar nova conta com email e senha
  function handleCreateUserAccount() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => Alert.alert('Usuário criado com sucesso!'))
      .catch(error => {
        console.log('error de cadastro', error.code);

        if(error.code === 'auth/email-already-in-use') {
          return Alert.alert('E-mail já cadastrado.\nTente novamente com outro e-mail!');
        }

        if(error.code === 'auth/invalid-email') {
          return Alert.alert('E-mail inválido!');
        }

        if(error.code === 'auth/weak-password') {
          return Alert.alert('A deve ter no mínimo 6 caracteres!');
        }
      })
  }

  // logar com email e senha
  function handleSignInWithEmailAndPassword() {
    auth().signInWithEmailAndPassword(email, password)
    .then(({ user }) => console.log('user -->', user))
    .catch(error => {
      console.log('error de login', error.code);

      if(error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        Alert.alert('Usuário não encontrado.\nE-mail e/ou senha inválido!');
      }
    });
  }

  // recuperar senha com envio de e-mail
  function handleForgotPassword() {
    auth()
      .sendPasswordResetEmail(email)
      .then(() => Alert.alert('Foi enviado um link no seu email, para recuperar sua senha!'));

  }

  return (
    <Container>
      <Title>MyShopping</Title>
      <Subtitle>monte sua lista de compra te ajudar nas compras</Subtitle>

      <Input
        placeholder="e-mail"
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      <Input
        placeholder="senha"
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Entrar" onPress={handleSignInWithEmailAndPassword} />

      <Account>
        <ButtonText title="Recuperar senha" onPress={handleForgotPassword} />
        <ButtonText title="Criar minha conta" onPress={handleCreateUserAccount} />
      </Account>
    </Container>
  );
}