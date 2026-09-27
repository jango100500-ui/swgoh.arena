import { Header } from './Header';
import { Footer } from './Footer';
import { Main } from '../main/Main';

export const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flex: 1, paddingTop: '64px' }}>
        <Main />
      </div>
      <Footer />
    </div>
  );
};
