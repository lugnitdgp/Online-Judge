import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../components/theme';
import Router from 'next/router';
import LinearProgress from '@material-ui/core/LinearProgress';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserContextProvider from '../components/UserContextProvider';
import '../styles/main.css';

class MyApp extends App {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false
		};
	}
	componentDidMount() {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}

		this.setState({ loaded: true });
		Router.events.on('routeChangeStart', () => this.setState({ loaded: false }));
		Router.events.on('routeChangeComplete', () => this.setState({ loaded: true }));
	}

	render() {
		const { Component, pageProps } = this.props;

		return (
			<React.Fragment>

				<Head>
					<title>Online Judge</title>

				</Head>
				<UserContextProvider >
					<ThemeProvider theme={theme} >
						{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
						<CssBaseline />
						{this.state.loaded ? <Component {...pageProps} /> : <LinearProgress />}
						<style jsx global>{`
								html,
								body {
									padding: 0;
									margin: 0;
									font-family: 'Noto Sans TC', sans-serif;
								}

								* {
									box-sizing: border-box;
								}
						`}</style>
  
					</ThemeProvider>
				</UserContextProvider>
			</React.Fragment>
		);
	}
}

export default MyApp;
