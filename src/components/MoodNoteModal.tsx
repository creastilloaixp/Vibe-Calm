import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MoodType, MOOD_DEFINITIONS } from '../types/mood';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface MoodNoteModalProps {
  visible: boolean;
  moodType: MoodType | null;
  onSave: (note: string) => void;
  onSkip: () => void;
  onClose: () => void;
}

export const MoodNoteModal: React.FC<MoodNoteModalProps> = ({
  visible,
  moodType,
  onSave,
  onSkip,
  onClose,
}) => {
  const [note, setNote] = useState('');

  const handleSave = () => {
    onSave(note);
    setNote('');
  };

  const handleSkip = () => {
    onSkip();
    setNote('');
  };

  const handleClose = () => {
    onClose();
    setNote('');
  };

  if (!moodType) return null;

  const moodDef = MOOD_DEFINITIONS[moodType];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
            <LinearGradient
              colors={[Colors.surface, Colors.background]}
              style={styles.modal}
            >
              <View style={styles.header}>
                <Text style={styles.emoji}>{moodDef.emoji}</Text>
                <Text style={styles.title}>Feeling {moodDef.label}</Text>
                <Text style={styles.subtitle}>
                  Want to add a note about how you're feeling?
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={note}
                  onChangeText={setNote}
                  placeholder="What's on your mind? (optional)"
                  placeholderTextColor={Colors.textTertiary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  autoFocus
                />
              </View>

              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={handleSkip}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonTextSecondary}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary]}
                  onPress={handleSave}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonTextPrimary}>
                    {note ? 'Save' : 'Continue'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modal: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadows.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
  },
  inputContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.textTertiary + '40',
  },
  input: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    padding: Spacing.md,
    minHeight: 100,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    ...Shadows.small,
  },
  buttonSecondary: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.textTertiary + '40',
  },
  buttonTextPrimary: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.surface,
  },
  buttonTextSecondary: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
});
