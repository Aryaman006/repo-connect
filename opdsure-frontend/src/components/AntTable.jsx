import React from 'react'
import { Table } from 'antd';

const AntTable = ({ data, columns, onChange, current, total, pageSize, onShowSizeChange,size,rowSelection }) => {
  const paginationConfig = {
    current: current,
    pageSize: pageSize,
    total: total,
    showSizeChanger: true,
    showQuickJumper: true,
    showPrevNextJumpers:true,
    showTotal: (total) => `Total ${total} items`,
    onChange: onChange,
    onShowSizeChange: (current, size) => onShowSizeChange(size),
    onPrev: () => onChange(current - 1),
    onNext: () => onChange(current + 1),
  };

  return (
    <Table dataSource={data} columns={columns} pagination={paginationConfig} size={size} rowSelection={rowSelection}/>
  );
};

export default AntTable;


