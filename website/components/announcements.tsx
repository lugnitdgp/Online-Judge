import React from 'react';
import Announcement from 'react-announcement'

export default class announcement extends React.Component {
  render () {
    return (
      <Announcement
          title="Here is your component"
          subtitle="Wait for few Minutes."
          link="https://github.com"
        //   imageSource={Logo}
        imageSource="https://github.com/kristofferandreasen/react-announcement/blob/master/media/small-header.png?raw=true"
        // daysToLive={3}
        //   secondsBeforeBannerShows={20}
        //   closeIconSize={30}
      />
    )
  }
}