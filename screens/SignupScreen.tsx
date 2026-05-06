import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { RootStackParamList } from "../navigation/types";

type SignupNavigation = NativeStackNavigationProp<RootStackParamList, "Signup">;

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation<SignupNavigation>();
  const registerMutation = useMutation(api.users.register);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please enter full name, email address, and password!");
      return;
    }

    try {
      const result = await registerMutation({
        fullName,
        email,
        password,
      });

      if (typeof result === "string") {
        const userId = result as Id<"users">;
        navigation.reset({
          index: 0,
          routes: [{ name: "Todo", params: { userId } }],
        });
        setFullName("");
        setEmail("");
        setPassword("");
      } else {
        Alert.alert("Sign Up Failed", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Unexpected error happened. Please try again!");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Header Section */}
      <View style={styles.header}>
        <Image
          source={require("./../assets/signup.webp")}
          style={styles.image}
        />
      </View>

      {/* 2. Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="john@gmail.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="*********"
          value={password}
          onChangeText={setPassword}
        />

        {/* <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-google" size={30} color="#DB4437" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-apple" size={30} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-facebook" size={30} color="#4267B2" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7D7AFF',
        paddingTop: 40,
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: '70%',
        width: '80%',
    },
    formContainer: {
        flex: 2,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        padding: 30,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#F0F0F0',
        padding: 15,
        borderRadius: 15,
        fontSize: 16,
    },
    // forgotText: {
    //     color: '#666',
    //     textAlign: 'right',
    //     marginTop: 10,
    // },
    signupButton: {
        backgroundColor: '#FFCC00',
        padding: 18,
        borderRadius: 15,
        marginTop: 30,
        alignItems: 'center',
    },
    signupButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    orText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialIcon: {
        backgroundColor: '#F0F0F0',
        padding: 15,
        borderRadius: 15,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    linkText: {
        color: '#FFCC00',
        fontWeight: 'bold',
    },
});
