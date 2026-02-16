const getCouponType = (disc) => {

    let couponTypeString;
    switch (disc) {
        case 1:
            couponTypeString = "Individual";
            break;
        case 2:
            couponTypeString = "Corporate";
            break;
        default:
            couponTypeString = null;
            break;
       
    }
    return couponTypeString;

};

export default getCouponType;
