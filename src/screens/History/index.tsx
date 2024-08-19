import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, ScrollView, TouchableOpacity, Alert, Pressable } from 'react-native';
import { HouseLine, Trash } from 'phosphor-react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { Header } from '../../components/Header';
import { HistoryCard, HistoryProps } from '../../components/HistoryCard';

import { styles } from './styles';
import { historyGetAll, historyRemove } from '../../storage/quizHistoryStorage';
import { Loading } from '../../components/Loading';
import Animated, { Layout, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { THEME } from '../../styles/theme';

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<HistoryProps[]>([]);

  const { goBack } = useNavigation();

  const swipableRefs = useRef<Swipeable[]>([]);

  async function fetchHistory() {
    const response = await historyGetAll();
    setHistory(response);
    setIsLoading(false);
  }

  async function remove(id: string) {
    await historyRemove(id);

    fetchHistory();
  }

  function handleRemove(id: string, index: number) {
    Alert.alert(
      'Remover',
      'Deseja remover esse registro?',
      [
        {
          text: 'Sim', onPress: () => remove(id)
        },
        { text: 'Não', style: 'cancel' }
      ]
    );

    swipableRefs.current[index].close();
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <Header
        title="Histórico"
        subtitle={`Seu histórico de estudos${'\n'}realizados`}
        icon={HouseLine}
        onPress={goBack}
      />

      <ScrollView
        contentContainerStyle={styles.history}
        showsVerticalScrollIndicator={false}
      >
        {
          history.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={SlideInRight}
              exiting={SlideOutRight}
              layout={Layout.springify()}
            >
              {/*
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <HistoryCard data={item} />
              </TouchableOpacity>
              */}

              {/*
              <Swipeable
                ref={(ref) => {
                  if (ref) {
                    swipableRefs.current.push(ref);
                  }
                }}
                overshootLeft={false}
                containerStyle={styles.swipableContainer}
                renderLeftActions={() => (
                  <Pressable
                    style={styles.swipableRemove}
                    onPress={() => handleRemove(item.id, index)}>
                    <Trash size={32} color={THEME.COLORS.GRAY_100} />
                  </Pressable>
                )}
              >
                <HistoryCard data={item} />
              </Swipeable>
              */}

              <Swipeable
                ref={(ref) => {
                  if (ref) {
                    swipableRefs.current.push(ref);
                  }
                }}
                overshootLeft={false}
                containerStyle={styles.swipableContainer}
                leftThreshold={10}
                onSwipeableOpen={() => handleRemove(item.id, index)}
                renderRightActions={() => null}
                renderLeftActions={() => (
                  <View style={styles.swipableRemove} >
                    <Trash size={32} color={THEME.COLORS.GRAY_100} />
                  </View>
                )}
              >
                <HistoryCard data={item} />
              </Swipeable>

            </Animated.View>
          ))
        }
      </ScrollView>
    </View>
  );
}