import React, {useState, useEffect} from 'react';
import axios from 'axios';

function Footer() {
  const [sponsors, setSponsors] = useState([]);
  
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getsponsors`)
    .then(res => {
      console.log(res);
      setSponsors(res.data);
    })
    .catch(err => {
      console.log(err);
    })
  }, [])

    return (
        <div>
            <div className="FooterFixed">
              Sponsored by : 
              {
                sponsors.map(sponsor => (
                  <>
                  &nbsp;&nbsp;
              <img alt="." src={sponsor.logo} className="FooterImg" />
              &nbsp;&nbsp;
              </>))
              }
            <br/>
            <br/>
                &copy; Created and maintained by GNU/Linux Users' group, Nit
                Durgapur
              </div>
        </div>
    )
}

export default Footer
