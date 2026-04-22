import { AppButton, AppTextField } from '@/components/app/controls';
import type { BookmarkInput } from '@/features/bookmarks/types';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type BookmarkFormProps = {
  initialValue?: BookmarkInput;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (value: BookmarkInput) => Promise<void>;
};

export function BookmarkForm({ initialValue, submitLabel, loading, onSubmit }: BookmarkFormProps) {
  const [url, setUrl] = useState(initialValue?.url ?? '');
  const [description, setDescription] = useState(initialValue?.description ?? '');

  const isValid = useMemo(() => {
    const normalized = url.trim();
    return /^https?:\/\//i.test(normalized) && description.trim().length > 0;
  }, [url, description]);

  async function handleSubmit() {
    if (!isValid || loading) {
      return;
    }

    await onSubmit({
      url: url.trim(),
      description: description.trim(),
    });
  }

  return (
    <View style={styles.form}>
      <AppTextField
        label="URL"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        keyboardType="url"
        placeholder="https://example.com"
      />
      <AppTextField
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Why this bookmark matters"
      />
      <AppButton label={submitLabel} onPress={handleSubmit} loading={loading} disabled={!isValid} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
});
