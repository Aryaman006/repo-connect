
import CONSTANTS from "../../constant/Constants";
import {
  Row,
  Col,
  Input,
  Pagination,
  Button,
  Table,
  notification,
  Modal,
  Form,
  Card,
  Select,
  InputNumber,
  Divider,
  Spin,
  Typography,
} from "antd";
const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
import axios from "axios";
import { useEffect, useState } from "react";
import {
  EditFilled,
  DeleteFilled,
  ArrowUpOutlined,
  ExclamationCircleFilled,
  MinusCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/authProvider";
import config from "../../config/config";
import { getPlanFreqType } from "../../utils";
const { confirm } = Modal;

const CorpoPlan = () => {
  const { userid } = useAuth();
  const [form] = Form.useForm();
  const [selectedData, setSelectedData] = useState([]);
  const [corporatePlan, setCorporatePlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCorporatePlan();
  }, []);

  const fetchCorporatePlan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${config.ApiBaseUrl}/api/v1/hr/corporation/plan/${userid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setCorporatePlan(response.data.data);
        // Set form values if needed
        form.setFieldsValue({
          name: response.data.data.plan.name,
          frequency: response.data.data.plan.frequency,
          // ... other fields
        });
      }
    } catch (err) {
      console.error("Error fetching corporate plan:", err);
      setError(err.response?.data?.message || "Failed to fetch corporate plan");
      notification.error({
        message: "Error",
        description: "Failed to fetch corporate plan details",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    setSelectedData(record);
    form.setFieldsValue({
      name: record.name,
      frequency: record.frequency,
      // ... other fields
    });
  };

  return (
    <>
      <div style={{ padding: "1rem" }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
          <Col>
            <Title level={3}>Corporate Plan Details</Title>
          </Col>
        </Row>

        {loading ? (
          <Spin size="large" />
        ) : error ? (
          <Card>
            <Text type="danger">{error}</Text>
          </Card>
        ) : corporatePlan ? (
          <>
            {/* <Card
              title="Corporate Information"
              style={{ marginBottom: 20 }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Text strong>Corporate Name: </Text>
                  <Text>{corporatePlan.corporate.name}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>Email: </Text>
                  <Text>{corporatePlan.corporate.email}</Text>
                </Col>
                <Col span={8}>
                  <Text strong>Contact Person: </Text>
                  <Text>
                    {corporatePlan.corporate.contact_person || "N/A"}
                  </Text>
                </Col>
              </Row>
            </Card> */}

            <Card title="Plan Details">
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Plan Name: </Text>
                  <Text>{corporatePlan.plan.name}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Tenure: </Text>
                  <Text>
                    {getPlanFreqType(corporatePlan.plan.frequency)}
                  </Text>
                </Col>
              </Row>

              <Divider orientation="left">Membership Options</Divider>
              <Table
                dataSource={corporatePlan.plan.membership_options}
                columns={[
                  {
                    title: "Membership Type",
                    dataIndex: "membership_label",
                    key: "membership_label",
                  },
                  {
                    title: "Member Count",
                    dataIndex: "member_count",
                    key: "member_count",
                  },
                  {
                    title: "Plan Charges (₹)",
                    dataIndex: "charges",
                    key: "charges",
                    render: (value) => value.toFixed(2),
                  },
                  {
                    title: "Charges incl. GST (₹)",
                    dataIndex: "charges_incl_GST",
                    key: "charges_incl_GST",
                    render: (value) => value?.toFixed(2) || "N/A",
                  },
                  {
                    title: "Wallet Balance (₹)",
                    dataIndex: "wallet_balance",
                    key: "wallet_balance",
                    render: (value) => value.toFixed(2),
                  },
                ]}
                pagination={false}
                bordered
              />

              <Divider orientation="left">Plan Benefits</Divider>
              {corporatePlan.plan.plan_benefits?.length > 0 ? (
                <Table
                  dataSource={corporatePlan.plan.plan_benefits}
                  columns={[
                    {
                      title: "Benefit",
                      dataIndex: "plan_label",
                      key: "plan_label",
                    },
                    {
                      title: "Description",
                      dataIndex: "plan_feature",
                      key: "plan_feature",
                    },
                  ]}
                  pagination={false}
                  bordered
                />
              ) : (
                <Text>No benefits added</Text>
              )}

              <Divider orientation="left">Claims Parameters</Divider>
              <Row gutter={16}>
                <Col span={24}>
                  <Text strong>Claim Combination: </Text>
                  <Text>
                    {corporatePlan.plan.claim_combination ===
                    CONSTANTS.CLAIM_COMBINATION.SEPERATE
                      ? "All three parameters are individual"
                      : "Combined Pharmacy and Diagnostic"}
                  </Text>
                </Col>
              </Row>

              {corporatePlan.plan.claim_combination ===
                CONSTANTS.CLAIM_COMBINATION.SEPERATE && (
                <>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={6}>
                      <Text strong>OPD Discount: </Text>
                      <Text>
                        {corporatePlan.plan.opd_precent_discount}% up to ₹
                        {corporatePlan.plan.opd_max_discount}
                      </Text>
                    </Col>
                    <Col span={6}>
                      <Text strong>Pharmacy Discount: </Text>
                      <Text>
                        {corporatePlan.plan.pharmacy_precent_discount}% up to ₹
                        {corporatePlan.plan.pharmacy_max_discount}
                      </Text>
                    </Col>
                    <Col span={6}>
                      <Text strong>Lab Discount: </Text>
                      <Text>
                        {corporatePlan.plan.lab_precent_discount}% up to ₹
                        {corporatePlan.plan.lab_max_discount}
                      </Text>
                    </Col>
                  </Row>
                </>
              )}

              {corporatePlan.plan.claim_combination ===
                CONSTANTS.CLAIM_COMBINATION.PHARMACY_LAB_COMBINED && (
                <>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={6}>
                      <Text strong>OPD Discount: </Text>
                      <Text>
                        {corporatePlan.plan.opd_precent_discount}% up to ₹
                        {corporatePlan.plan.opd_max_discount}
                      </Text>
                    </Col>
                    <Col span={6}>
                      <Text strong>Combined Pharmacy & Lab Discount: </Text>
                      <Text>
                        {corporatePlan.plan.combined_lab_plus_test_percent}% up
                        to ₹
                        {corporatePlan.plan.combined_lab_plus_test_max_discount}
                      </Text>
                    </Col>
                  </Row>
                </>
              )}
            </Card>
          </>
        ) : (
          <Card>
            <Text>No corporate plan found</Text>
          </Card>
        )}
      </div>
    </>
  );
};

export default CorpoPlan;