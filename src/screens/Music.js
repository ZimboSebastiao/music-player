import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, StatusBar } from "react-native";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Card, Text, Snackbar } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";

export default function Music() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentSound, setCurrentSound] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);

  useEffect(() => {
    async function loadAudioFiles() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão negada para acessar a biblioteca de mídia.");
        return;
      }

      let media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
      });

      let allAudioFiles = media.assets;
      while (media.hasNextPage) {
        media = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
          after: media.endCursor,
        });
        allAudioFiles = allAudioFiles.concat(media.assets);
      }

      setAudioFiles(allAudioFiles);
      // console.log(`Carregando ${allAudioFiles.length} arquivos de mídia.`);
      // console.log(allAudioFiles);
    }

    loadAudioFiles();
  }, []);

  async function playNextAudio() {
    if (!selectedAudio) return; // Não há música selecionada

    const currentIndex = audioFiles.findIndex(
      (item) => item.id === selectedAudio.id
    );
    const nextIndex = (currentIndex + 1) % audioFiles.length; // Volta ao início se for a última música

    const nextAudio = audioFiles[nextIndex];
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: nextAudio.uri });
      await soundObject.playAsync();
      setCurrentSound(soundObject);
      setSelectedAudio(nextAudio);
    } catch (error) {
      console.error("Erro ao reproduzir a próxima música:", error);
    }
  }

  async function playAudio(file) {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    }
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: file.uri });
      await soundObject.playAsync();
      setCurrentSound(soundObject);
      setSelectedAudio(file);
      soundObject.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          playNextAudio(); // Chama a próxima música quando a atual terminar
        }
      });
    } catch (error) {
      console.error("Erro ao reproduzir o áudio:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.textoView}>
          <Text style={styles.texto}>Todas as Músicas</Text>
          <Text style={styles.quantidade}>{audioFiles.length} Músicas</Text>
        </View>
        <FlatList
          data={audioFiles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.botao}>
              <Button
                style={[
                  styles.audioCard,
                  item === selectedAudio && styles.activeAudioCard,
                ]}
                mode="outlined"
                onPress={() => playAudio(item)}
                textColor="white"
                icon="music"
                contentStyle={styles.buttonContent}
              >
                {item.filename}

                {item === selectedAudio && (
                  <View style={styles.pauseIconContainer}>
                    {/* <FontAwesome name="pause" size={12} color="white" /> */}
                  </View>
                )}
              </Button>
            </View>
          )}
          ListEmptyComponent={<Text>Nenhuma música disponível.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    // padding: 10,
    backgroundColor: "#2E2E2E",
  },
  subContainer: {
    flex: 2,
    justifyContent: "center",
  },
  botao: {
    marginVertical: 6,
  },
  textoView: {
    padding: 10,
    fontSize: 20,
  },
  texto: {
    color: "white",
    fontSize: 20,
  },
  textoTitulo: {
    color: "white",
    fontSize: 13,
  },
  quantidade: {
    color: "#EBEBE6",
    fontSize: 14,
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "#2E2E2E",
    borderColor: "#2E2E2E",
  },
  cardTitulo: {
    // color: "white",
  },
  botaoTexto: {
    color: "white",
  },
  audioCard: {
    backgroundColor: "#2E2E2E",
    buttonColor: "#2E2E2E",
    borderColor: "#2E2E2E",
    textAlign: "left",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  activeAudioCard: {
    backgroundColor: "#1C1C1B",
  },
  // pauseIconContainer: {
  //   paddingLeft: 100,
  //   alignItems: "flex-end",
  // },
  buttonContent: {
    justifyContent: "flex-start",
  },
});
