const GetRelationString = (relation) => {   
    let relationString;
    switch (relation) {
        case 0:
            relationString = "Self";
            break;
        case 1:
            relationString = "Father";
            break;
        case 2:
            relationString = "Mother";
            break;
        case 3:
            relationString = "Sister";
            break;
        case 4:
            relationString = "Brother";
            break;
        case 5:
            relationString = "Son";
            break;
        case 6:
            relationString = "Daughter";
            break;
        case 7:
            relationString = "Wife";
            break;
        case 8:
            relationString = "Husband";
            break;
        case 9:
            relationString = "Father in Law";
            break;
        case 10:
            relationString = "Mother in Law";
            break;
        default:
            relationString = null;
            break;       
    }
    return relationString;
};

export default GetRelationString;
