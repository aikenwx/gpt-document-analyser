import { Col, Row, Typography } from 'antd';
import { ChatItem } from '../@types/query';

export default function Message({ message }: { message: ChatItem }) {
  const isBot = message.role === 'assistant';

  return (
    <Row style={{ width: '100%', padding:10 }}>
      <Col span={24}>
        <Typography.Text type='secondary'>{isBot ? 'Assistant' : 'User'}</Typography.Text>
      </Col>
      <Col span={24}>
        <Typography.Text >{message.content}</Typography.Text>
      </Col>
    </Row>
  );
}
