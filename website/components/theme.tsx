import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import red from '@material-ui/core/colors/red';

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#4791db'
		},
		secondary: {
			main: '#0000ff'
		},
		error: {
			main: red.A400
		},
		background: {
			default: '#f0f0f0'
		}
	}
});

export default theme;
