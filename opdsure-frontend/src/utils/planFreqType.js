const getPlanFreqType = (freq) => {

    let planFreqString;
    switch (freq) {
        case 1:
            planFreqString = "Yearly";
            break;
        case 2:
            planFreqString = "Half Yearly";
            break;
        case 3:
            planFreqString = "Quarterly";
            break;
        case 4:
            planFreqString = "Monthly";
            break;
        default:
            planFreqString = null;
            break;
       
    }
    return planFreqString;

};

export default getPlanFreqType;
