import React, { useEffect, useState } from 'react';
import { View, Text, Button, Linking, StyleSheet } from 'react-native';
export const EmailVerification = ({ route, navigation }: any) => {
  const { email } = route.params;
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState('Waiting for email verification...');


  const resendEmail = async () => {
 
  };

  return (

    <View style={styles.container}>
      <Text style={styles.message}>
        {verified ? 'Email verified! Redirecting...' : message}
      </Text>
      <Button title="Resend Email" onPress={resendEmail} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // vertical center
    alignItems: 'center',     // horizontal center
    padding: 24,
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default EmailVerification;
