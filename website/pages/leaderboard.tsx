import React from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

class Leaderboard extends React.Component {
    state = {
        gotData: false,
        leaderBoard: []
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/leaderboard`).then(data => {
            this.setState({gotData: true, leaderBoard: data.data})
        })
    }
    
    render() {
        return (
        <Layout>
        <section className="container leaderboard">
            <section className="hero is-primary is-bold">
			    <div className="hero-body">
			        <h1 className="title has-text-centered is-uppercase">Leaderboard</h1>
			    </div>
		    </section>
        { !this.state.gotData ? <h1 className="leaderboard_loader">Loading....</h1> : 
        
            <table className="table is-hoverable is-fullwidth">
                <thead>
                <tr>
                    <th> # </th>
                    <th> User </th>
                    <th> Status </th>
                </tr>
                </thead>
                <tbody> {
                    this.state.leaderBoard.map((user, index) => {
                        return (
                            <tr>
                                <td> {index+1} </td>
                                <td> {user.name.toUpperCase()} </td>
                                <td> $ {user.submission} </td>
                            </tr>
                            )
                        
                    })
                }
                </tbody>
            </table>
        }        
        </section>
        </Layout>
        )
    }
}

export default Leaderboard;