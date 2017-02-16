import React from 'react';
import {SearchWrapper} from './components/SearchWrapper.jsx';
import {SearchBar} from './components/SearchBar.jsx';
import {SearchList} from './components/SearchList.jsx';

// SearchEmbed
// Prop Dependencies ::
// none

// Note: Spread operator used to provide props to SearchWrapper, therefore SearchEmbed also adopts SearchWrapper dependencies in addition to those provided above
export class SearchEmbed extends React.Component {
	render() {
		return (
			<div className="SearchEmbed">
				<SearchWrapper {...this.props} embed={true}>
					<SearchBar/>
					<SearchList/>
				</SearchWrapper>
			</div>
		);
	}
}
