import CONSTANTS from "../constant/Constants";

const getGender = (gender) => {
    let genderString;
    switch (gender) {
        case 1:
            genderString = "Male";
            break;
        case 2:
            genderString = "Female";
            break;
        default:
            genderString = "Others";
            break;
       
    }
    console.log(genderString, "-----");
    return genderString;
};

export default getGender;
