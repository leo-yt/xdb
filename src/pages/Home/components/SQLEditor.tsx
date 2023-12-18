import React, { useState } from "react";
import { Button } from "antd";
import { createEditor } from '@editablejs/models'
import { EditableProvider, ContentEditable, withEditable } from '@editablejs/editor'
import { withCodeBlock } from "@editablejs/plugin-codeblock";
import { sql } from '@codemirror/lang-sql'

import './sql-editor.scss';

const defaultValue = [
  {
    type: 'codeblock',
    language: 'sql',
    code1: 'select * from test_users;\n' +
      'select * from tasks;',
    code: 'create table `users` (\n' +
      '`id` int unsigned not null auto_increment,\n' +
      ' `name` varchar(255) not null,\n' +
      '  primary key (`id`)\n' +
      '  ) engine=InnoDB default charset=utf8mb3;',
    children: [{ text: '' }]
  }
]

const SQLEditor = (props: any) => {
  const [sqlValue, setSqlValue] = useState([]);
  const editor = React.useMemo(() => {
    const editor = withEditable(createEditor())
    return withCodeBlock(editor, {
      languages: [
        {
          value: 'sql',
          content: 'SQL',
          plugin: sql(),
        },
      ],
    })
  }, [])

  const onChange = (v: any) => {
    if (!v || !Array.isArray(v)) {
      setSqlValue([])
      return;
    }
    const sentence = v[0].code.split(';');
    const res = sentence.map((item: string) => item.replaceAll('\n', ' ').trim())
    setSqlValue(res.filter((d: any) => d))
  }

  return (
    <div className="sql-editor-container">
      <EditableProvider editor={editor} value={defaultValue} onChange={onChange}>
        <ContentEditable style={{width: '100%', height: 'calc(50vh - 55px)', overflowY: 'auto'}}/>
      </EditableProvider>
      <Button onClick={() => props.onExecute(sqlValue)} className="run-btn">运行</Button>
    </div>
  )
}
export default SQLEditor;
