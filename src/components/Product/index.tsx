import React from 'react';
import firestore from '@react-native-firebase/firestore';

import { ButtonIcon } from '../ButtonIcon';
import { Container, Info, Title, Quantity, Options } from './styles';

export type ProductProps = {
  id: string;
  description: string;
  quantity: number;
  done: boolean;
}

type Props = {
  data: ProductProps;
}

export function Product({ data }: Props) {

  // atualizar documento da colecao PRODUCTS
  function handleDoneToggle() {
    firestore()
      .collection('products')
      .doc(data.id)
      .update({
        done: !data.done
      });
  }

  // deletar documento da colecao PRODUCTS
  function handleDelete() {
    firestore()
      .collection('products')
      .doc(data.id)
      .delete();
  }

  return (
    <Container>
      <Info>
        <Title done={data.done}>
          {data.description}
        </Title>

        <Quantity>
          Quantidade: {data.quantity}
        </Quantity>
      </Info>

      <Options>
        <ButtonIcon
          icon={data.done ? "undo" : "check"}
          onPress={handleDoneToggle}
        />

        <ButtonIcon
          icon="delete"
          color="alert"
          onPress={handleDelete}
        />
      </Options>
    </Container>
  );
}
