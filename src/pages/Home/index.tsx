import React, { useState } from "react";
import {message} from "antd";
import ConnectCard from "./components/ConnectCard";
import MainCard from "./components/MainCard";
import './index.scss';
import {getTables} from "../../utils/biz";
import {connect, disConnect} from "../../service";
import { useDatabaseStore } from "../../store";

const Home = () => {
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState({});
  const setDatabases = useDatabaseStore((state: any) => state.setDatabases);

  const onDisconnect = async () => {
    setData({});
    const res: any = await disConnect();
    if (res.code === 200) {
      message.success('断开连接成功！', 0.8);
      setConnected(false);
    } else {
      message.error('断开连接失败：' + res.message);
      setConnected(true);
    }
  }

  const onConnect = async (params: any) => {
    const res: any = await connect(params);
    if (res.code === 200) {
      message.success('连接成功！', 0.5);
      setDatabases(res.data.databases);
      setData({
        ...data,
        tables: getTables(res.data.tables),
        defaultDatabase: params.database
      })
      setConnected(true);
    } else {
      message.error('连接失败：' + res.message);
      setData({})
      setConnected(false);
    }
  }

  return (
    <div className="home-container">
      {
        !connected ?
          <div className="connect-wrapper">
            <ConnectCard onSubmit={onConnect}/>
          </div> :
          <MainCard data={data} onDisconnect={onDisconnect} />
      }
    </div>
  )
}

export default Home;
