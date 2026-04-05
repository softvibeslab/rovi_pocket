import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { getApiBaseUrl } from "../lib/config";
import { palette, radii, spacing } from "../theme";

export function AuthScreen({
  loading,
  error,
  onLogin,
  onDemoMode,
}: {
  loading: boolean;
  error: string | null;
  onLogin: (email: string, password: string) => Promise<void>;
  onDemoMode: () => void;
}) {
  const [email, setEmail] = useState("carlos.mendoza@leadvibes.mx");
  const [password, setPassword] = useState("demo123");

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Rovi Pocket</Text>
        <Text style={styles.title}>Acceso del broker</Text>
        <Text style={styles.body}>
          Inicia sesion contra el backend actual o entra en modo demo para seguir validando el
          flujo Pocket.
        </Text>

        <View style={styles.fieldStack}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="broker@rovi.mx"
              placeholderTextColor={palette.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contrasena</Text>
            <TextInput
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="demo123"
              placeholderTextColor={palette.textMuted}
            />
          </View>
        </View>

        <View style={styles.hintCard}>
          <Text style={styles.hintTitle}>Credenciales demo</Text>
          <Text style={styles.hintBody}>carlos.mendoza@leadvibes.mx / demo123</Text>
          <Text style={styles.hintFoot}>Base URL actual: {getApiBaseUrl()}</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.actions}>
          <Pressable
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={() => onLogin(email, password)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#005d2c" />
            ) : (
              <Text style={styles.primaryButtonText}>Entrar con backend real</Text>
            )}
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={onDemoMode} disabled={loading}>
            <Text style={styles.secondaryButtonText}>Continuar en modo demo</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
    justifyContent: "center",
    padding: spacing.xl,
  },
  card: {
    borderRadius: 28,
    backgroundColor: palette.surfaceMuted,
    padding: spacing.xxl,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  eyebrow: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  title: {
    color: palette.text,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  body: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  fieldStack: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "700",
  },
  input: {
    minHeight: 50,
    borderRadius: radii.md,
    backgroundColor: palette.surface,
    paddingHorizontal: spacing.md,
    color: palette.text,
    fontSize: 14,
  },
  hintCard: {
    borderRadius: radii.md,
    backgroundColor: "#171c31",
    padding: spacing.md,
    gap: 4,
  },
  hintTitle: {
    color: palette.secondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  hintBody: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
  },
  hintFoot: {
    color: palette.textMuted,
    fontSize: 11,
  },
  errorText: {
    color: palette.danger,
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    gap: spacing.sm,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: radii.lg,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#005d2c",
    fontSize: 14,
    fontWeight: "900",
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: radii.lg,
    backgroundColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "800",
  },
});
