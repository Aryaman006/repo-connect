const getCouponUsageType = (disc) => {

    let usageTypeString;
    switch (disc) {
        case 1:
            usageTypeString = "Single";
            break;
        case 2:
            usageTypeString = "Multiple";
            break;
        default:
            usageTypeString = null;
            break;
       
    }
    return usageTypeString;

};

export default getCouponUsageType;
