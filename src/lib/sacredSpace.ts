import { Platform, Linking } from 'react-native';

export type SacredSpacePlatform = 'ios' | 'android' | 'web';

export function getPlatform(): SacredSpacePlatform {
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  return 'web';
}

/**
 * iOS: Open Focus settings so user can create a Sacred Space focus.
 * There's no direct API to toggle Focus mode — we guide the user through setup.
 */
export async function openFocusSettings(): Promise<void> {
  if (Platform.OS === 'ios') {
    try {
      await Linking.openURL('App-Prefs:FOCUS');
    } catch {
      // Fallback to general settings
      await Linking.openSettings();
    }
  }
}

/**
 * Android: Open DND settings.
 * On Android, we can request ACCESS_NOTIFICATION_POLICY permission
 * to programmatically toggle DND.
 */
export async function openDndSettings(): Promise<void> {
  if (Platform.OS === 'android') {
    try {
      await Linking.sendIntent('android.settings.ZEN_MODE_SETTINGS');
    } catch {
      await Linking.openSettings();
    }
  }
}

export interface SetupStep {
  title: string;
  description: string;
  action?: () => Promise<void>;
  actionLabel?: string;
}

export function getSetupSteps(): SetupStep[] {
  const platform = getPlatform();

  if (platform === 'ios') {
    return [
      {
        title: 'Create a Focus',
        description: 'Open Settings > Focus > tap the + button. Name it "Sacred Space" or "Prayer."',
        action: openFocusSettings,
        actionLabel: 'Open Focus Settings',
      },
      {
        title: 'Configure Silence',
        description: 'Under "Silence Notifications From," choose to silence all people and all apps (or allow only emergency contacts).',
      },
      {
        title: 'Set Up Automation',
        description: 'Under your new Focus, tap "Add Schedule" > "App." Select Matins. Now your Focus will activate automatically when you open the app.',
      },
      {
        title: 'Done',
        description: 'When you open Matins, your phone will automatically enter Sacred Space — silencing distractions so you can be fully present in prayer.',
      },
    ];
  }

  if (platform === 'android') {
    return [
      {
        title: 'Grant DND Permission',
        description: 'Matins needs permission to toggle Do Not Disturb mode when you open the app.',
        action: openDndSettings,
        actionLabel: 'Open DND Settings',
      },
      {
        title: 'Allow Matins',
        description: 'In DND settings, find "Apps that can modify Do Not Disturb" and enable Matins.',
      },
      {
        title: 'Done',
        description: 'Matins will automatically enable Do Not Disturb when you begin an office, and restore your previous setting when you finish.',
      },
    ];
  }

  // Web fallback
  return [
    {
      title: 'Sacred Space on Web',
      description: 'On the web, Sacred Space is a visual reminder to silence your devices and be present. Consider putting your phone on Do Not Disturb before you begin.',
    },
  ];
}
