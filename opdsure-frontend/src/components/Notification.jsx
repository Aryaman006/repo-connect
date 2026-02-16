import React, { useEffect, useState } from 'react';
import { Popover, List, Typography, Spin, Alert,Badge } from 'antd';
import { WalletTwoTone, BellOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Axios } from "../axios/axiosFunctions";
import config from "../config/config";
import CONSTANTS from "../constant/Constants";
import dayjs from "dayjs";
const { Text } = Typography;

const NotificationCard = ({userType}) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [badge, setBadge] = useState(0);

    const GetNotifications = async () => {
        try {
            setLoading(true);
            const resp = await Axios.fetchAxiosData(
                userType == 3 ? config.GetUserNotifications :
                userType == CONSTANTS.MAN_USER_TYPES.ADMIN ? config.GetAdminNotifications :
                userType == CONSTANTS.MAN_USER_TYPES.GENERAL ? config.GetManagementNotifications :
                null
            );
            if (resp.success) {
                setNotifications(resp?.data?.records);
                setLoading(false);
                setBadge(resp?.data?.records?.length)
            } 
        } catch (err) {
            setError('An error occurred while fetching notifications');
        }
    };
    useEffect(()=>{
        GetNotifications();
    },[])
    const handleOpenChange = (open) => {
        setOpen(open);
        if (open) {
            setLoading(true);
            setError(null);
            Promise.all([GetNotifications()])
                .finally(() => setLoading(false));
        }
    };

    const handleDeleteNotification = async( _id ) => {
        try {
            await Axios.deleteAxiosData(
                userType == 3 ? config.DeleteUserNotification + _id :
                userType == CONSTANTS.MAN_USER_TYPES.ADMIN ? config.DeleteAdminNotification + _id :
                userType == CONSTANTS.MAN_USER_TYPES.GENERAL ? config.DeleteManagementNotification + _id :
                null
            );
            GetNotifications();
        } catch (error) {
            setError('An error occurred while fetching notifications');
        }
       
    }

    const popoverContent = (
 <div className="popover-content ">
    <div className='transaction-list p-4'>
        {loading && <Spin className='spinner' />}
        {error && <Alert message={error} type="error" showIcon />}
        {   
            notifications.length ===0 ?
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'blue', fontSize: '1.2rem' }}>
            <BellOutlined style={{ fontSize: '1.5rem', marginRight: '0.5rem', color: 'blue' }} />
            <Text>No notifications</Text>
        </p>
            :
            <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={item => (
                <List.Item className='list-item' style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <BellOutlined style={{ fontSize: '2rem', marginRight: '1rem', color: "green", alignSelf: 'center' }} />
                    <List.Item.Meta
                        title={<Text className='item-title'>{item.message}</Text>}
                        description={<Text className='item-description'>{dayjs(item.createdAt).format("DD/MM/YYYY")}  {new Date(item.createdAt).toLocaleTimeString()}</Text>}
                    />
                    <CloseCircleOutlined className='item-amount' style={{ fontSize: '1.5rem', color: 'red', marginLeft: "1rem" }} 
                        onClick={()=>{handleDeleteNotification(item._id)}}
                    />
                </List.Item>
            )}
        />}
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
            <Popover
                placement="leftBottom"
                trigger="click"
                content={popoverContent}
                open={open}
                onOpenChange={handleOpenChange}
                overlayClassName="wallet-popover"
                overlayStyle={{ padding: "0 !important" }}
            >
                  <Badge count={badge} showZero offset={[-65, 15]} color="blue" overflowCount={999} >
                <BellOutlined
                    style={{ 
                        fontSize: '28px',
                        cursor: 'pointer', 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: '50%', 
                        padding: '8px',
                        transition: 'background-color 0.3s ease',
                        marginRight:"1rem"
                    }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                />
                </Badge>
            </Popover>
        </>
    );
}

export default NotificationCard;
