import React from "react";
import {createFromIconfontCN} from "@ant-design/icons";

interface IProps {
  type: string
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
  style?: React.CSSProperties
  className?: string
}

const Icon = (props: IProps) => {
  const { type, onClick, style } = props;

  const Ele= createFromIconfontCN({
    scriptUrl: 'https://at.alicdn.com/t/c/font_4366642_lxuexky0pwm.js', // 在 iconfont.cn 上生成
  });

  return (
    <Ele type={type} onClick={onClick} style={style} />
  )
}

export default Icon;