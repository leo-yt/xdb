import React, {useState} from "react";
import {Tree, Select, Empty, Table, Alert, Button, Tabs, Drawer, Form, Input, message} from "antd";
import {DownOutlined} from '@ant-design/icons';
import {createDatabase, dropDatabase, query} from "../../../service";
import {formatTables, getTables} from "../../../utils/biz";
import SQLEditor from "./SQLEditor";
import {useDatabaseStore} from "../../../store";
import Icon from '../../../components/Icon';

import './main-card.scss';

interface IProps {
  data: any
  onDisconnect: () => void
}

type FieldType = {
  database: string;
};

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

const MainCard = (props: IProps) => {
  const { data, onDisconnect } = props;
  const [form] = Form.useForm();
  const initTreeData: DataNode[] = data.tables?.map((item: any) => ({
    title: item,
    key: item,
    icon: <Icon type="icon-table-solid" />
  }));
  const [treeData, setTreeData] = useState<any[]>(initTreeData || []);
  const [databaseValue, setDatabaseValue] = useState(data.defaultDatabase);
  const [queryTables, setQueryTables] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);
  const databases = useDatabaseStore((state: any) => state.databases);
  const setDatabases = useDatabaseStore((state: any) => state.setDatabases);

  const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] => {
    return list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
  }

  const onSelect = () => {}

  const onChangeDataBase = async (v: any) => {
    await query(`USE ${v}`);
    setDatabaseValue(v);
    await reloadTables();
  }

  const reloadTables = async () => {
    const res: any = await query('SHOW TABLES');
    if (res.code === 200) {
      const tables = getTables(res.data).map((item: any) => ({
        title: item,
        key: item,
        icon: <Icon type="icon-table-solid"/>,
      }));
      setTreeData(tables)
    }
  }

  const onLoadData = ({ key, children }: any) => {
    return new Promise<void>(async (resolve) => {
      if (children) {
        resolve();
        return;
      }
      const ds = {
        display: 'flex',
        justifyContent: 'space-between',
        width: 265
      }
      const fs = {
        flex: 1,
        maxWidth: 165,
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }
      const ts = {
        color: '#aaa',
        fontSize: 12,
        maxWidth: 100,
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }
      const res: any = await query(`DESC ${key}`);
      if (res.code === 200) {
        setTreeData((origin: DataNode[]) =>
          updateTreeData(origin, key, res.data.map((v: any, idx: number) => ({
            title: <span style={ds}><span style={fs} title={v.Field}>{v.Field}</span><span style={ts} title={v.Type}>{v.Type}</span></span>,
            key: `${key}-${v.Field}-${idx}`,
            isLeaf: true,
          }))),
        );
        resolve();
        return;
      }
      resolve();
    });
  }

  const onExecute = (values: any[]) => {
    const func = values.map(item => query(item));
    Promise.all(func).then(async (res:any) => {
      const errorObj = res.find((d: any)=> d.code !== 200);
      setErrorMsg(errorObj?.message)
      if (!errorObj) {
        const last = res.findLast((item: any) => item.sql.toUpperCase().startsWith('USE'));
        if (last) {
          const arr = last.sql.split(' ');
          setDatabaseValue(arr[arr.length - 1])
        }
        await reloadTables();
        setQueryTables(formatTables(res));
      }
    })
  }

  const gfe: any = (data: any[]) => {
    if (data && Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return {}
  }

  const renderTableItems = (data: any) => {
    return (
      <>
        {
          data.dataSource === undefined ?
            <Alert banner message={data.dataInfo} type="info" showIcon /> :
            <Table
              bordered
              scroll={{y: '36vh', x: true}}
              pagination={false}
              size="small"
              columns={data.columns}
              dataSource={data.dataSource}
              style={{border: '1px solid #ddd'}}
            />
        }
      </>
    )
  }

  const renderTableArea = (data: any[]) => {
    if (data.length === 0) {
      return <Empty description="empty" />;
    }
    if (data.length === 1) {
      return renderTableItems(gfe(data));
    }
    if (data.length > 1) {
      return (
        <Tabs
          animated
          type="card"
          size="small"
          items={data.map((d, i) => ({
            label: d.label,
            key: d.key + '-' + i,
            children: renderTableItems(d)
          }))}
        />
      )
    }
    return null;
  }

  const onAddDatabase = async ({database}: {database: string}) => {
    const res: any = await createDatabase(database);
    if (res.code === 200) {
      form.resetFields();
      setOpen(false);
      await reloadDatabases();
      message.success('创建成功！', 0.8)
    } else {
      message.error('创建失败 ' + res.message)
    }
  }

  const onCloseDrawer = () => {
    setOpen(false);
    form.resetFields();
  }

  const beforeDeleteDatabase = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, value: any) => {
    if (databaseValue === value) {
      message.info('请先切换数据库');
      return;
    }
    await onDeleteDatabase(e, value);
  }

  const onDeleteDatabase = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, value: any) => {
    e.preventDefault();
    e.stopPropagation();
    await dropDatabase(value);
    await reloadDatabases();
  }

  const reloadDatabases = async () => {
    const res: any = await query('SHOW DATABASES')
    if (res.code === 200) {
      setDatabases(res.data);
      await reloadTables();
    }
  }

  return (
    <div className="main-card-container">
      <div className="aside">
        <div className="database-select">
          <Select
            style={{width: '100%'}}
            onChange={onChangeDataBase}
            options={databases}
            value={databaseValue}
            optionRender={(option) => (
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>{option.data.label}</span>
                <Icon
                  type="icon-close"
                  onClick={(e) => beforeDeleteDatabase(e, option.data.value)}
                />
              </div>
            )}
          />
          <Button className="add-btn" onClick={() => setOpen(true)}>+</Button>
          <Drawer
            placement="top"
            closable={false}
            onClose={onCloseDrawer}
            open={open}
            getContainer={false}
            height={130}
          >
            <Form
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              onFinish={onAddDatabase}
              autoComplete="off"
            >
              <Form.Item<FieldType>
                label="数据库"
                name="database"
                rules={[{ required: true, message: '请输入数据库名' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Drawer>
        </div>
        <div className="tables-tree">
          <div className="entities">
            <span>ENTITIES({treeData.length})</span>
            {/*<span className="add-btn">+</span>*/}
          </div>
          {
            treeData.length > 0 ?
              <Tree
                showLine
                showIcon
                switcherIcon={<DownOutlined/>}
                onSelect={onSelect}
                treeData={treeData}
                loadData={onLoadData}
                loadedKeys={[]}
              /> :
              <Empty description="Empty set" image={Empty.PRESENTED_IMAGE_SIMPLE}/>
          }
        </div>
        <Button onClick={onDisconnect} type="dashed" danger className="disconnect-btn">断开连接</Button>
      </div>
      <div className="sql-panel">
        <div className="input-area">
          <SQLEditor onExecute={onExecute}/>
        </div>
        <div className="table-area">
          {
            errorMsg ?
              <Alert banner message={errorMsg} type="error" showIcon /> :
              <>{renderTableArea(queryTables)}</>
          }
        </div>
      </div>
    </div>
  );
};

export default MainCard;