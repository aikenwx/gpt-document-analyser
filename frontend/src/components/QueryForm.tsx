

import React, { ChangeEventHandler, useState } from 'react';
import { Form, Upload, Button, Input, UploadProps, GetProp, UploadFile } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { queryApi } from '../api/api';
import { ChatContext, FileType, QueryFormProps } from '../@types/query';
import { useErrorToast } from '../hooks/useErrorToast';




export default function QueryForm({ chatItems, setChatItems }: QueryFormProps) {

  const [query, setQuery] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { openToast, contextHolder } = useErrorToast();

  const handleQueryChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setQuery(e.target.value);
  }

  const props: UploadProps = {

    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      if (file.size > 1000000) {
        openToast(file.name + ' is too big');
        return false;
      }

      setFileList([...fileList, file]);

      return false;
    },
    fileList,
    accept: '.pdf,.doc,.docx',
    name: 'files',
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    const formData = new FormData();

    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        formData.append('files', file as FileType);
      }
    }

    let chatRequest: ChatContext = { chatItems: [...chatItems, { role: 'user', content: query }] }
    formData.append('context', JSON.stringify(chatRequest));

    setIsLoading(true);

    queryApi(formData).then((res) => {
      setChatItems(res?.data?.chatItems);
      setFileList([]);
      setQuery('');
    }).catch((err) => {
      openToast(err.message as string);
    }).finally(() => {
      setIsLoading(false);
    });
  }


  return (
    <>{contextHolder}
      <Form onFinish={handleSubmit} style={{
        width: '100%',
      }}>
        <Form.Item>

          <Upload {...props}>
            <Button disabled={isLoading} icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <TextArea name="query" onChange={handleQueryChange} disabled={isLoading} value={query} />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" disabled={isLoading}>
            Send
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

