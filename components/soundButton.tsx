import styles from '../styles/Main.module.css';

type TSoundButtonProps = {
  disabled: boolean;
  onToggleSound: () => void;
  isSoundOn: boolean;
};

export const SoundButton = ({ disabled, onToggleSound, isSoundOn }: TSoundButtonProps) => {
  return (
    <button className={styles.soundToggle} disabled={disabled} onClick={onToggleSound}>
      {isSoundOn ? '🔊' : '🔇'}
    </button>
  );
};
