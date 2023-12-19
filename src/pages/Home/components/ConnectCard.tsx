import React from "react";
import { Card, Form, Input, Button } from 'antd';
import './connect.scss';

type FieldType = {
  user: string;
  password: string;
  host: string;
  port: string;
  database?: string;
  connectType: string;
};

interface IProps {
  onSubmit: (args: FieldType) => void;
}

const ConnectCard = (props: IProps) => {
  const { onSubmit } = props;
  const onFinishFailed = (errorInfo: any) => {};

  const initialValues = {
    connectType: 'MySQL',
  }

  return (
    <div className="connect-card">
      <Card title="连接数据库" hoverable>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={initialValues}
        >
          <Form.Item<FieldType>
            label="类型"
            name="connectType"
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item<FieldType>
            label="用户名"
            name="user"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item<FieldType>
            label="主机"
            name="host"
            rules={[{ required: true, message: '请输入主机！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="端口"
            name="port"
            rules={[{ required: true, message: '请输入端口！' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="数据库"
            name="database"
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              连接
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ConnectCard;