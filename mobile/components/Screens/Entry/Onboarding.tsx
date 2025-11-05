import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

type OnboardingScreenProps = {
  navigation: any;
  session: boolean;
  OnFinish: () => void;
};

export default function OnboardingScreen(props: OnboardingScreenProps) {
  console.log("session during onboarding: ", props.session);
  const handleGetStarted = (event: GestureResponderEvent) => {
    props.OnFinish(); // Notify parent that onboarding is finished
    if (props.session) {
      props.navigation.navigate("MarketList");
      return;
    } else {
      props.navigation.navigate("Auth");
    }

    // navigation logic goes here
  };

  return (
    <ImageBackground
      source={require("../../../assets/onboarding.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.text}>
          Welcome to <Text style={styles.boldText}>Trinket ✨ </Text>
        </Text>
        <Text style={styles.subtext}>
          Discover, track, and organize your finds from every stall along the
          way
        </Text>

        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              {props.session
                ? "Welcome Back!"
                : "Get Started"}
            </Text>
            <View style={styles.arrowCircle}>
              <Text style={styles.arrow}>➔</Text>
            </View>
          </TouchableOpacity>

          {/* Spacer always reserves space for the sign-out area */}
          <View style={styles.signOutContainer}>
            {props.session && (
              <Text
                style={styles.signOutText}
              
              >
                Sign out
              </Text>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  bottomArea: {
    marginTop: "auto", // Push to bottom of overlay
    width: "100%",
    alignItems: "center",
  },
  text: {
    fontSize: 26,
    color: "#fff",
    textAlign: "center",
    fontFamily: "Avenir", // or any system/custom font
  },

  boldText: {
    fontWeight: "bold",
    fontFamily: "Avenir-Heavy", // optional: heavier weight if available
  },
  subtext: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#000000aa",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignSelf: "stretch",
    marginHorizontal: 10,
    marginBottom: 10, // spacing before sign-out area
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  signOutText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },

  signOutContainer: {
    height: 24, // ✅ reserves vertical space even if no sign-out text
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  buttonWithSignout: {
    backgroundColor: "#000000aa",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignSelf: "stretch",
    marginHorizontal: 10,
    marginTop: 40, // space between subtext and button
    marginBottom: 20, // leave room before "Sign out"
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  arrowCircle: {
    position: "absolute",
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  arrow: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
