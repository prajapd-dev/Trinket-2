import { useState, useEffect } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Button, TextInput } from 'react-native-paper'

import { AccountScreenNavigationProp } from '../Navigation/types'
import { CommonActions } from '@react-navigation/native'

 type AccountProps = {
  navigation: AccountScreenNavigationProp;
  session: boolean;
};


export default function Account({ navigation, session }: AccountProps) {

    return (
    <View>
      Account page
    </View>
  )
}

   

