// log-in  version 2.3
// the final look with left-right section
// focus on web (Expo Router + React Native Web)

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { login as apiLogin } from './lib/api';

export default function LoginWeb() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await apiLogin({ email, password });
      router.replace('/dashboard');
    } catch (e) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.page, Platform.OS === 'web' && { minHeight: '100vh' }]}>
      {/* LEFT SECTION - image  */}
      <View style={styles.leftPane}>
        <ImageBackground
          source={require('../assets/images/meal-leftpic.png')}
          resizeMode="cover"
          style={styles.hero}
          imageStyle={{ opacity: 0.9 }}
        />
      </View>


      {/* RIGHT SECTION - log-in progess */}
      <View style={styles.rightPane}>
        <View style={styles.card}>

          {/* logo and title  */}
          <View style={styles.logoRow}>
            <Image
              source={require('../assets/images/nourishlylogonoears.png')}
              style={{ width: 40, height: 40, marginRight: 10 }}
              resizeMode="contain"
            />
            <Text style={styles.brand}>Nourishly</Text>
          </View>

          <Text style={styles.title}>Log in</Text>


          {/* email input */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            mode="flat"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            theme={{ colors: { background: '#f1f1f1' } }}   // adjust color to fit the contrast
          />


          {/* password input */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            mode="flat"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            theme={{ colors: { background: '#f1f1f1' } }}   // adjust color to fit the contrast
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
                color="#9aa2a1" // adjust color to fit the contrast
              />
            }
          />

          <Text style={styles.forgot}>Forgot your password ?</Text>


          {/* login button */}
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.loginBtn}
            labelStyle={styles.loginBtnText}
            buttonColor="#6b9080"   // adjust color to fit the contrast
            // contentStyle={{ paddingVertical: 8 }}
          >
            Log in
          </Button>
          {!!error && <Text style={{ color: 'crimson', marginTop: 6 }}>{error}</Text>}


          {/* divider */}
          <View style={styles.dividerWrap}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>


          {/* other social log-in buttons */}
          <Button
            mode="outlined"
            style={styles.socialBtn}
            labelStyle={styles.socialText}
            icon={() => <MaterialCommunityIcons name="google" size={18} />}
            textColor="#6b6b6b"     // adjust color to fit the contrast
          >
            Continue with Google
          </Button>

          <Button
            mode="outlined"
            style={styles.socialBtn}
            labelStyle={styles.socialText}
            icon={() => <MaterialCommunityIcons name="facebook" size={18} color="#1877f2" />}
            textColor="#6b6b6b"     // adjust color to fit the contrast
          >
            Continue with Facebook
          </Button>


          {/* sign up (link) */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don’t have an account yet? </Text>
            <Text style={styles.signupLink}>Sign up</Text>
          </View>

          <Text style={styles.footer}>© Nourishly 2025 • Privacy • Terms</Text>
        </View>
      </View>
    </View>
  );
}


// adjust color to fit the contrast
const BEIGE = '#e8dccb';        // page background (right section)
const CARD_BG = '#ffffff';
const TEXT_MID = '#7a8a86';
const TEXT_LIGHT = '#9aa2a1';


//styling part
const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: BEIGE,
  },


  // left image column
  leftPane: {
    width: '50%',
    maxWidth: 720,
    minWidth: 580,
    backgroundColor: '#ddd',
  },
  hero: {
    flex: 1,
  },


  // right column
  rightPane: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },


  // card
  card: {
    width: 520,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  //log-in section
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  brand: {
    fontSize: 36,
    fontWeight: '700',
    color: '#6b9080',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6b9080',
    marginTop: 6,
    marginBottom: 12,
  },


  label: {
    fontSize: 14,
    color: TEXT_LIGHT,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
  },


  forgot: {
    textAlign: 'right',
    color: TEXT_LIGHT,
    fontSize: 12,
    marginTop: 8,
    marginBottom: 18,
  },


  loginBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    marginBottom: 18,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },


  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: TEXT_LIGHT,
    fontSize: 13,
    letterSpacing: 1,
  },


  socialBtn: {
    borderRadius: 12,
    marginTop: 10,
    borderColor: '#e0e0e0',
    backgroundColor: '#efe3ce',
  },
  socialText: {
    fontSize: 15,
    fontWeight: '500',
  },


  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  signupText: {
    color: TEXT_MID,
    fontSize: 14,
  },
  signupLink: {
    color: '#6b9080',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    color: TEXT_LIGHT,
    fontSize: 11,
    marginTop: 24,
  },
});
