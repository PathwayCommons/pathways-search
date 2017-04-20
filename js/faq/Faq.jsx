import React from 'react';
import {Accordion, Panel} from 'react-bootstrap';

// Faq
// Prop Dependencies ::
// none
export class Faq extends React.Component {
	render() {
		var hostName = window.location.protocol + "//" + window.location.host + window.location.pathname;
		var keyValue = 1;
		return (
			<div className="Faq">
				<h4 className="text-center">
					Frequently Asked Questions
				</h4>
				<Accordion>
					<Panel header="Where does the data for the app come from?" eventKey={keyValue++}>
						Data is retrieved from Pathway Commons via a web service.
					</Panel>
					<Panel header="Does the app retrieve all the matching data in Pathway Commons?" eventKey={keyValue++}>
						No it only shows pathways. In particular, the app provides explicit instructions to apply queries to BioPAX objects of type ‘pathway’. If one wishes to view data other than pathways, visit the Pathway Commons website for more information on how to use the Pathway Commons web service.
					</Panel>
					<Panel header="Can I perform a more specific search?" eventKey={keyValue++}>
						The ‘Advanced’ menu (right of the search bar) enables users to filter results by data provider. One can also choose to filter data lower than and greater than a specified number of participants, or leave either filtering option blank to disable minimum or maximum filtering.
					</Panel>
					<Panel header="How does enhanced search work?" eventKey={keyValue++}>
						Essentially, enhanced search is a system which parses your input into a Pathway Commons readable Lucene query internally which is more likely to give expected search results compared to using free-text search alone.
						<br/><br/>
						The way it works is as follows. First, the phrase that you enter is seperated by whitespace, where each whitespace segment is treated as one unit. Then, each "segment" is run through a series of tests and lookup tables to determine if it is one of the Pathway Commons compatible identifier formats (HGNC, CHEBI, Uniprot, etc.). The app will then ask Pathway Commons to look for any pathways which have a combination of all the segments entered. Pathway Commons will look for the symbols in the xref or name fields of each pathway, whereas for words, Pathway Commons will only look in the name field.
						<br/><br/>
						For example, the following user input, <code>TP53 Pathway</code> will be parsed to, <code>(xrefid:TP53 name:TP53) AND name:Pathway</code>.
						<br/><br/>
						The app uses a "degenerative" search strategy, which allows for extremely focused search results where possible, but will broaden the search query if it finds the search scope is too narrow. This is how it works. First it tries the narrowest search possible, which are, all pathways which contain all of the segments entered in the appopriate fields, and looks for results. If finds no results, then it looks for all the pathways with a portion of all the segments entered in the appopriate fields. If again, there are no results, it tries looking for all pathways with a portion of all segments entered in all fields. Finally, it gives up and returns no search results.
						<br/><br/>
						For example, theoretically if the query, <code>(xrefid:TP53 name:TP53) AND name:Pathway</code> returns no results, the search query will degenerate to, <code>(xrefid:TP53 name:TP53) name:Pathway</code>. If that theoretically returns no search results, the search query will degenerate to, <code>TP53 Pathway</code>. If that theoretically returns no search results, it will give up and display no search results message.
						<br/><br/>
					</Panel>
					<Panel header="What identifier formats can I enter into search?" eventKey={keyValue++}>
						By default, you can enter HUGO Gene Nomenclature Committee (HGNC), Uniprot (swissprot), Chemical Entities of Biological Interest (ChEBI), Small Molecule Pathway Database (SMPDB), and Kegg Pathway identifiers into search. In order to attempt to use any other identifiers, Enhanced Search must be turned off.
					</Panel>
					<Panel header="How many results are returned?" eventKey={keyValue++}>
						By default, the top five search results are returned. The user can click the ‘Show more results’ to display the remaining results, to a maximum of 100.
					</Panel>
					<Panel header="Why can’t I find a pathway that I believe exists in Pathway Commons?" eventKey={keyValue++}>
						This is probably because the pathway is being filtered out by search settings. Try to turn off filtering and see if the expected pathway reappears. To do this, disable enhanced search and and remove maximum and minimum participant filters.
					</Panel>
					<Panel header="How do I link to the app or embed a searchbox or pathway?" eventKey={keyValue++}>
						Any given page in the app can be linked to by simply copying the URL.
						<br/><br/>
						If you wish to embed a pathway elsewhere, take the URL of the page you wish to embed and add <code>/embed</code> to the subdirectory, just in front of <code>/pathway</code>. For example, to embed a pathway with the following URL:
						<code>{hostName + "#/pathway?uri=http%3A%2F%2Fidentifiers.org%2Freactome%2FR-HSA-157118"}</code>,
						modify the URL to the following,
						<code>{hostName + "#/pathway/embed?uri=http%3A%2F%2Fidentifiers.org%2Freactome%2FR-HSA-157118"}</code>.
						The resulting URL can then be placed in an iframe.
						<br/><br/>
						If you wish to embed search, place the following URL in an iframe, <code>{hostName + "#/search/embed"}</code>.
					</Panel>
				</Accordion>
			</div>
		);
	}
}
