import { LoadingButton } from "@mui/lab";
import { Alert, Snackbar } from "@mui/material";
import useClosestSite from "../hooks/useClosestSite";

const MAX_ZOOM = 15

const ClosestHelpSiteButton = ({ sites, mapRef, callback, children }) => {
    const { 
        getClosestSite, 
        state, 
        setState,
        errMsg
    } = useClosestSite(sites)

    const handleClick = async() => {
        const closestSite = await getClosestSite()
        if (mapRef !== null && closestSite !== null && closestSite !== undefined) {
            mapRef.setView(
                [closestSite.location.latitude, closestSite.location.longitude],
                MAX_ZOOM
            );
            setTimeout(() => {
                closestSite.markerRef.openPopup();
            }, 500)
            callback();
            setState("waiting")
        }
    }

    const handleClose = () => {
        setState("waiting")
    }

    return (
        <>
            <LoadingButton
                onClick={handleClick}
                variant="contained"
                loading={state === 'loading'}
                size="large"
            >
                {children}
            </LoadingButton>
            <Snackbar
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
                open={state === "error"}
                autoHideDuration={10000}
                onClose={handleClose}
                sx={{
                    width: 400,
                }}
                
            >
                <Alert onClose={handleClose} severity="error" sx={{width: '100%', fontSize: 18}}>
                    {errMsg}
                </Alert>
            </Snackbar>
        </>
    );
}
 
export default ClosestHelpSiteButton;