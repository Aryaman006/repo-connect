const getStatus = (gender) => {
    let statusString;
    switch (gender) {
        case 1:
            statusString = "Active";
            break;
        case 0:
            statusString = "Inactive";
            break;
        default:
            return null;
    }
    return statusString;
};

export default getStatus;