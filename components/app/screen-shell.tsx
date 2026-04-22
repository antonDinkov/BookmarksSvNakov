import { AppTheme } from '@/components/app/theme';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function ScreenShell({ title, subtitle, children }: ScreenShellProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 860;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.backgroundOrb, isWide && styles.backgroundOrbWide]} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.container, isWide && styles.containerWide]}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <View style={styles.content}>{children}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  backgroundOrb: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: '#dbeedc',
    opacity: 0.7,
  },
  backgroundOrbWide: {
    width: 340,
    height: 340,
    top: -100,
    right: 80,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    gap: AppTheme.spacing.sm,
  },
  containerWide: {
    marginTop: AppTheme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: AppTheme.colors.text,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: AppTheme.colors.textMuted,
    marginBottom: AppTheme.spacing.sm,
  },
  content: {
    gap: AppTheme.spacing.sm,
  },
});
