import { AsyncStorage } from 'react-native'

export async function setItem (key, value) {
  try {
    const saveValue = typeof value !== 'string' ? JSON.stringify(value) : value
    return await AsyncStorage.setItem(key, saveValue)
  } catch (error) {
    // console.error(`error setting key = ${key} with value = ${value} : ${error}`)
  }
}

export async function getItem (key) {
  try {
    const item = await AsyncStorage.getItem(key)
    return JSON.parse(item)
  } catch (error) {
    // console.error(`error getting key = ${key} : ${error}`)
  }
}

export async function removeItem (key) {
  try {
    return await AsyncStorage.removeItem(key)
  } catch (error) {
    // console.error(`error removing key = ${key} : ${error}`)
  }
}
