import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GlowBorderProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: ViewStyle | ViewStyle[];
  borderRadius?: number;
  glowHeight?: number;
  visible?: boolean;
  onSuccessfulUpdate: (booth_uuid: string) => void;
}

const GlowBorder: React.FC<GlowBorderProps> = ({
  children,
  color = "#B497FF",
  style,
  borderRadius = 12,
  glowHeight = 0.95,
  visible = false,
  onSuccessfulUpdate,
}) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      glowAnim.setValue(0);
      onSuccessfulUpdate("");
      return;
    }

    glowAnim.setValue(0);

    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSuccessfulUpdate("");
    });
  }, [visible]);

  return (
    <View
      style={[
        { position: "relative", borderRadius, alignSelf: "stretch" },
        style,
      ]}
    >
      {visible && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            overflow: "hidden",
            borderRadius,
          }}
        >
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              top: `${(1 - glowHeight) * 50}%`,
              bottom: `${(1 - glowHeight) * 50}%`,
              opacity: glowAnim,
              borderRadius, // crucial: ensures the Animated gradient respects corners
            }}
          >
            <LinearGradient
              colors={[color, "transparent"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ ...StyleSheet.absoluteFillObject, borderRadius }}
            />
          </Animated.View>
        </View>
      )}

      {/* Content */}
      <View style={{ borderRadius, overflow: "hidden" }}>{children}</View>
    </View>
  );
};

export default GlowBorder;
