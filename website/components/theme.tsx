import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import red from '@material-ui/core/colors/red';

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#ff3300'
		},
		secondary: {
			main: '#0000ff'
		},
		error: {
			main: red.A400
		},
		background: {
			default: '#fff'
		}
	}
});

export default theme;
