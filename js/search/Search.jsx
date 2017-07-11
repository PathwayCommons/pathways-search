import React from 'react';
import {SearchWrapper} from './components/SearchWrapper.jsx';
import {SearchHeader} from './components/SearchHeader.jsx';
import {SearchList} from './components/SearchList.jsx';

// Search
// Prop Dependencies ::
// none

// Note: Spread operator used to provide props to SearchWrapper, therefore Search also adopts SearchWrapper dependencies in addition to those provided above
export class Search extends React.Component {
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
