import { getDistance } from "geolib";
import { useState } from "react";
import { doesSiteNeedAnyHelp } from "../components/utils/SiteUtils";

const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
}

const useClosestSite = (sites) => {
    const [state, setState] = useState('waiting')
    const [errMsg, setErrMsg] = useState('')

    const getClosestSite = async () => {
        setErrMsg('')
        setState('loading')
        
        const pos = await new Promise((resolve) => navigator.geolocation.getCurrentPosition(
            resolve,
            onFailedToGetUserLocation,
            options
        ))
        const result = calculateClosestSite(pos)

        return result
    }

    const onFailedToGetUserLocation = (e) => {
        console.log(e)
        setState('error')
        if (e.code === 1) {
            setErrMsg("Konum verisine ulaşımı engellediğiniz için isteğinizi yerine getiremiyoruz. İsterseniz konum verilerine erişimi arama barının sol kısmına kalan konum simgesine tıklayarak açabilirsiniz.")
        }
        else if (e.code === 2) {
            setErrMsg("Şu anda konum verilerinize ulaşamıyoruz. Lütfen daha sonra tekrar deneyin.")
        }
        else if (e.code === 3) {
            setErrMsg("İstek zaman aşımına uğradı.")
        }

        return Promise.reject()
    }

    const calculateClosestSite = (pos) => {
        const { latitude, longitude } = pos.coords
        if (!sites || sites.length === 0) {
            setErrMsg("Yardım toplama noktaları henüz yüklenmedi.")
            setState("error")
            return;
        }
        let minDistance = Number.MAX_SAFE_INTEGER;
        let closestSite = sites[0];

        const helpRequiredSites = sites.filter(site => doesSiteNeedAnyHelp(site));

        helpRequiredSites.forEach((site) => {
                if (site.location && site.location.latitude && site.location.longitude) {
                    const distance = getDistance(
                        { latitude: latitude, longitude: longitude },
                        {
                            latitude: site.location.latitude,
                            longitude: site.location.longitude,
                        }
                    );
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestSite = site;
                    }
                }
            });

        setState('success')
        return closestSite
    }

    return { getClosestSite, state, setState, errMsg }
}
 
export default useClosestSite;