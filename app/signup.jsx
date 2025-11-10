import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import { signup as apiSignup } from './lib/api';

export default function Signup() {
const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSignup = async () => {
    setError('');
    setLoading(true);
    try {
      await apiSignup({ email, password });
      router.replace('/login');
    } catch (e) {
      setError(e.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Sign up</Title>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        mode="outlined"
        />

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
        onPress={handleSignup}
        style={styles.button}
        contentStyle={{ paddingVertical: 8 }}
      >
        Sign up
      </Button>
      {!!error && <Title style={{ color: 'crimson', fontSize: 14, marginTop: 8 }}>{error}</Title>}
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
