import React, { useState, useEffect } from 'react';
import { Alert, FlatList } from 'react-native';
import storage from '@react-native-firebase/storage';

import { Container, PhotoInfo } from './styles';
import { Header } from '../../components/Header';
import { Photo } from '../../components/Photo';
import { File, FileProps } from '../../components/File';

export function Receipts() {
  const [photos, setPhotos] = useState<FileProps[]>([]);
  const [photoSelected, setPhotoSelected] = useState('');
  const [photoInfo, setPhotoInfo] = useState('');

  // buscar imagem
  async function handleShowImage(path: string) {
    // pode buscar no banco a url q foi salvo já na tela upload
    const urlImage = await storage().ref(path).getDownloadURL();
    setPhotoSelected(urlImage);

    // pegar os dados da imagem
    const info = await storage().ref(path).getMetadata();
    setPhotoInfo(`Imagem selecionada: ${info.name}`);
    // setPhotoInfo(`Upload realizado em ${info.timeCreated}`);
  };

  // deletar imagem
  async function handleDeleteImage(path: string) {
    storage()
      .ref(path)
      .delete()
      .then(()=> {
        Alert.alert('Imagem excluída com sucesso!');
        fetchImages();
      })
      .catch(error => console.log(error));
  };

  // buscar e recarregar lista dos arquivos do storage
  async function fetchImages() {
    storage().ref('images').list().then(result => {
      const files: FileProps[] = [];

      result.items.forEach(file => {
        files.push({
          name: file.name,
          path: file.fullPath
        });
      });

      setPhotos(files);
    });
  };


  useEffect(() => {
    fetchImages();
  });

  return (
    <Container>
      <Header title="Comprovantes" />

      <Photo uri={photoSelected} />

      <PhotoInfo>
        {photoInfo}
      </PhotoInfo>

      <FlatList
        data={photos}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <File
            data={item}
            onShow={() => handleShowImage(item.path)}
            onDelete={() => handleDeleteImage(item.path)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', padding: 24 }}
      />
    </Container>
  );
}
