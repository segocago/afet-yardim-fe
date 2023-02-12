//Status levels
export const UNKNOWN_LEVEL = "UNKNOWN";
export const NO_NEED_REQUIRED = "NO_NEED_REQUIRED";
export const NEED_REQUIRED = "NEED_REQUIRED";
export const URGENT_NEED_REQUIRED = "URGENT_NEED_REQUIRED";

//status types
export const HUMAN_HELP = "HUMAN_HELP";
export const MATERIAL = "MATERIAL";
export const FOOD = "FOOD";
export const PACKAGE_STATUS = "PACKAGE";

//ActiveStatus types
export const ACTIVE_STATUS = {
    ACTIVE : "ACTIVE",
    NOT_ACTIVE : "NOT_ACTIVE",
    UNKNOWN_ACTIVITY : "UNKNOWN"
}


export const getStatusLevelForType = (site, siteStatusType) => {
    if (!site.lastSiteStatuses) {
        return NO_NEED_REQUIRED;
    }

    const siteStatus = site.lastSiteStatuses.find(
        (siteStatus) => siteStatus.siteStatusType === siteStatusType
    );

    if (!siteStatus) {
        return UNKNOWN_LEVEL;
    }
    return siteStatus.siteStatusLevel;
};

export const doesSiteNeedAnyHelp = (site) => {

    if(!site || (site.activeStatus != ACTIVE_STATUS.ACTIVE)  || !site.lastSiteStatuses || site.lastSiteStatuses.length === 0){
        return false;
    }

    const humanNeedLevel = getStatusLevelForType(site, HUMAN_HELP);
    const materialNeedLevel = getStatusLevelForType(site, MATERIAL);
    const foodNeedLevel = getStatusLevelForType(site, FOOD);
    const packageNeedLevel = getStatusLevelForType(site, PACKAGE_STATUS);

    if((humanNeedLevel === UNKNOWN_LEVEL || humanNeedLevel === NO_NEED_REQUIRED) &&
        (materialNeedLevel === UNKNOWN_LEVEL || materialNeedLevel === NO_NEED_REQUIRED) &&
        (foodNeedLevel === UNKNOWN_LEVEL || foodNeedLevel === NO_NEED_REQUIRED) &&
        (packageNeedLevel === UNKNOWN_LEVEL || packageNeedLevel === NO_NEED_REQUIRED)){
        return false;
    }
    return  true;
}