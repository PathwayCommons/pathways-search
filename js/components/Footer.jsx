import React from 'react';

// Footer
// Prop Dependencies ::
// none
export class Footer extends React.Component {
	render() {
		return (
			<footer className="Footer clearfix">
				<a href="//groups.google.com/forum/#!forum/pathway-commons-help">
					<div className="footerButton">
						Help
					</div>
				</a>
				<a href="//www.utoronto.ca">
					<div className="footerText">
						© University of Toronto 2017
					</div>
				</a>
			</footer>
		);
	}
}
