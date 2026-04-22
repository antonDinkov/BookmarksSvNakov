import { AppButton, AppTextField, MessageBox } from '@/components/app/controls';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type AuthCredentialsFormProps = {
  submitLabel: string;
  loading?: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string | null;
};

export function AuthCredentialsForm({
  submitLabel,
  loading,
  onSubmit,
  error,
}: AuthCredentialsFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = useMemo(() => email.trim().length > 0 && password.length >= 6, [email, password]);

  async function handleSubmit() {
    if (!canSubmit || loading) {
      return;
    }

    await onSubmit(email.trim(), password);
  }

  return (
    <View style={styles.form}>
      {error ? <MessageBox message={error} /> : null}
      <AppTextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
      />
      <AppTextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        placeholder="Minimum 6 characters"
      />
      <AppButton label={submitLabel} onPress={handleSubmit} loading={loading} disabled={!canSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
});
