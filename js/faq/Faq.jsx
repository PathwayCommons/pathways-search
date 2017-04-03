import React from 'react';
import {Accordion, Panel} from 'react-bootstrap';

// Faq
// Prop Dependencies ::
// none
export class Faq extends React.Component {
	render() {
		return (
			<div className="Faq">
				<h4 className="text-center">
					Frequently Asked Questions
				</h4>
				<Accordion>
					<Panel header="Where does the data for the app come from?" eventKey="1">
						Data is retrieved from Pathway Commons via a web service.
					</Panel>
					<Panel header="Does the app retrieve all the matching data in Pathway Commons?" eventKey="2">
						No it only shows pathways. In particular, the app provides explicit instructions to apply queries to BioPAX objects of type ‘pathway’. If one wishes to view data other than pathways, visit the Pathway Commons website for more information on how to use the Pathway Commons web service.
					</Panel>
					<Panel header="Do search results include all data providers from Pathway Commons?" eventKey="3">
						No. Certain datasources (eg. Transfac, WikiPathways) are filtered out by default as the data they provide are not conducive to the graphical display format. We are working on building applications that are better suited to these types of data in the future.
					</Panel>
					<Panel header="Can I perform a more specific search?" eventKey="4">
						The ‘Advanced’ menu (right of the search bar) enables users to filter results by data provider. One can also choose to filter data lower than and greater than a specified number of participants, or leave either filtering option blank to disable minimum or maximum filtering.
					</Panel>
					<Panel header="How many results are returned?" eventKey="5">
						By default, the top five search results are returned. The user can click the ‘Show more results’ to display the remaining results, to a maximum of 100.
					</Panel>
					<Panel header="Why can’t I find a pathway that I believe exists in Pathway Commons?" eventKey="6">
						This is probably because of the default filtering options -  size, source, type. Select the ‘show me everything’ option in the Advanced options
					</Panel>
				</Accordion>
			</div>
		);
	}
}
