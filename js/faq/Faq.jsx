import React from 'react';
import {Accordion, Panel} from 'react-bootstrap';

// Faq
// Prop Dependencies ::
// none
export class Faq extends React.Component {
	render() {
		var hostName = window.location.protocol + "//" + window.location.host + window.location.pathname;
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
					<Panel header="How does enhanced search work?" eventKey="5">
						Essentially, enhanced search is a system which parses your input into a Pathway Commons readable Lucene query internally which is more likely to give expected search results compared to using free-text search alone.
						<br/><br/>
						The way it works is as follows. First, the phrase that you enter is seperated by whitespace, where each whitespace segment, henceforth known as a "word", is treated as one unit. Then, each word is run through a series of regular expression tests and lookup tables to determine if it is one of the Pathway Commons compatible identifier formats (HGNC, CHEBI, Uniprot). If it is, then word is inserted into a Lucene query which will look for the word in xref and/or name, for example, <code>(xrefid:word1 name:word1)</code>. Otherwise, it is assumed that the word is part of the title and therefore will be inserted into a Lucene query which will look for the word in name only, for example, <code>name:word2</code>. Finally, the Lucene queries from all the words are combined together, putting <code> AND </code> between each Lucene query, for example, <code>(xrefid:word1 name:word1) AND name:word2</code>.
						<br/><br/>
						The final result is a query which will return search results which contains all of the words entered in either the xref or title if the word is an identifier, or in the title otherwise. The result is much more strictly focused compared to free-text, and for most people should be more intuitive to work with. However, as it is more restrictive, it is also more likely to return no results. If this is the case, it may be beneficial to disable enhanced search to see if enhanced search is removing the target pathway.
					</Panel>
					<Panel header="What identifier formats can I enter into search?" eventKey="6">
						By default, you can enter HUGO Gene Nomenclature Committee (HGNC), Uniprot (swissprot), Chemical Entities of Biological Interest (ChEBI), Small Molecule Pathway Database (SMPDB), and Kegg Pathway identifiers into search. In order to attempt to use any other identifiers, Enhanced Search must be turned off.
					</Panel>
					<Panel header="How many results are returned?" eventKey="7">
						By default, the top five search results are returned. The user can click the ‘Show more results’ to display the remaining results, to a maximum of 100.
					</Panel>
					<Panel header="Why can’t I find a pathway that I believe exists in Pathway Commons?" eventKey="8">
						This is probably because of the default filtering options -  size, source, type. Select the ‘show me everything’ option in the Advanced options
					</Panel>
					<Panel header="How do I link to the app or embed a searchbox or pathway?" eventKey="9">
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
