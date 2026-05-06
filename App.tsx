import { ConvexProvider, ConvexReactClient } from "convex/react";
import TodoScreen from "./screens/TodoScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import { useState } from "react";

import { Id } from "./convex/_generated/dataModel";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function App() {
  const [userId, setUserId] = useState<Id<"users"> | null>(null)
  const [authScreen, setAuthScreen] = useState<"login" | "signup">("login")

  return (
    <ConvexProvider client={convex}>
      {userId ? (
        <TodoScreen userId={userId} />
      ) : authScreen === "signup" ? (
        <SignupScreen
          onSignup={(id: Id<"users">) => setUserId(id)}
          onGoToLogin={() => setAuthScreen("login")}
        />
      ) : (
        <LoginScreen
          onLogin={(id: Id<"users">) => setUserId(id)}
          onGoToSignup={() => setAuthScreen("signup")}
        />
      )}
    </ConvexProvider>
  );
}
