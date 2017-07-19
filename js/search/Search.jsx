import React from 'react';
import {SearchWrapper} from './components/SearchWrapper.jsx';
import {SearchHeader} from './components/SearchHeader.jsx';
import {SearchList} from './components/SearchList.jsx';


// Search
// Prop Dependencies ::
// - history
// - logPageView
// - logEvent

// Note: Spread operator used to provide props to SearchWrapper, therefore Search also adopts SearchWrapper dependencies in addition to those provided above
export class Search extends React.Component {
	constructor(props) {
		super(props);
		this.props.logPageView( this.props.history.location );
	}

	componentDidUpdate(prevProps, prevState) {
		if( this.props.history.location.search ){
			this.props.logEvent({
				category: 'Search',
				action: 'query',
				label: this.props.history.location.search
			});
		}
	}

	render() {
		return (
			<div className="Search">
				<SearchWrapper {...this.props}>
					<SearchHeader/>
					<SearchList/>
				</SearchWrapper>
			</div>
		);
	}
}
