import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';

export default function Login() {
const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // add logic here for login
    console.log('Loggin pressed');
    router.replace('/dashboard');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Login</Title>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        contentStyle={{ paddingVertical: 8 }}
      >
        Log In
      </Button>
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f9e4bc',
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});
