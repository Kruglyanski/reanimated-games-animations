import React from 'react';
import { View, StyleSheet, Image, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const IMAGE_URL =
  'https://img.goodfon.ru/original/1920x1080/d/1c/smailiki-zheltye-shary-ulybki.jpg';

const GRID_SIZE = 3;

// массив частей паззла с их id и координатами в сетке (row, col)
const pieces = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
  const row = Math.floor(i / GRID_SIZE); // номер строки в сетке
  const col = i % GRID_SIZE; // номер колонки в сетке
  return { id: i, row, col };
});

export default function Puzzle() {
  const { width, height } = useWindowDimensions();

  const GAP = 10; // Отступы между паззлом и частями

  // Вычисляем максимальную ширину одного тайла так, чтобы весь паззл помещался по ширине,
  // учитывая GAP между ними и по краям (GRID_SIZE + 1 промежутков)
  const maxTileWidth = (width - GAP * (GRID_SIZE + 1)) / GRID_SIZE;

  // Вычисляем сколько строк будет нужно для разбросанных кусочков снизу.
  const bottomRows = Math.ceil(pieces.length / GRID_SIZE);

  // Общее количество строк — верхняя сетка + нижние части
  const totalRows = GRID_SIZE + bottomRows;

  // Максимальная высота тайла, чтобы весь контент поместился по высоте с учетом GAP между строками
  const maxTileHeight = (height - GAP * (totalRows + 1)) / totalRows;

  // Итоговый размер тайла — минимальный из высоты и ширины, чтобы сохранить квадратную форму
  const TILE_SIZE = Math.floor(Math.min(maxTileWidth, maxTileHeight));

  // Отступ сверху для области сборки паззла
  const offsetTop = GAP;

  // Нижняя зона начинается сразу после области сборки плюс GAP
  const offsetBottom = offsetTop + TILE_SIZE * GRID_SIZE + GAP;

  // Правильные позиции для каждой части паззла в области сборки
  // Координаты сдвигаются на offsetTop, чтобы учитывать верхний отступ
  const correctPositions = pieces.map(p => ({
    x: p.col * TILE_SIZE,
    y: p.row * TILE_SIZE + offsetTop,
  }));

  return (
    <View style={styles.container}>
      {/* Область сборки паззла (поля) */}
      <View
        style={{
          position: 'absolute',
          top: offsetTop,
          left: (width - TILE_SIZE * GRID_SIZE) / 2, // центрируем по горизонтали
          width: TILE_SIZE * GRID_SIZE, // ширина поля = размер тайла * количество тайлов
          height: TILE_SIZE * GRID_SIZE, // высота поля
          flexDirection: 'row', // компоненты располагаются в строку
          flexWrap: 'wrap', // перенос на новую строку для формирования сетки
        }}
      >
        {/* Рисуем пустые слоты для паззла с рамками */}
        {pieces.map(piece => (
          <View
            key={`slot-${piece.id}`}
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              borderWidth: 1,
              borderColor: 'gray',
            }}
          />
        ))}
      </View>

      {/* Разбросанные кусочки паззла для перетаскивания */}
      {pieces
        .slice() // создаем копию массива, чтобы не мутировать исходный
        .sort(() => Math.random() - 0.5) // перемешиваем случайно
        .map((piece, index) => (
          <PuzzlePiece
            key={piece.id}
            piece={piece}
            imageUri={IMAGE_URL}
            // Начальные координаты для разбросанных частей:
            // По горизонтали: отступ слева + позиция в сетке снизу (по остатку от деления на GRID_SIZE)
            initialX={
              (width - TILE_SIZE * GRID_SIZE) / 2 +
              (index % GRID_SIZE) * TILE_SIZE
            }
            // По вертикали: ниже области сборки + номер строки снизу * размер тайла
            initialY={offsetBottom + Math.floor(index / GRID_SIZE) * TILE_SIZE}
            // Правильные координаты для «прилипания» части на поле
            correctX={
              correctPositions[piece.id].x + (width - TILE_SIZE * GRID_SIZE) / 2
            }
            correctY={correctPositions[piece.id].y}
            tileSize={TILE_SIZE} // передаем размер тайла
          />
        ))}
    </View>
  );
}

function PuzzlePiece({
  piece,
  imageUri,
  initialX,
  initialY,
  correctX,
  correctY,
  tileSize,
}: {
  piece: { id: number; row: number; col: number };
  imageUri: string;
  initialX: number;
  initialY: number;
  correctX: number;
  correctY: number;
  tileSize: number;
}) {
  const x = useSharedValue(initialX);
  const y = useSharedValue(initialY);

  // указывает, что кусочек уже «прилип» к правильному месту
  const isSnapped = useSharedValue(false);

  // Определяем жест перетаскивания
  const gesture = Gesture.Pan()
    .onUpdate(e => {
      if (isSnapped.value) return; // если часть уже на месте — игнорируем движение
      // Обновляем позицию, добавляя смещение пальца к начальному положению
      x.value = initialX + e.translationX;
      y.value = initialY + e.translationY;
    })
    .onEnd(() => {
      // При завершении жеста вычисляем расстояние до правильной позиции
      const dx = x.value - correctX;
      const dy = y.value - correctY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Если расстояние меньше трети размера тайла — «прилипать» к месту
      if (distance < tileSize / 3) {
        // Анимируем позицию к правильной с эффектом пружины
        x.value = withSpring(correctX);
        y.value = withSpring(correctY);
        isSnapped.value = true; // помечаем как собранный кусочек
      } else {
        // Иначе возвращаем назад на стартовую позицию с пружинной анимацией
        x.value = withSpring(initialX);
        y.value = withSpring(initialY);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value,
    top: y.value,
    width: tileSize,
    height: tileSize,
    zIndex: isSnapped.value ? 0 : 100, // поднимаем поверх, если ещё не собран
  }));

  // Вычисляем смещение картинки, чтобы показать только нужный кусочек:
  // сдвигаем всю картинку в противоположную сторону по колонке и ряду
  const offsetX = -piece.col * tileSize;
  const offsetY = -piece.row * tileSize;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.piece, animatedStyle]}>
        <Image
          source={{ uri: imageUri }}
          style={{
            width: tileSize * GRID_SIZE, // ширина всей картинки
            height: tileSize * GRID_SIZE, // высота всей картинки
            // сдвигаем картинку, чтобы показать только кусочек паззла
            transform: [{ translateX: offsetX }, { translateY: offsetY }],
          }}
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  piece: {
    overflow: 'hidden', // обрезаем содержимое за пределами тайла (чтобы показать только кусок картинки)
    position: 'absolute', // абсолютное позиционирование для свободного движения
  },
});
