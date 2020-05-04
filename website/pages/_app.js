import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../components/theme';
import Router from 'next/router';
import LinearProgress from '@material-ui/core/LinearProgress';

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
		Router.events.on('routeChangeStart', () =>
			this.setState({ loaded: false })
		);
		Router.events.on('routeChangeComplete', () =>
			this.setState({ loaded: true })
		);
	}

	render() {
		const { Component, pageProps } = this.props;

		return (
			<React.Fragment>
				<Head>
					<title>Online Judge</title>
				</Head>
				<ThemeProvider theme={theme}>
					{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
					<CssBaseline />
					{this.state.loaded ? (
						<Component {...pageProps} />
					) : (
						<LinearProgress />
					)}
				</ThemeProvider>
			</React.Fragment>
		);
	}
}

export default MyApp;
