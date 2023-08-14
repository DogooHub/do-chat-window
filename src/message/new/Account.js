import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Avatar, Empty, Select, Tag, theme} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {getAllAccounts} from "../../services/axios";

const BASE_PATH = `${process.env.REACT_APP_MY_API_KEY}`;
const DGSelectAccount = ({selectedAccounts = [], onChangeAccount}) => {
  const {token} = theme.useToken();
  const [open, setOpen] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [selectedValues] = useState([]);
  const selectRef = useRef();
  useEffect(() => {
    initialOptions();
  }, []);

  useEffect(() => {
    onChangeAccount(selectedValues);
  }, [selectedValues]);

  function initialOptions() {
    getAllAccounts("status eq 'approved'", 1, Number.MAX_SAFE_INTEGER, null, null).then(
      (response) => {
        setAccounts(response?.items);
      },
    );
  }

  const mapOption = (item) => ({
    label: (
      <div className={'flex items-center py-1'}>
        <Avatar
          icon={<UserOutlined/>}
          size={36}
          src={
            item.portraitThumbnail
              ? `${BASE_PATH.substring(0, BASE_PATH.length - 2)}${
                item.portraitThumbnail
              }`
              : null
          }
        />
        <span className={'ml-2'}>{item.fullname}</span>
      </div>
    ),
    value: item.openImUserID || item.id,
    searchValue: `${item.fullname} ${utf8ToAscii(item.fullname)}`,
    tagLabel: item.fullname,
    disabled: !item.openImUserID,
    data: item
  });

  const tagRender = ({fullname, id}, index) => {
    return (
      <Tag
        key={id}
        color={token.colorPrimary}
        className={
          'min-w-0 max-w-full font-bold flex items-center px-2 py-1 rounded-xl border-none mr-0 truncate'
        }
        closeIcon={true}
        closable={true}
        onClose={() => onCloseTag(index)}
      >
        <span className={"min-w-0 truncate"}>{fullname}</span>
      </Tag>
    );
  };

  const onCloseTag = (index) => {
    onChangeAccount((prevState) => {
      prevState.splice(index, 1);
      return [...prevState];
    });
    selectRef.current?.focus();
  };

  const options = useMemo(() => {
    return accounts.filter(account => selectedAccounts.findIndex(item => item.id === account.id) === -1).map(mapOption);
  }, [accounts, selectedAccounts]);

  return (
    <div
      onClick={() => {
        selectRef.current?.focus();
      }}
      className={`min-w-0 max-w-full max-h-32 overflow-auto flex flex-wrap justify-start items-center gap-1 cursor-text ${
        selectedAccounts.length > 0 ? 'ml-2' : ''
      }`}
    >
      {selectedAccounts.map(tagRender)}
      <Select
        ref={selectRef}
        open={open}
        value={[]}
        showSearch
        filterOption={true}
        optionFilterProp={'searchValue'}
        optionLabelProp={'tagLabel'}
        notFoundContent={
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={'Không tìm thấy tài khoản'}
          />
        }
        popupMatchSelectWidth={300}
        menuItemSelectedIcon={null}
        listHeight={300}
        mode={'multiple'}
        bordered={false}
        defaultOpen={true}
        autoFocus={true}
        suffixIcon={null}
        onFocus={() => {
          setOpen(true);
        }}
        onBlur={() => {
          setOpen(false);
        }}
        onSelect={(value, {data}) => {
          onChangeAccount(prevStates => [...prevStates, data]);
        }}
        options={options}
      />
    </div>
  );
};

DGSelectAccount.propTypes = {};

export default DGSelectAccount;
