import { Logo } from './logo';
import { Wallet } from '@gear-js/wallet-connect';
import styles from './header.module.scss';

interface Props {
  isAccountVisible: boolean;
};

export function Header({ isAccountVisible }: Props) {
  return (
    <div className="container mx-auto p-4">

    <header className={styles.header}>
      <Logo />
      {isAccountVisible && <Wallet theme='vara'/>}
      
    </header>
    </div>
  );

  
}
