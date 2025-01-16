import { Logo } from './logo';
import { Wallet } from '@gear-js/wallet-connect';
import styles from './header.module.scss';
import { ReactComponent as LogoDOB } from '@/assets/images/dobprotocol-logo.svg';
import { ReactComponent as Text } from '@/assets/images/dobprotocol-text.svg';

interface Props {
  isAccountVisible: boolean;
};

export function Header({ isAccountVisible }: Props) {
  return (
    <div className="container mx-auto p-4">
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <LogoDOB className={styles.logoDOB} />
          <Text className={styles.textLogo} />
        </div>
        <Logo />
        {isAccountVisible && <Wallet theme="vara" />}
      </header>
    </div>
  );
}
