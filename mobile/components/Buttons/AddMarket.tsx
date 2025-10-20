import React from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddMarket({onPressAddMarket}:any) {
  const insets = useSafeAreaInsets(); // Get bottom safe area
  return (
    <FAB
      icon="plus"
      style={[styles.fab, { bottom: 16 + insets.bottom }]} // padding above safe area
      onPress={onPressAddMarket}
      color="black"
      rippleColor="lavender"
    />
  );
}

const BUTTON_SIZE = 64; // Always square to stay circular

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2, // perfect circle
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
});