export {};

declare global {
  interface Window {
    /** Set by ShellLoadUX; replays the active theme's refresh effect. */
    __webxsidTriggerThemeFx?: () => void;
  }
}
