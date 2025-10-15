import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

type Diamond = {
  baseX: number;
  baseY: number;
  offsetX: Animated.Value;
  offsetY: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  size: number;
  color: string;
  driftRangeX: number;
  driftRangeY: number;
  driftDuration: number;
  pulseDuration: number;
  fadeDuration: number;
};

export default function LavenderBackground() {
  const COLORS = [
    "#9370DB", // medium purple
    "#D8BFD8", // thistle (soft lavender)
    "#7B68EE", // medium slate blue
    "#6A5ACD", // slate blue (slightly deeper)
    "#836FFF", // slate blue light-ish, pure purple
  ];

  const diamonds = useRef<Diamond[]>(
    Array.from({ length: 40 }).map(() => {
      const baseX = Math.random() * width;
      const baseY = Math.random() * height;
    
const size = Math.random() < 0.4 ? Math.random() * 40 + 25 : Math.random() * 20 + 8;
      const opacity = Math.random() * 0.5 + 0.2;

      return {
        baseX,
        baseY,
        offsetX: new Animated.Value(0),
        offsetY: new Animated.Value(0),
        scale: new Animated.Value(1),
        opacity: new Animated.Value(opacity),
        size,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        driftRangeX: 4 + Math.random() * 8,
        driftRangeY: 2 + Math.random() * 4,
        driftDuration: 3000 + Math.random() * 4000,
        pulseDuration: 2500 + Math.random() * 2000,
        fadeDuration: 4000 + Math.random() * 4000,
      };
    })
  ).current;

  useEffect(() => {
    diamonds.forEach((d) => {
      // X wiggle
      Animated.loop(
        Animated.sequence([
          Animated.timing(d.offsetX, {
            toValue: d.driftRangeX,
            duration: d.driftDuration,
            useNativeDriver: true,
          }),
          Animated.timing(d.offsetX, {
            toValue: -d.driftRangeX,
            duration: d.driftDuration * 2,
            useNativeDriver: true,
          }),
          Animated.timing(d.offsetX, {
            toValue: 0,
            duration: d.driftDuration,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Y wiggle
      Animated.loop(
        Animated.sequence([
          Animated.timing(d.offsetY, {
            toValue: d.driftRangeY,
            duration: d.driftDuration * 1.2,
            useNativeDriver: true,
          }),
          Animated.timing(d.offsetY, {
            toValue: -d.driftRangeY,
            duration: d.driftDuration * 2,
            useNativeDriver: true,
          }),
          Animated.timing(d.offsetY, {
            toValue: 0,
            duration: d.driftDuration * 1.2,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [diamonds]);

  return (
    <View style={styles.container}>
      {diamonds.map((d, i) => (
        <Animated.View
          key={i}
          style={[
            styles.diamond,
            {
              left: d.baseX,
              top: d.baseY,
              width: d.size,
              height: d.size,
              backgroundColor: d.color,
              opacity: d.opacity,
              transform: [
                { translateX: d.offsetX },
                { translateY: d.offsetY },
                { rotate: "45deg" },
                { scale: d.scale },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6FA",
  },
  diamond: {
    position: "absolute",
    borderRadius: 4,
  },
});
