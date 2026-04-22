import { AppTheme } from '@/components/app/theme';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
};

export function AppButton({
  label,
  onPress,
  loading,
  variant = 'primary',
  disabled,
}: AppButtonProps) {
  const styleByVariant = {
    primary: styles.buttonPrimary,
    secondary: styles.buttonSecondary,
    danger: styles.buttonDanger,
  }[variant];

  const textStyleByVariant = {
    primary: styles.buttonTextPrimary,
    secondary: styles.buttonTextSecondary,
    danger: styles.buttonTextPrimary,
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        styleByVariant,
        pressed && styles.buttonPressed,
        (disabled || loading) && styles.buttonDisabled,
      ]}>
      {loading ? <ActivityIndicator color={AppTheme.colors.primaryText} /> : <Text style={[styles.buttonText, textStyleByVariant]}>{label}</Text>}
    </Pressable>
  );
}

type AppTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'url';
  multiline?: boolean;
};

export function AppTextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
  multiline,
}: AppTextFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholderTextColor="#8ba091"
      />
    </View>
  );
}

export function MessageBox({ message, tone = 'error' }: { message: string; tone?: 'error' | 'success' }) {
  return (
    <View style={[styles.messageBox, tone === 'error' ? styles.messageError : styles.messageSuccess]}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    gap: 6,
  },
  fieldLabel: {
    color: AppTheme.colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: AppTheme.colors.text,
    fontSize: 16,
  },
  inputMultiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: AppTheme.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPrimary: {
    backgroundColor: AppTheme.colors.primary,
  },
  buttonSecondary: {
    backgroundColor: AppTheme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  buttonDanger: {
    backgroundColor: AppTheme.colors.danger,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextPrimary: {
    color: AppTheme.colors.primaryText,
  },
  buttonTextSecondary: {
    color: AppTheme.colors.text,
  },
  messageBox: {
    borderRadius: AppTheme.radius.md,
    padding: 12,
  },
  messageError: {
    backgroundColor: '#fde8e8',
    borderColor: '#f2bcbc',
    borderWidth: 1,
  },
  messageSuccess: {
    backgroundColor: '#e6f7eb',
    borderColor: '#aeddba',
    borderWidth: 1,
  },
  messageText: {
    color: AppTheme.colors.text,
    fontSize: 14,
  },
});
