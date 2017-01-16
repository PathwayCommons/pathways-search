import React from 'react';

export class Footer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="Footer clearfix">
				Pathway Commons is a collaboration between the Bader Lab at the University of Toronto, the Sander Lab at the cBio Center for Information Biology, Dana-Farber Cancer Institute and the Computational biology collaboratory at Harvard Medical School, and the Demir Lab, Oregon Health & Science University.

				Pathway Commons was originally developed at the Memorial Sloan Kettering Cancer Center and the University of Toronto.
			</div>
		);
	}
}
