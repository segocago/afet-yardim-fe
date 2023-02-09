import React, {useState} from 'react'
import { Stack } from '@mui/material'
import { Button } from '@mui/material'
import { Grid } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import { borderRadius } from '@mui/system';


const FilterBox = () => {
    const [verificationChecked, setVerificationChecked] = useState(false)
    const [homeChecked, setHomeChecked] = useState(false)

    const handleVerificationChange = () => {
        setVerificationChecked((verificationChecked) => !verificationChecked)
    }
    
    const handleHomeChange = () => {
        setHomeChecked((homeChecked) => !homeChecked)
    }

    return (
      <Stack
        sx={{
          p: 1,
          marginLeft: "2px",
          top: "190px",
          position: "fixed",
          zIndex: "9999",
        }}
        direction="column"
      >
        <Grid
          container
          sx={{
            backgroundColor: verificationChecked ? "#166cc9" : "white",
            color: verificationChecked ? "white" : "black",
            width: "34px",
            height: "30px",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            verticalAlign: "center",
            border: "2px solid #c2bfba",
            borderRadius: "4px",
          }}
        >
          <CheckIcon
            fontSize="medium"
            alt="Sadece onaylıları göster"
            onClick={handleVerificationChange}
          />
        </Grid>
        <Grid
          container
          sx={{
            backgroundColor: homeChecked ? "#166cc9" : "white",
            color: homeChecked ? "white" : "black",
            width: "34px",
            height: "30px",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2px",
            textAlign: "center",
            verticalAlign: "center",
            border: "2px solid #c2bfba",
            borderRadius: "4px",
          }}
        >
          <HomeIcon
            fontSize="medium"
            alt="Sadece onaylıları göster"
            onClick={handleHomeChange}
          />
        </Grid>
      </Stack>
    );
}

export default FilterBox    