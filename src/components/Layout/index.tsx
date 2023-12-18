import React, {useEffect, useState} from "react";
import {theme, ConfigProvider} from "antd";

interface IProps {
  children: any
}

const Layout = (props: IProps) => {
  const { children } = props;
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function (e) {
      setDarkMode(e.matches)
      if (e.matches) {
        document.querySelector('#root')?.classList.add('dark')
      } else {
        document.querySelector('#root')?.classList.remove('dark')
      }
    });
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.querySelector('#root')?.classList.add('dark')
      setDarkMode(true)
    }
  }, []);

  return (
    <ConfigProvider theme={{
      algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
    }}>
      <div className={`xdb-layout`}>
        <div className={`xdb-layout-children`}>
          {children}
        </div>
      </div>
    </ConfigProvider>
  )
}

export default Layout;