import React, {useEffect, useState} from 'react'
import { ClickAwayListener, Stack, Typography } from '@mui/material'
import { Button } from '@mui/material'
import { Grid } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import { borderRadius } from '@mui/system';
import Checkbox from '@mui/material/Checkbox';
import FilterAltIcon from '@mui/icons-material/FilterAlt';


const FilterBox = ({showOnlyVerified, handleVerificationChange}) => {
    const [isBoxOpen, setBoxOpen] = useState(false)
    const [homeChecked, setHomeChecked] = useState(false)
    
    const handleHomeChange = (value) => {
        setHomeChecked(value)
    }

    return (
      <ClickAwayListener onClickAway={() => setBoxOpen(false)}>
        <>
      { !isBoxOpen &&
        <Stack
        onMouseOver={() => setBoxOpen(true)}
        onMouseLeave={() => setBoxOpen(false)}
        onClick={() => setBoxOpen(true)}
        
          sx={{
            p: 1,
            marginLeft: "2px",
            top: "210px",
            position: "fixed",
            zIndex: "9999",
          }}
          direction="column"
        >
          <Grid
            container
            sx={{
              backgroundColor: "white",
              color: "black",
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
            <FilterAltIcon
              fontSize="medium"
            />
          </Grid>
        </Stack>
        }
        { isBoxOpen &&
        <Grid
          container
          onMouseOver={() => setBoxOpen(true)}
          onMouseLeave={() => setBoxOpen(false)}
          sx={{
            p: 1,
            marginLeft: "2px",
            top: "210px",
            position: "fixed",
            zIndex: "9999",
          }}
          direction="column"
        >
          <Grid
            item
            sx={{
              backgroundColor: "white",
              color: "black",
              width: "160px",
              height: "70px",
              border: "2px solid #c2bfba",
              borderRadius: "4px",
            }}
          >
            <Stack spacing={-1}>
              <Typography>
                <Checkbox checked={showOnlyVerified} onChange={(event) => {
                    handleVerificationChange(event.target.checked)
                }}/>
                Sadece onaylılar
              </Typography>
              <Typography>
                <Checkbox checked={homeChecked} onChange={(event) => {
                    handleHomeChange(event.target.checked)
                }} />
                Sadece evler
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        }
        </>
    </ClickAwayListener>
    );
}

export default FilterBox    