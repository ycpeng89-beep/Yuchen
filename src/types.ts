
export enum AppState {
  WAITING = 'WAITING',
  BLOWING = 'BLOWING',
  EXTINGUISHED = 'EXTINGUISHED',
  CARD_SHOWN = 'CARD_SHOWN',
  CARD_OPENED = 'CARD_OPENED'
}

export interface SceneProps {
  appState: AppState;
  onExtinguish?: () => void;
}
