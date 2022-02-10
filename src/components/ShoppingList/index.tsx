import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { styles } from './styles';
import { Product, ProductProps } from '../Product';

export function ShoppingList() {
  const [products, setProducts] = useState<ProductProps[]>([]);

  // lista todos os documentos e fica ouvindo realtime
  useEffect(() => {
    const subscribe = firestore()
      .collection('products')
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as ProductProps[];

        setProducts(data);
      });

    // funcao de limpeza, pq onSnapshot fica ouvindo
    return () => subscribe();
  },[]);

  /*
  // lista documentos específicos pelo id
  useEffect(() => {
    firestore()
      .collection('products')
      .doc('id-do-documento')
      .get()
      .then(response => console.log({
        id: response.id,
        ...response.data()
      }));
  },[]);
  */

  /*
  // lista todos os documentos, mas não realtime
  useEffect(() => {
    firestore()
      .collection('products')
      .get()
      .then(response => {
        const data = response.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          };
        }) as ProductProps[];

        setProducts(data);
      })
      .catch(error => console.error(error));
  },[]);
  */

  /*
  // lista todos os documentos e fica ouvindo realtime
  // adicionando filtro com WHERE
  // adicionando limite com LIMIT
  // adicionando ordem com ORDERBY
  useEffect(() => {
    const subscribe = firestore()
      .collection('products')
      .orderBy('description', 'asc')
      .limit(2)
      .where('quantity', '>=', 3)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as ProductProps[];

        setProducts(data);
      });

    // funcao de limpeza, pq onSnapshot fica ouvindo
    return () => subscribe();
  },[]);
  */

  /*
  // filtro baseado em intervalo, precisa do orderby
  // startAt ou startAfter e endAt ou endBefore
  useEffect(() => {
    const subscribe = firestore()
      .collection('products')
      .orderBy('quantity')
      .startAfter(3)
      .endAt(8)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data()
          }
        }) as ProductProps[];

        setProducts(data);
      });

    // funcao de limpeza, pq onSnapshot fica ouvindo
    return () => subscribe();
  },[]);
  */

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <Product data={item} />}
      showsVerticalScrollIndicator={false}
      style={styles.list}
      contentContainerStyle={styles.content}
    />
  );
}
