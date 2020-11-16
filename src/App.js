import './App.css';
import Container from '@material-ui/core/Container';
import CountryCard from './components/CountryCard';

function App() {
  return (
    <Container>
      <h1 style={{textAlign: "center",}}>Lets Go To Europe!</h1>
      <CountryCard />
    </Container>
  );
}

export default App;
