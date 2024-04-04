import { Col, Row, Typography } from 'antd';

const { Title } = Typography;


export default function Hero() {
  return (
    <Row style={{ width: '100%', padding: 10, alignContent: 'center', justifyContent: 'center' }}>
      <Col xl={12}>
        <Title>Welcome to Document Analyzer!</Title>
        <Title level={2}>Upload your word and pdf documents and let us parse and analyze it for you! Just type in anything you want us to do for you! You can even compare between submitted documents!</Title>
      </Col>
    </Row>
  );
}
