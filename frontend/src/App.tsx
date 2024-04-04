import { useEffect, useRef, useState } from 'react';
import { Layout, Menu, Row } from 'antd';
import Message from './components/Message';
import QueryForm from './components/QueryForm';
import useAppStorage from './hooks/useAppStorage';
import Hero from './components/Hero';

const { Header, Content, Sider } = Layout;

function App() {

  const [height, setHeight] = useState(0);


  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeight(formRef.current?.clientHeight || 0);
  });

  const { chatItems, setChatItems } = useAppStorage();

  const handleClearChat = () => {
    setChatItems([]);
  }


  return (
    <>
      <Layout style={{ height: '100vh', width: '100vw' }}>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ color: 'white', whiteSpace: 'nowrap' }}>Document Analyzer</h2>
        </Header>
        <Layout>
          <Sider width={200} breakpoint="lg"
            collapsedWidth="0">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1" onClick={handleClearChat} danger>Clear Chat History</Menu.Item>
            </Menu>

          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              backgroundColor: "white",
              borderRadius: "10px",
              position: "relative"
            }}>

              {chatItems.length === 0 ? <Row style={{ height: `calc(100% - ${height}px)` }}><Hero /></Row> : <Row style={{ height: `calc(100% - ${height}px)`, overflowY: 'auto', flexDirection: 'column-reverse' }}>

                <Row>
                  {
                    chatItems.filter(x => x.role === "user" || x.role === "assistant").map((chatItem, index) => (
                      <Message key={index} message={chatItem} />
                    ))}
                </Row>
              </Row>}
              <Row ref={formRef}>
                <QueryForm chatItems={chatItems} setChatItems={setChatItems} />
              </Row>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  )
}

export default App
