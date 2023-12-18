const getDatabases = (data: any) => {
  const res: any[] = [];
  if (data && Array.isArray(data)) {
    data.forEach((item: any) => {
      res.push(Object.values(item)[0])
    })
  }
  return generateSelectData(res);
}

const generateSelectData = (data: any) => {
  if (data && Array.isArray(data)) {
    return data.map((item: any) => ({
      value: item,
      label: item,
    }))
  }
  return [];
}

const getTables = (data: any[]) => {
  const res: any[] = [];
  if (data && Array.isArray(data)) {
    data.forEach((item: any) => {
      res.push(Object.values(item)[0])
    })
  }
  return res;
}

const generateTableColumns = (obj: any) => {
  if (!obj) {
    return []
  }
  return Object.keys(obj).map((item, idx) => ({
    title: item,
    dataIndex: item,
    key: item,
  }));
}

const formatTables = (data: any[]) => {
  if (data && Array.isArray(data)) {
    return data.map((item: any, idx: number) => ({
      label: idx + 1,
      key: idx,
      columns: generateTableColumns(item.data[0]),
      dataSource: Array.isArray(item.data) ? item.data.map((d: any, i: number) => ({
        ...d,
        key: idx + '-' + i
      })) : undefined,
      dataInfo: Array.isArray(item.data) ? undefined : (item.data.info || `${item.data.affectedRows} row(s) affected`)
    }))
  }
  return []
}

export {
  getDatabases,
  getTables,
  formatTables
}