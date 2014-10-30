/*
 * @title      LSD Cube Designer
 * @author     Sarven Capadisli <info@csarven.ca>
 * @license    Apache License 2.0
 */

var LSD = {
    C : {
        Lang: 'en',

        Org: [
            {
                "foaf:homepage": "http://worldbank.270a.info/",
                "foaf:name": "World Bank",
                "dcterms:identifier": "WB",
                "void:sparqlEndpoint": "http://worldbank.270a.info/sparql"
            },
            {
                "foaf:homepage": "http://transparency.270a.info/",
                "foaf:name": "Transparency International",
                "dcterms:identifier": "TI",
                "void:sparqlEndpoint": "http://transparency.270a.info/sparql"
            },
            {
                "foaf:homepage": "http://oecd.270a.info/",
                "foaf:name": "Organization for Economic Development and Cooperation",
                "dcterms:identifier": "OECD",
                "void:sparqlEndpoint": "http://oecd.270a.info/sparql"
            },
            {
                "foaf:homepage": "http://fao.270a.info/",
                "foaf:name": "Food and Agriculture Organization",
                "dcterms:identifier": "FAO",
                "void:sparqlEndpoint": "http://fao.270a.info/sparql"
            },
            {
                "foaf:homepage": "http://bfs.270a.info/",
                "foaf:name": "Swiss Federal Statistics Office",
                "dcterms:identifier": "BFS",
                "void:sparqlEndpoint": "http://bfs.270a.info/sparql"
            },
            {
                "foaf:homepage": "http://ecb.270a.info/",
                "foaf:name": "European Central Bank",
                "dcterms:identifier": "ECB",
                "void:sparqlEndpoint": "http://ecb.270a.info/sparql"
            },
            {
                "foaf:homepage": "http://imf.270a.info/",
                "foaf:name": "International Monetary Fund",
                "dcterms:identifier": "IMF",
                "void:sparqlEndpoint": "http://imf.270a.info/sparql"
            },
            {
                "foaf:homepage": "http://bis.270a.info/",
                "foaf:name": "Bank for International Settlements",
                "dcterms:identifier": "BIS",
                "void:sparqlEndpoint": "http://bis.270a.info/sparql"
            },
            {
                "foaf:homepage": "http://frb.270a.info/",
                "foaf:name": "Federal Reserve Board",
                "dcterms:identifier": "FRB",
                "void:sparqlEndpoint": "http://frb.270a.info/sparql"
            },
            {
                "foaf:homepage": "http://uis.270a.info/",
                "foaf:name": "UNESCO Institute for Statistics",
                "dcterms:identifier": "UIS",
                "void:sparqlEndpoint": "http://uis.270a.info/sparql"
            },
            {
                "foaf:homepage": "http://abs.270a.info/",
                "foaf:name": "Australian Bureau of Statistics",
                "dcterms:identifier": "ABS",
                "void:sparqlEndpoint": "http://abs.270a.info/sparql"
            }
        ],

        Property: {
            "qb:DimensionProperty": {
                "rdfs:label": "Dimension",
                "input:placeholder": "Search dimension property",
                "index": 0
            },
            "qb:MeasureProperty": {
                "rdfs:label": "Measure",
                "input:placeholder": "Search measure property",
                "index": 1
            },
            "qb:AttributeProperty": {
                "rdfs:label": "Attribute",
                "input:placeholder": "Search attribute property",
                "index": 2
            }
        }
    },

    S: {
        Disabled: 'disabled',
        Warning: 'warning',
        Error: 'error',
        Success: 'success',
        Processing: 'processing',
        NoMatches: 'no-matches',
        qbComponentProperty: '.qbComponentProperty',
        qbDimensionProperty: '.qbDimensionProperty',
        qbMeasureProperty: '.qbMeasureProperty',
        qbAttributeProperty: '.qbAttributeProperty'
    },

    U: {
        init: function () {
            if (window.location.search.length > 0) {
                LSD.U.buildStructureFromURL();

                LSD.U.getInput();

                setTimeout(function() {
                    LSD.U.initHistory();
                }, 3000);
            }
            else {
                LSD.U.getInput();

                LSD.U.initHistory();
            }

            window.onpopstate = function(event) {
                if (event.state == null) { return; }

                $('#lsd-cube-designer').replaceWith(JSON.parse(event.state).html);
                LSD.C.Property = JSON.parse(event.state).properties;

                LSD.U.getInput();
            };
        },

        initHistory: function() {
            var lsdCubeDesigner = $('#lsd-cube-designer').get(0).outerHTML;
            var historyObject = JSON.stringify({html: lsdCubeDesigner, properties: LSD.C.Property});
            window.history.replaceState(historyObject, null, document.URL);
        },

        historyUpdate: function() {
            var lsdCubeDesigner = $('#lsd-cube-designer').get(0).outerHTML;
            var historyObject = JSON.stringify({html: lsdCubeDesigner, properties: LSD.C.Property});

            var qbDPs = [], qbMPs = [], qbAPs = [];

            var historyURL = '';

            var properties = $('#lsd-cube-designer tr:first-child td .property');

            if (properties.length > 0) {
                $.each(properties, function(i, property) {
                    switch($(this).parent().attr('class')) {
                        case 'qb:DimensionProperty':
                            qbDPs.push(encodeURIComponent(property.href));
                            break;
                        case 'qb:MeasureProperty':
                            qbMPs.push(encodeURIComponent(property.href));
                            break;
                        case 'qb:AttributeProperty':
                            qbAPs.push(encodeURIComponent(property.href));
                            break;
                    }
                });

                historyURL = '?qb:DimensionProperty=' + qbDPs.join() +
                             '&qb:MeasureProperty='   + qbMPs.join() +
                             '&qb:AttributeProperty=' + qbAPs.join();

                window.history.pushState(historyObject, null, historyURL);
            }
            else {
                window.history.pushState(historyObject, null, '/');
            }
        },


        urlParam: function(name) {
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results==null){
               return null;
            }
            else{
               return results[1] || 0;
            }
        },


        buildStructureFromURL: function() {
            var qbDimensionProperty = LSD.U.urlParam('qb:DimensionProperty');
            var qbMeasureProperty = LSD.U.urlParam('qb:MeasureProperty');
            var qbAttributeProperty = LSD.U.urlParam('qb:AttributeProperty');
            var tds = '';

            var tdParent = $('td[class="qb:DimensionProperty"]').parent();
            tdParent.empty();

            if(qbDimensionProperty) {
                var qbDPs = qbDimensionProperty.split(',');
                var qbDPsLength = qbDPs.length;

                LSD.C.Property["qb:DimensionProperty"]["index"] = qbDPsLength;

                $('th[class="qbDimensionProperty"]').attr('colspan', qbDPsLength);

                $.each(qbDPs, function(i, v) { tds += '<td class="qb:DimensionProperty"></td>'; });
            }
            else {
                LSD.C.Property["qb:DimensionProperty"]["index"] = 1;
                tds += '<td class="qb:DimensionProperty"></td>';
            }


            if(qbMeasureProperty) {
                var qbMPs = qbMeasureProperty.split(',');
                var qbMPsLength = qbMPs.length;

                LSD.C.Property["qb:MeasureProperty"]["index"] = LSD.C.Property["qb:DimensionProperty"]["index"] + qbMPsLength;

                $.each(qbMPs, function(i, v) { tds += '<td class="qb:MeasureProperty"></td>'; });
            }
            else {
                LSD.C.Property["qb:MeasureProperty"]["index"] = LSD.C.Property["qb:DimensionProperty"]["index"] + 1;
                tds += '<td class="qb:MeasureProperty"></td>';
            }


            if(qbAttributeProperty) {
                var qbAPs = qbAttributeProperty.split(',');
                var qbAPsLength = qbAPs.length;

                LSD.C.Property["qb:AttributeProperty"]["index"] = LSD.C.Property["qb:MeasureProperty"]["index"] + qbAPsLength;

                $.each(qbAPs, function(i, v) { tds += '<td class="qb:AttributeProperty"></td>'; });
            }
            else {
                LSD.C.Property["qb:AttributeProperty"]["index"] = LSD.C.Property["qb:MeasureProperty"]["index"] + 1;
                tds += '<td class="qb:AttributeProperty"></td>';
            }

            tdParent.append(tds);

            if(qbDimensionProperty) {
                var qbDPs = qbDimensionProperty.split(',');
                var propertyType = 'qb:DimensionProperty';

                for (var i = 0; i < qbDPs.length; i++) {
                    (function (i) {
                        var iri = LSD.U.decodeString(qbDPs[i]);
                        var resultsNode = tdParent.find('td:nth-child(' + (i+1) + ')');
                        LSD.U.getIRILabel(iri, propertyType, resultsNode);
                    })(i);
                };
            }
            if(qbMeasureProperty) {
                var qbMPs = qbMeasureProperty.split(',');
                var propertyType = 'qb:MeasureProperty';

                for (var i = 0; i < qbMPs.length; i++) {
                    (function (i) {
                        var iri = LSD.U.decodeString(qbMPs[i]);
                        var resultsNode = tdParent.find('td:nth-child(' + (LSD.C.Property[propertyType]["index"]+i) + ')');
                        LSD.U.getIRILabel(iri, propertyType, resultsNode);
                    })(i);
                };

                $('#lsd-cube-designer thead button[value="' + propertyType + '"]').addClass("dn");
            }
            if(qbAttributeProperty) {
                var qbAPs = qbAttributeProperty.split(',');
                var propertyType = 'qb:AttributeProperty';

                for (var i = 0; i < qbAPs.length; i++) {
                    (function (i) {
                        var iri = LSD.U.decodeString(qbAPs[i]);
                        var resultsNode = tdParent.find('td:nth-child(' + (LSD.C.Property[propertyType]["index"]+i) + ')');
                        LSD.U.getIRILabel(iri, propertyType, resultsNode);
                    })(i);
                };

                $('#lsd-cube-designer thead button[value="' + propertyType + '"]').addClass("dn");
            }

            if (qbDimensionProperty && qbMeasureProperty) {
                $('.downloadButton:disabled').removeAttr('disabled').attr('enabled', 'enabled');
                $('#export').addClass('opacity-1');
            }
        },

        encodeString: function(string) {
	        return encodeURIComponent(string).replace(/'/g,"%27").replace(/"/g,"%22");
        },
        decodeString: function(string) {
	        return decodeURIComponent(string.replace(/\+/g,  " "));
        },

        downloadButtonRefresh: function() {
            if ($('.qbComponentProperty tbody td[class="qb:DimensionProperty"] .property').length > 0 &&
                $('.qbComponentProperty tbody td[class="qb:MeasureProperty"] .property').length > 0) {

                $('.downloadButton:disabled').removeAttr('disabled').attr('enabled', 'enabled');
                $('#export').addClass('opacity-1');
            }
            else {
                $('.downloadButton:enabled').removeAttr('enabled').attr('disabled', 'disabled');
                $('#export').removeClass('opacity-1');
            }
        },


        getInput: function() {
            $('#lsd-cube-designer').on('click', '.propertyButton', function(event) {
//TODO: Sanitize
                var propertyType = $(this).attr('value');
                var propertyName = $(this).attr('title');
                var parent = $(this).parent();

                var node = '';
                var propertyInput = $.parseHTML('<input class="propertyInput" type="text" placeholder="' + propertyName +'" title="' + propertyType + '" size="20" maxlength="20"/>');

                if (LSD.C.Property["qb:DimensionProperty"]["index"] == 0) {
                    node = $('#lsd-cube-designer tbody td:nth-child(' + (LSD.C.Property[propertyType]["index"]+1) + ')');
                }
                else {
                    var thQBDimensionProperty = $('#lsd-cube-designer thead th[colspan]');
                    var colspan = parseInt(thQBDimensionProperty.attr('colspan'));

                    if(propertyType == 'qb:DimensionProperty') {                        
                        thQBDimensionProperty.attr('colspan', (colspan+1));
                        $('#lsd-cube-designer tbody td:nth-child(' + (LSD.C.Property[propertyType]["index"]) + ')').after('<td class="' + propertyType + '"></td>');
                        node = $('#lsd-cube-designer tbody td:nth-child(' + (LSD.C.Property[propertyType]["index"]+1) + ')');
                    }
                    else {
                        index = ($(this).parent().index() == 0) ? 0 : (colspan + $(this).parent().index());  
                        node = $('#lsd-cube-designer tbody td:nth-child(' + index + ')');
                    }
                }

                node.html(propertyInput);
                node.find('.propertyInput').focus();

                $(this).addClass("dn");
            });


            $('#lsd-cube-designer').on('keyup', '.propertyInput', function(event) {
//TODO: Sanitize
                if(event.keyCode == 13) { // Enter Key
//TODO: Sanitize
                    var propertyType = $(this).attr('title');
                    var propertyInput = $(this).val();
                    var indexNode = $('#lsd-cube-designer tbody td:nth-child(' + ($(this).parent().index()+1) + ')');

                    indexNode.find('.results').remove();
                    indexNode.append('<ul class="results"></ul>');

                    var resultsNode = indexNode.find('.results');

                    for (var i = 0; i < LSD.C.Org.length; i++) {
                        (function (i) {
                            var queryURL = LSD.U.createSPARQLQueryURLWithTextInput(LSD.C.Org[i]["void:sparqlEndpoint"], propertyType, propertyInput);
                            LSD.U.getSPARQLQuery(queryURL, 'getPropertyInfo', resultsNode, LSD.C.Org[i]);
                        })(i);
                    }

                    setTimeout(function() {
                        if (resultsNode.find('li').length == 0) {
                            resultsNode.addClass('no-matches');
                            resultsNode.append('<li class="note">No results found for <em>' + propertyInput + '</em></li>');
                            indexNode.find('.propertyInput').focus();

                            resultsNode.removeClass(LSD.S.Processing);
                        }
                    }, 200);
                }

                if(event.keyCode == 27) { // Escape Key
                    var propertyType = $(this).attr('title');
                    var propertyName = $(this).attr('placeholder');

                    if (propertyType == 'qb:DimensionProperty') {
                        var thQBDimensionProperty = $('#lsd-cube-designer thead th[colspan]');
                        thQBDimensionProperty.attr('colspan', (parseInt(thQBDimensionProperty.attr('colspan'))-1));

                        if(LSD.C.Property[propertyType]["index"] > 0) {
                            $(this).closest('td[class="qb:DimensionProperty"]').remove();
                        }
                        else {
                            $(this).parent().empty();
                        }
                    }
                    else {
                        $(this).parent().empty();
                    }

                    $('#lsd-cube-designer thead button[value="' + propertyType + '"]').removeClass('dn');
                }
            });


            $('#lsd-cube-designer').on('click', '.moreButton', function(event) {
                var parent = $(this).parent();
                parent.addClass(LSD.S.Processing);
                var sparqlEndpoint = $(this).attr("title");
                var property = $(this).attr("value");
                var queryURL = LSD.U.createSPARQLQueryURLCodeList(sparqlEndpoint, property);

                LSD.U.getSPARQLQuery(queryURL, 'getCodeListInfo', parent, '');
                $(this).remove();
                parent.removeClass(LSD.S.Processing);
                parent.append('<button class="addButton" value="' + property + '" title="Add property">&#10004;</button>');
            });


            $('#lsd-cube-designer').on('click', '.addButton', function(event) {
                var td = $(this).closest('td');
                var i = td.index();
                var propertyType = td.attr('class');
                var property = $(this).parent().find('.property');

                if($(this).closest('td[class="qb:DimensionProperty"]').length > 0) {
                    $('#lsd-cube-designer thead button[value="' + propertyType + '"]').removeClass('dn');

                    $.each(LSD.C.Property, function(i, v) {
                        LSD.C.Property[i]["index"] += 1;
                    });
                }

                $('#lsd-cube-designer tbody td:nth-child(' + (i+1) + ') .results').remove();
                $('#lsd-cube-designer tbody tr:first-child td:nth-child(' + (i+1) + ')').html(property.get(0).outerHTML + ' <button class="removeButton" value="' + propertyType + '">x</button>');

                LSD.U.downloadButtonRefresh();

                LSD.U.historyUpdate();
            });


            $('#lsd-cube-designer').on('click', '.removeButton', function(event) {
                var td = $(this).closest('td');
                var propertyType = td.attr('class');

                $('#lsd-cube-designer thead button[value="' + propertyType + '"]').removeClass('dn');

                if($(this).closest('td[class="qb:DimensionProperty"]').length > 0) {
                    var thQBDimensionProperty = $('#lsd-cube-designer thead th[colspan]');

                    if(thQBDimensionProperty.attr('colspan') > 1) {
                        $(this).closest('td[class="qb:DimensionProperty"]').remove();
                        thQBDimensionProperty.attr('colspan', (parseInt(thQBDimensionProperty.attr('colspan'))-1));
                    }
                    else {
                        $(this).parent().empty();
                    }

                    $.each(LSD.C.Property, function(i, v) {
                        LSD.C.Property[i]["index"] -= 1;
                    });
                }
                else {
                    $(this).parent().empty();
                }

                LSD.U.downloadButtonRefresh();

                LSD.U.historyUpdate();
            });


            $('#export').on('click', '.downloadButton', function(event) {
                var components = componentSpecification = '';
                var delimiter = '/';
                var start = 3;
                var componentsList = {};

                components = "<" + $.map($('.qbComponentProperty tbody a.property'), function( i ) {
                    var property = i.href;
                    var c = "http://example.org/component/foo/" + property.split(delimiter).slice(start).join(delimiter);
                    componentsList[property] = c;
                    return c;
                }).join("> ,\n        <") + ">";

                $.each($('.qbComponentProperty tbody td'), function(index, value) {
                    var cSProperty = cSOrder = '';
                    var cProperty = $(value).find("a.property").attr("href");

                    switch($(value).attr('class')) {
                        case 'qb:DimensionProperty':
                            cSProperty = 'qb:dimension';
                            cSOrder = " ;\n    qb:order \"" + (index+1) + "\"^^xsd:int" ;
                            break;
                        case 'qb:MeasureProperty':
                            cSProperty = 'qb:measure';
                            break;
                        case 'qb:AttributeProperty':
                            cSProperty = 'qb:attribute';
                            break;
                    }

                    componentSpecification += "<" + componentsList[cProperty] + ">\n" +
                    "    a qb:ComponentSpecification ;\n" +
                    "    qb:componentProperty <" + cProperty + "> ;\n" +
                    "    " + cSProperty + " <" + cProperty + ">";

                    componentSpecification += cSOrder;

                    componentSpecification += "\n    .\n\n"
                });

                var data =
                    "# Created using LSD Cube Designer https://github.com/csarven/lsd-cube-designer\n" +
                    "@prefix e: <http://example.org/> .\n" +
                    "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n" +
                    "@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n" +
                    "@prefix qb: <http://purl.org/linked-data/cube#> .\n" +
                    "@prefix sdmx: <http://purl.org/linked-data/sdmx#> .\n\n" +

                    "# Example dataset using the structure:\n" +
                    "#<http://example.org/dataset/foo>\n" +
                    "#    a qb:DataSet ;\n" +
                    "#    qb:structure <http://example.org/structure/foo> ;\n" +
                    "#    .\n\n" +

                    "<http://example.org/structure/foo>\n" +
                    "    a qb:DataStructureDefinition ;\n" +
                    "    qb:component\n" +
                    "        " + components + "\n" +
                    "    .\n\n" +

                    componentSpecification

                    ;

                location.href = 'data:text/turtle;charset=utf-8,' + encodeURIComponent(data);
            });
        },

        createSPARQLQueryURLCodeList: function(sparqlEndpoint, property) {
var query= "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n\
PREFIX dcterms: <http://purl.org/dc/terms/>\n\
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n\
PREFIX qb: <http://purl.org/linked-data/cube#>\n\
CONSTRUCT {\n\
    <" + property + "> qb:codeList ?codeList .\n\
    ?codeList skos:hasTopConcept ?hasTopConcept .\n\
    ?hasTopConcept skos:prefLabel ?hasTopConceptPrefLabel .\n\
    ?codeList skos:prefLabel ?prefLabel .\n\
    ?codeList skos:definition ?definition .\n\
    ?codeList dcterms:license ?license .\n\
    ?codeList owl:versionInfo ?versionInfo .\n\
    ?codeList dcterms:issued ?issued .\n\
}\n\
WHERE {\n\
    {\n\
        SELECT ?codeList ?hasTopConcept ?hasTopConceptPrefLabel\n\
        WHERE {\n\
            <" + property + "> qb:codeList ?codeList .\n\
            OPTIONAL {\n\
                ?codeList skos:hasTopConcept ?hasTopConcept .\n\
                OPTIONAL { ?hasTopConcept skos:prefLabel ?hasTopConceptPrefLabel . }\n\
            }\n\
        }\n\
        LIMIT 1\n\
    }\n\
    OPTIONAL { ?codeList skos:prefLabel ?prefLabel . }\n\
    OPTIONAL { ?codeList skos:definition ?definition . }\n\
    OPTIONAL { ?codeList dcterms:license ?license . }\n\
    OPTIONAL { ?codeList owl:versionInfo ?versionInfo . }\n\
    OPTIONAL { ?codeList dcterms:issued ?issued . }\n\
}\n\
LIMIT 1";

            return sparqlEndpoint + "?query=" + LSD.U.encodeString(query);
        },

        createSPARQLQueryURLWithTextInput: function(sparqlEndpoint, propertyType, textInput) {
var query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n\
PREFIX qb: <http://purl.org/linked-data/cube#>\n\
CONSTRUCT {\n\
    ?property skos:prefLabel ?prefLabel .\n\
}\n\
WHERE {\n\
    ?property a " + propertyType + " .\n\
    OPTIONAL { ?property skos:prefLabel ?prefLabel . }\n\
    OPTIONAL { ?property rdfs:label ?prefLabel . }\n\
    OPTIONAL { ?property qb:concept/skos:prefLabel ?prefLabel . }\n\
    OPTIONAL { ?property qb:concept/rdfs:label ?prefLabel . }\n\
    FILTER (!STRSTARTS(STR(?property), 'http://purl.org/linked-data/sdmx/'))\n\
    FILTER (REGEX(?prefLabel, '" + textInput +"', 'i'))\n\
    FILTER (LANG(?prefLabel) = '' || LANGMATCHES(LANG(?prefLabel), '" + LSD.C.Lang + "'))\n\
}";
            return sparqlEndpoint + "?query=" + LSD.U.encodeString(query);
        },


        createSPARQLQueryURLWithIRILabel: function(sparqlEndpoint, iri) {
var query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n\
PREFIX dcterms: <http://purl.org/dc/terms/>\n\
PREFIX qb: <http://purl.org/linked-data/cube#>\n\
CONSTRUCT {\n\
    <" + iri + "> skos:prefLabel ?prefLabel .\n\
}\n\
WHERE {\n\
    OPTIONAL { <" + iri + "> skos:prefLabel ?prefLabel . }\n\
    OPTIONAL { <" + iri + "> rdfs:label ?prefLabel . }\n\
    OPTIONAL { <" + iri + "> dcterms:title ?prefLabel . }\n\
    OPTIONAL { <" + iri + "> qb:concept/skos:prefLabel ?prefLabel . }\n\
    OPTIONAL { <" + iri + "> qb:concept/rdfs:label ?prefLabel . }\n\
    OPTIONAL { <" + iri + "> skos:notation ?prefLabel . }\n\
    OPTIONAL { <" + iri + "> dcterms:identifier ?prefLabel . }\n\
    FILTER (LANG(?prefLabel) = '' || LANGMATCHES(LANG(?prefLabel), '" + LSD.C.Lang + "'))\n\
}\n\
LIMIT 1";
            return sparqlEndpoint + "?query=" + LSD.U.encodeString(query);
        },


        getIRILabel: function(iri, propertyType, resultsNode) {
            var queryA = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n\
PREFIX dcterms: <http://purl.org/dc/terms/>\n\
PREFIX qb: <http://purl.org/linked-data/cube#>\n\
SELECT ?prefLabel\n\
WHERE {\n\
    OPTIONAL { <" + iri + "> skos:prefLabel ?prefLabel . }\n\
    OPTIONAL { <" + iri + "> rdfs:label ?prefLabel . }\n\
    OPTIONAL { <" + iri + "> dcterms:title ?prefLabel . }\n\
    OPTIONAL { <" + iri + "> skos:notation ?prefLabel . }\n\
    OPTIONAL { <" + iri + "> dcterms:identifier ?prefLabel . }\n\
    FILTER (LANG(?prefLabel) = '' || LANGMATCHES(LANG(?prefLabel), '" + LSD.C.Lang + "'))\n\
}\n\
LIMIT 1";

            var queryB = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n\
PREFIX dcterms: <http://purl.org/dc/terms/>\n\
PREFIX qb: <http://purl.org/linked-data/cube#>\n\
SELECT ?concept\n\
WHERE {\n\
    <" + iri + "> qb:concept ?concept .\n\
}\n\
LIMIT 1";

            var store = rdfstore.create();
            store.load('remote', iri, function(success, results){
                if (success) {
                    store.execute(queryA, function(success, results) {
                        if (results.length > 0) {
                            resultsNode.append('<a target="_blank" class="property" href="' + iri + '">' + results[0].prefLabel.value + '</a> <button class="removeButton" value="'+ propertyType + '">x</button>');
                        }
                        else {
                            store.execute(queryB, function(success, results) {
                                if (results.length > 0) {
                                    var concept = results[0].concept.value;
                                    var queryC = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n\
PREFIX dcterms: <http://purl.org/dc/terms/>\n\
PREFIX qb: <http://purl.org/linked-data/cube#>\n\
SELECT ?prefLabel\n\
WHERE {\n\
    <" + concept + "> skos:prefLabel ?prefLabel .\n\
    OPTIONAL { <" + concept + "> rdfs:label ?prefLabel . }\n\
    FILTER (LANG(?prefLabel) = '' || LANGMATCHES(LANG(?prefLabel), '" + LSD.C.Lang + "'))\n\
}\n\
LIMIT 1";
                                    var store = rdfstore.create();
                                    store.load('remote', concept, function(success, results){
                                        if (success) {
                                            store.execute(queryC, function(success, results) {
                                                if (results.length > 0) {
                                                    resultsNode.append('<a target="_blank" class="property" href="' + iri + '">' + results[0].prefLabel.value + '</a> <button class="removeButton" value="'+ propertyType + '">x</button>');
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        },


        getSPARQLQuery: function(queryURL, queryType, resultsNode, org) {
            rdfstore.create(function(store) {
//            new rdfstore.Store({persistent:false, name:org["void:sparqlEndpoint"], overwrite:true}, function(store){

//                var query = 'LOAD <' + queryURL + '> INTO GRAPH <' + org["void:sparqlEndpoint"] + '>';
                store.load('remote', queryURL, function(success, results){
//                store.execute(query, function(success, results){
                    if (success) {
                       switch(queryType) {
                            case 'getPropertyInfo':
                                var query ="PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n\
SELECT ?property ?prefLabel\n\
WHERE {\n\
    ?property skos:prefLabel ?prefLabel .\n\
}";
                                break;

                            case 'getCodeListInfo':
                                var query ="PREFIX owl: <http://www.w3.org/2002/07/owl#>\n\
PREFIX dcterms: <http://purl.org/dc/terms/>\n\
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n\
PREFIX qb: <http://purl.org/linked-data/cube#>\n\
SELECT ?property ?codeList ?prefLabel ?definition ?license ?versionInfo ?issued ?hasTopConcept ?hasTopConceptPrefLabel\n\
WHERE {\n\
    ?property qb:codeList ?codeList .\n\
    OPTIONAL { ?codeList skos:prefLabel ?prefLabel .}\n\
    OPTIONAL { ?codeList skos:hasTopConcept ?hasTopConcept .}\n\
    OPTIONAL { ?hasTopConcept skos:prefLabel ?hasTopConceptPrefLabel . }\n\
    OPTIONAL { ?codeList skos:definition ?definition . }\n\
    OPTIONAL { ?codeList dcterms:license ?license . }\n\
    OPTIONAL { ?codeList owl:versionInfo ?versionInfo . }\n\
    OPTIONAL { ?codeList dcterms:issued ?issued . }\n\
}";
                                break;
                        }

                        store.execute(query, function(success, results) {
                            if (results.length > 0) {
                                var s = '';

                                switch(queryType) {
                                    case 'getPropertyInfo':
                                        s += '<li class="' + org["dcterms:identifier"].toLowerCase() + '"><a target="_blank" href="' + org["foaf:homepage"] + '">' + org["foaf:name"] + '</a> (' + org["dcterms:identifier"] + ') <ul>';
                                        $.each(results, function(index, object) {
                                            var conceptSchemePrefLabel = '';
                                            if (object.conceptSchemePrefLabel) {
                                                conceptSchemePrefLabel = ' (<a target="_blank" href="' + object.conceptScheme.value + '">' + object.conceptSchemePrefLabel.value + '</a>)';
                                            }

                                            s += '<li><a class="property" target="_blank" href="' + object.property.value + '">' + object.prefLabel.value + '</a>' + conceptSchemePrefLabel + ' <button class="moreButton" value="' + object.property.value + '" title="' + org["void:sparqlEndpoint"] + '">i</button></li>';
                                        });
                                        s += '</ul></li>';
                                        break;

                                    case 'getCodeListInfo':
                                        var codeList = definition = prefLabel = license = versionInfo = issued = hasTopConcept = '';

                                        $.each(results, function(index, object) {
                                            prefLabel += (object.prefLabel) ? object.prefLabel.value : object.codeList.value ;
                                            codeList += '<a target="_blank" href="' + object.codeList.value + '">' + prefLabel + '</a>';

                                            definition += (object.definition) ? '<li>' + codeList + ': ' + object.definition.value + '</li>' : '<li>' + codeList + '</li>';

                                            var hasTopConceptPrefLabel =  '';
                                            hasTopConcept += (object.hasTopConcept) ? '<li>e.g: <a  target="_blank" href="' + object.hasTopConcept.value + '">' + ((object.hasTopConceptPrefLabel && object.hasTopConceptPrefLabel.value != '') ? object.hasTopConceptPrefLabel.value : object.hasTopConcept.value) + '</a></li>' : '';

                                            license += (object.license) ? '<li>License: <a target="_blank" href="' + object.license.value + '">' + object.license.value + '</a></li>' : '';

                                            versionInfo += (object.versionInfo) ? '<li>Version: ' + object.versionInfo.value + '</li>' : '';

                                            issued += (object.issued) ? '<li>Issued: ' + object.issued.value + '</li>' : '';
                                        });

                                        s += '<ul class="qbCodeListInfo">' + definition + hasTopConcept + license + versionInfo + issued + '</ul>';
                                        break;
                                }

                                resultsNode.append(s);
                                resultsNode.removeClass(LSD.S.Processing + ' ' + LSD.S.NoMatches);
                                resultsNode.find('.note').remove();
                            }

                        });
                    }
                    else {
                        //TODO
                    }
                });
            });
        }
    }
};

$(document).ready(function () {
    LSD.U.init();
});
