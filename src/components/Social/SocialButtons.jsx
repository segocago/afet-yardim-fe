import React from "react";
import {
    TwitterShareButton,
    WhatsappShareButton,
    FacebookShareButton,
    TelegramShareButton,
    EmailShareButton,

    TwitterIcon,
    WhatsappIcon,
    FacebookIcon,
    TelegramIcon,
    EmailIcon
  } from 'react-share';
  

const SocialButtons = ({site}) => {
    console.log(site)
    const shareTitle = `${document.title} | ${site.name} | `;
    const shareUrl = window.location.href;
    const iconSize = 32;

    return (
    <div>
      <TwitterShareButton url={shareUrl} title={shareTitle}>
       <TwitterIcon round size={iconSize} />
      </TwitterShareButton>
      <WhatsappShareButton url={shareUrl} title={shareTitle}>
       <WhatsappIcon round size={iconSize} />
      </WhatsappShareButton>
      <FacebookShareButton url={shareUrl} title={shareTitle}>
       <FacebookIcon round size={iconSize} />
      </FacebookShareButton>
      <TelegramShareButton url={shareUrl} title={shareTitle}>
       <TelegramIcon round size={iconSize} />
      </TelegramShareButton>
      <EmailShareButton title={shareTitle} onClick={() => {}} openShareDialogOnClick>
       <EmailIcon round size={iconSize} />
      </EmailShareButton>
    </div>
    )
   }

export default SocialButtons;
   