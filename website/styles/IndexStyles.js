const styles = (theme) => ({
	main: {
		width: 'auto',
		display: 'block',
		marginLeft: theme.spacing.unit * 5,
		marginRight: theme.spacing.unit * 5,
		marginTop: theme.spacing.unit * 3,
		[theme.breakpoints.up('md')]: {
			width: 800,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	},
	carousel: {
		maxWidth: '1200px',
		margin: '0 auto',
		fontSize: 12,
		[theme.breakpoints.down('xs')]: {

			fontSize: 0
		},
		// [theme.breakpoints.up('md')]: {
		// 	width: 1000,
		// 	height: 562.5,
		// 	marginLeft: 'auto',
		// 	marginRight: 'auto',
		// 	fontSize: 15
		// }
	},
	'@keyframes move': {
		from: {
			transform: 'translate(-50%, 200%)',
			opacity: 0
		},
		to: {
			transform: 'translate(-50%, -50%)',
			opacity: 1
		}
	},
	card: {
		marginBottom: theme.spacing(3)
	}
});
export default styles;