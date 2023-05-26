import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Col, Container, Row, ThemeProvider} from "react-bootstrap";
import Gateway from "./components/Gateway";

function App() {
  return (
    <ThemeProvider
      breakpoints={['xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
      minBreakpoint="xxs">
      <Container>
        <Row>
          <Col>
            <Gateway/>
          </Col>
        </Row>
      </Container>
    </ThemeProvider>
  );
}

export default App;
