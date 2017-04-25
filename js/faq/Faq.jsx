import React from 'react';
import {FaqEntry} from './component/FaqEntry.jsx';

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

				<FaqEntry header="How does the app get its data?">
					All data is retrieved using the <a href="http://www.pathwaycommons.org/pc2/">Pathway Commons web service API</a>.
				</FaqEntry>
				<FaqEntry header="Does the app return everything that matches my query in Pathway Commons?">
					No, the app is focused on fetching only pathways. Pathway Commons stores biological data in a standardized format called <a href="http://biopax.org/">BioPAX</a> that provides rich descriptions of many biological concepts or <a href="http://www.pathwaycommons.org/pc2/#biopax_types">'types'</a> (e.g. 'Gene', 'Complex', 'Pathway'). The search app performs queries specifically for BioPAX objects of type 'pathway'. For more general queries, please see the documentation for the <a href="http://www.pathwaycommons.org/pc2/">Pathway Commons web service API</a>.
				</FaqEntry>
				<FaqEntry header="How do I perform a more specific search?">
					After submitting a query, an 'Advanced' menu appears (right of the search bar) and provides access to filters and options to tailor your search. You may filter the results that are returned by data provider and/or restrict pathways containing a certain minimum or maximum number of participants. To remove filtering altogether, simply remove any entries for data sources and participants. An 'enhanced' search option is enabled by default [see 'How does the (enhanced) search work?'].
				</FaqEntry>
				<FaqEntry header="What is the enhanced search option in the 'Advanced' menu? How does (enhanced) search work?">
					<strong>What is the enhanced search option in the 'Advanced' menu?</strong>
					<p>
						The 'enhanced' search option that is ON by default aims to create more focused and relevant searches of Pathway Commons pathways by attempting to interpret the  meaning of individual workds of text entered into the search text box. In this context, input text can be interpreted as either one or more database identifiers for genes associated with a pathway or words/phrases describing the name of a pathway. This option can be toggled OFF within the 'Advanced' search options menu that appears next to the search box after a query is submitted. Turning enhanced search OFF casts a wider net for possible search hits and may be advantageous when on wishes to search using more abstract concepts; The potential drawback is that a large number of irrelevant items may result.
					</p>

					<strong>How does (enhanced) search work?</strong>
					<p>
						The <a href="http://www.pathwaycommons.org/pc2/">Pathway Commons web service API</a> which the app uses to fetch data provides a powerful and flexible full-text search capability. In its barest form, queries to the search web service match free-text against the fields of each database entry for a pathway. This is what occurs when the 'enhanced' search option is OFF.
					</p>
					<p>
						The search web service can also accept more explicit instructions about what database fields to look in including two that are particularly useful for identifying pathways: *xrefid*, which describes external database identifiers for genes in pathway and *name*, which includes labels for both  genes and pathways along with standard nomenclature for genes. When the enhanced search option is ON, each whitespace-separated token of text (i.e. word) is run through a series of tests to determine if it conforms to any external database identifiers recognized by Pathway Commons (i.e. HGNC, CHEBI, UniProt). The app then asks Pathway Commons to return pathways which contain all tokens. Pathway Commons will be instructed to look for identifier-type tokens in the *xrefid* or name fields of each pathway entry; For all remaining tokens that are not identifiers, Pathway Commons will be instructed to match only within a pathway's *name* field. The underlying format of the instructions passed on to the Pathway Commons web service conforms to the <a href="http://lucene.apache.org/core/3_6_2/queryparsersyntax.html">Lucene query syntax</a>.
					</p>
					<blockquote>
						<strong>Example of formatting user input into a Lucene query.</strong><br/> Consider the following user text input: <code>TP53 Pathway</code>. Then the Lucene formatted query instruction passed on to the Pathway Commons search web service will be: <code>(xrefid:TP53 name:TP53) AND name:Pathway</code>.
					</blockquote>
					<p>
						It can be the case that initial queries return no results. In this case, the enhanced search employs a strategy that reduces the stringincy of queries until hits are returned. It accomplishes this by reformulating Lucene queries to  allow greater flexibility in matches.
					</p>
					<blockquote>
						<strong>Example of reducing the stringency of a Lucene query.</strong><br/> Consider an initial query <code>(xrefid:TP53 name:TP53) AND name:Pathway</code> that returns no hits. The search query will fall-back to <code>(xrefid:TP53 name:TP53) name:Pathway</code> then to <code>TP53 Pathway</code>. If no search hits result, a 'No Search Results Found' message is displayed to the user.
					</blockquote>
				</FaqEntry>
				<FaqEntry header="What types of identifiers or symbols will the app recognize?">
					The search app accepts a list of gene identifiers as input. The app will recognize names approved by: <a href="http://www.genenames.org/">HUGO Gene Nomenclature Committee (HGNC)</a>; <a href="http://www.uniprot.org/">UniProt (Swiss-Prot)</a>; and <a href="https://www.ebi.ac.uk/chebi/">Chemical Entities of Biological Interest (ChEBI)</a>. In order to attempt to use any other identifiers, turn off enhanced search in the 'Advanced' menu.
				</FaqEntry>
				<FaqEntry header="How many results are returned?">
					By default, the top five search results are returned. Click the 'Show more results...' link below to display up to 100 results.
				</FaqEntry>
				<FaqEntry header="Why can’t I find a pathway that I believe exists in Pathway Commons?">
					A likely cause is that your pathway is being filtered out by the default  settings declared in the 'Advanced' menu. Try to turn off filtering and see if the expected pathway appears: Toggle the enhanced search OFF and clear entries for the maximum and minimum number of pathway participants (default maximum is 100;  default minimum is 3).
				</FaqEntry>
				<FaqEntry header="How do I embed the search box or pathway view in my web page?">
					<p>
						You can easily embed the search box or a specific pathway view on your page using an <a href="https://developer.mozilla.org/en/docs/Web/HTML/Element/iframe">iframe</a>.
					</p>

					<blockquote>
						<strong>Embedding a search box</strong><br/> Use the following URL in an iframe, <code>{hostName + "#/search/embed"}</code>.
					</blockquote>

					<blockquote>
						<strong>Embedding a pathway view</strong><br/> Once you have viewed a pathway in the app, modify the URL to contain the path <code>/#/pathway/embed</code>. For example, if you used the app to view a pathway with the URL:
						<code>{hostName + "#/pathway?uri=http%3A%2F%2Fidentifiers.org%2Freactome%2FR-HSA-157118"}</code>,
						the corresponding embeddable URL would be <code>{hostName + "#/pathway/embed?uri=http%3A%2F%2Fidentifiers.org%2Freactome%2FR-HSA-157118"}</code>.
					</blockquote>
				</FaqEntry>
				<FaqEntry header="Where is the source code for this web app?">
					This web app is an open source project <a href="https://github.com/PathwayCommons/pathways-search">hosted on Github</a> where you can view instructions on how to download, build and run the project on your computer.
				</FaqEntry>
			</div>
		);
	}
}
