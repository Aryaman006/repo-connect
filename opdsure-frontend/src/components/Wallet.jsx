import React, { useEffect, useState } from 'react';
import { Popover, List, Typography, Spin, Alert, Badge } from 'antd';
import { WalletTwoTone } from '@ant-design/icons';
import { Axios } from "../axios/axiosFunctions";
import config from "../config/config";

const { Text } = Typography;

const WalletCard = () => {
    const [transactions, setTransactions] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [badge, setBadge] = useState(0);

    const GetTransactions = async () => {
        try {
            const resp = await Axios.fetchAxiosData(config.GetTransactions);
            const user = await Axios.fetchAxiosData(config.GetProfile);
            console.log("user",user.data.wallet_balance)
            setBadge(user?.data?.wallet_balance);
            if (resp.success) {
                setTransactions(resp.data);
            } else {
                setError('Failed to fetch transactions');
            }
        } catch (err) {
            setError('An error occurred while fetching transactions');
        }
    };

    const GetUserProfile = async () => {
        try {
            const resp = await Axios.fetchAxiosData(config.GetProfile);
            if (resp.success) {
                setWalletBalance(resp.data.wallet_balance);
            } else {
                setError('Failed to fetch wallet balance');
            }
        } catch (err) {
            setError('An error occurred while fetching wallet balance');
        }
    };
    useEffect(()=>{
        GetTransactions();
    },[])
    const handleOpenChange = (open) => {
        setOpen(open);
        if (open) {
            setLoading(true);
            setError(null);
            Promise.all([GetTransactions(), GetUserProfile()])
                .finally(() => setLoading(false));
        }
    };

    const popoverContent = (
        <div className="popover-content">
            <div className='wallet_balance'>
                <p className='balance-title'>Available Balance</p>
                <p className='balance-amount'>₹ {walletBalance.toFixed(2)}</p>
            </div>
            <div className='transaction-list'>
                {loading && <Spin className='spinner' />}
                {error && <Alert message={error} type="error" showIcon />}
                <List
                    itemLayout="horizontal"
                    dataSource={transactions}
                    renderItem={item => (
                        <List.Item className='list-item'>
                            <List.Item.Meta
                                // title={<Text className='item-title'>{item._id}</Text>}
                                description={<Text className='item-description'>{new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}</Text>}
                            />
                            <Text className='item-amount' style={{ color: item.type === 1 ? 'green' : 'red' }}>
                                ₹ {item.amount.toFixed(2)}
                            </Text>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );

    return (
        <>
            <style>
                {`
                    .popover-content {
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        width: 400px;
                        max-width: 100%;
                        padding: 0;
                    }
                    .wallet_balance {
                        position: sticky;
                        top: 0;
                        background: #f9f9f9;
                        z-index: 1;
                        text-align: center;
                        font-size: 20px;
                        border-radius: 8px;
                        margin-bottom: 16px;
                        border: 1px solid #e8e8e8;
                        padding: 16px;
                    }
                    .balance-title {
                        margin: 0;
                        font-weight: bold;
                        color: #486AB3;
                    }
                    .balance-amount {
                        margin: 0;
                        font-size: 24px;
                        color: #333;
                    }
                    .transaction-list {
                        max-height: 300px;
                        overflow-y: auto;
                    }
                    .spinner {
                        display: block;
                        margin: 20px auto;
                    }
                    .list-item {
                        border-bottom: 1px solid #f0f0f0;
                    }
                    .item-title {
                        font-size: 16px;
                        color: #486AB3;
                    }
                    .item-description {
                        font-size: 14px;
                        color: #888;
                    }
                    .item-amount {
                        font-size: 16px;
                    }
                `}
            </style>
            
            <Badge count={`₹ ${badge}`} showZero offset={[-60, 15]} color="blue" overflowCount={999999} >
            
            <Popover
                placement="leftBottom"
                trigger="click"
                content={popoverContent}
                open={open}
                onOpenChange={handleOpenChange}
                overlayClassName="wallet-popover"
                overlayStyle={{ padding: "0 !important" }}
            >
                <WalletTwoTone
                    style={{ 
                        fontSize: '28px',
                        cursor: 'pointer', 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: '50%', 
                        padding: '8px',
                        transition: 'background-color 0.3s ease',
                    }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                />
            </Popover>
            </Badge>
        </>
    );
}

export default WalletCard;
