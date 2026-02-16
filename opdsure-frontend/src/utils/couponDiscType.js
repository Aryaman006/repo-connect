const getCouponDiscType = (disc) => {

    let discTypeString;
    switch (disc) {
        case 0:
            discTypeString = "Amount";
            break;
        case 1:
            discTypeString = "Percent";
            break;
        default:
            discTypeString = null;
            break;
       
    }
    return discTypeString;

};

export default getCouponDiscType;
