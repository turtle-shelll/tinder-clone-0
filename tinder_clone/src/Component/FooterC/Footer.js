import React from 'react'
import './Footer.css';
import StarIcon from '@mui/icons-material/Star';
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import{IconButton} from '@material-ui/core';

function Footer() {
  return (
    <div className='footer'>
      <div className='FooterBtn'>  <IconButton className='replayIcon'>
            <ReplayIcon />
        </IconButton></div>
        <div className='FooterBtn'>  <IconButton className='closeIcon'>
            <CloseIcon />
        </IconButton></div>
        <div className='FooterBtn'>  <IconButton className='starIcon'>
            <StarIcon />
        </IconButton></div>
        <div className='FooterBtn'>  <IconButton className='favoriteIcon'>
            <FavoriteIcon />
        </IconButton></div>
        <div className='FooterBtn'>  <IconButton className='flashIcon'>
            <FlashOnIcon />
        </IconButton></div>
    </div>
  )
}

export default Footer;