/*
 * @title      LSD Cube Designer
 * @author     Sarven Capadisli <info@csarven.ca>
 * @license    Apache License 2.0
 */

var LSD = {

    C : {
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
            LSD.U.getInput();
        },

        encodeString: function(string) {
	        return encodeURIComponent(string).replace(/'/g,"%27").replace(/"/g,"%22");	
        },
        decodeString: function(string) {
	        return decodeURIComponent(string.replace(/\+/g,  " "));
        },

        getInput: function() {
            $('.downloadButton').attr("disabled", "disabled");

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
//TODO: Show concept scheme and example codes from a codelists, definitions?
                var parent = $(this).parent();
                parent.addClass(LSD.S.Processing);
                var sparqlEndpoint = $(this).attr("title");
                var property = $(this).attr("value");
                var queryURL = LSD.U.createSPARQLQueryURLCodeList(sparqlEndpoint, property);

                LSD.U.getSPARQLQuery(queryURL, 'getCodeListInfo', parent, '');
                $(this).remove();
                parent.removeClass(LSD.S.Processing);
                parent.append('<button class="addButton" value="' + property + '" title="Add property">&#10004;</button>');

                parent.on('click', '.addButton', function(event) {
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

                    td.on('click', '.removeButton', function(event) {
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

                        if ($('.qbComponentProperty tbody td[class="qb:DimensionProperty"] .property').length == 0 ||
                            $('.qbComponentProperty tbody td[class="qb:MeasureProperty"] .property').length == 0 ||
                            $('.qbComponentProperty tbody td[class="qb:AttributeProperty"] .property').length == 0) {
                            $('.downloadButton:enabled').removeAttr('enabled').attr('disabled', 'disabled');
                            $('#export').removeClass('opacity-1');
                        }
                    });

                    if ($('.qbComponentProperty tbody td[class="qb:DimensionProperty"] .property').length > 0 &&
                        $('.qbComponentProperty tbody td[class="qb:MeasureProperty"] .property').length > 0 &&
                        $('.qbComponentProperty tbody td[class="qb:AttributeProperty"] .property').length > 0) {

                        $('.downloadButton:disabled').removeAttr('disabled').attr('enabled', 'enabled');
                        $('#export').addClass('opacity-1');
                        
                        
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
                    }
                    else {
                        $('.downloadButton:enabled').removeAttr('enabled').attr('disabled', 'disabled');
                        $('#export').removeClass('opacity-1');                    
                    }

                });
            });

//            $('.results').on('click', '.inquiryButton', function(event) {
////TODO: Show concept scheme and example codes from a codelists, definitions?

//            });
        },

        createSPARQLQueryURLCodeList: function(sparqlEndpoint, property) {
//PREFIX owl: <http://www.w3.org/2002/07/owl#>
//PREFIX dcterms: <http://purl.org/dc/terms/>
//PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
//PREFIX qb: <http://purl.org/linked-data/cube#>

//SELECT *
//WHERE {
//    {
//        SELECT ?codeList ?hasTopConcept ?hasTopConceptPrefLabel
//        WHERE {
//            <http://oecd.270a.info/attribute/1.0/TIME_FORMAT> qb:codeList ?codeList .
//            OPTIONAL {
//                ?codeList skos:hasTopConcept ?hasTopConcept .
//                OPTIONAL { ?hasTopConcept skos:prefLabel ?hasTopConceptPrefLabel . }
//            }
//        }
//        LIMIT 1
//    }
//    OPTIONAL { ?codeList skos:prefLabel ?prefLabel . }
//    OPTIONAL { ?codeList skos:definition ?definition . }
//    OPTIONAL { ?codeList dcterms:license ?license . }
//    OPTIONAL { ?codeList owl:versionInfo ?versionInfo . }
//    OPTIONAL { ?codeList dcterms:issued ?issued . }
//}
//LIMIT 1

            return sparqlEndpoint + "?query=PREFIX+owl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0D%0APREFIX+dcterms%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0APREFIX+qb%3A+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23%3E%0D%0A%0D%0ASELECT+*%0D%0AWHERE+{%0D%0A++++{%0D%0A++++++++SELECT+%3FcodeList+%3FhasTopConcept+%3FhasTopConceptPrefLabel%0D%0A++++++++WHERE+{%0D%0A++++++++++++%3C" + property + "%3E+qb%3AcodeList+%3FcodeList+.%0D%0A++++++++++++OPTIONAL+{%0D%0A++++++++++++++++%3FcodeList+skos%3AhasTopConcept+%3FhasTopConcept+.%0D%0A++++++++++++++++OPTIONAL+{+%3FhasTopConcept+skos%3AprefLabel+%3FhasTopConceptPrefLabel+.+}%0D%0A++++++++++++}%0D%0A++++++++}%0D%0A++++++++LIMIT+1%0D%0A++++}%0D%0A++++OPTIONAL+{+%3FcodeList+skos%3AprefLabel+%3FprefLabel+.+}%0D%0A++++OPTIONAL+{+%3FcodeList+skos%3Adefinition+%3Fdefinition+.+}%0D%0A++++OPTIONAL+{+%3FcodeList+dcterms%3Alicense+%3Flicense+.+}%0D%0A++++OPTIONAL+{+%3FcodeList+owl%3AversionInfo+%3FversionInfo+.+}%0D%0A++++OPTIONAL+{+%3FcodeList+dcterms%3Aissued+%3Fissued+.+}%0D%0A}%0D%0ALIMIT+1";
        },

        createSPARQLQueryURLWithTextInput: function(sparqlEndpoint, propertyType, textInput) {
//PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
//PREFIX qb: <http://purl.org/linked-data/cube#>

//SELECT *
//WHERE {
//    ?property a qb:MeasureProperty .
//    OPTIONAL { ?property skos:prefLabel ?prefLabel . }
//    OPTIONAL { ?property qb:concept/skos:prefLabel ?prefLabel . }
//    OPTIONAL {
//        ?property qb:concept/skos:topConceptOf ?conceptScheme .
//        ?conceptScheme skos:prefLabel ?conceptSchemePrefLabel . 
//    }
//    FILTER (REGEX(?prefLabel, "value", 'i'))
//}

            return sparqlEndpoint + "?query=PREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0APREFIX+qb%3A+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23%3E%0D%0A%0D%0ASELECT+*%0D%0AWHERE+{%0D%0A++++%3Fproperty+a+" + propertyType + "+.%0D%0A++++OPTIONAL+{+%3Fproperty+skos%3AprefLabel+%3FprefLabel+.+}%0D%0A++++OPTIONAL+{+%3Fproperty+qb%3Aconcept%2Fskos%3AprefLabel+%3FprefLabel+.+}%0D%0A++++OPTIONAL+{%0D%0A++++++++%3Fproperty+qb%3Aconcept%2Fskos%3AtopConceptOf+%3FconceptScheme+.%0D%0A++++++++%3FconceptScheme+skos%3AprefLabel+%3FconceptSchemePrefLabel+.+%0D%0A++++}%0D%0A++++FILTER+%28REGEX%28%3FprefLabel%2C+%22" + textInput + "%22%2C+%27i%27%29%29%0D%0A}";
        },

        getSPARQLQuery: function(queryURL, queryType, resultsNode, org) {
           $.ajax({
                type: 'GET',
                dataType: 'json',
                url: queryURL,
//                data: '&output=json',
//                mimeType: 'application/sparql-results+json,

                beforeSend: function(xhr) {
                    resultsNode.addClass(LSD.S.Processing);
                },
                error: function (xhr, textStatus, errorThrown) {
//TODO
                    var errorReported = null;
//                    if (xhr.responseXML) {
//                        errorReported = $('#error', xhr.responseXML).text();
//                    }
                    alert(errorReported || errorThrown || textStatus);

                    resultsNode.removeClass(LSD.S.Processing);
                },
                timeout: 5000,
                success: function(data, textStatus) {
                    if (data.results.bindings.length > 0) {
                        switch(queryType) {
                            case 'getPropertyInfo':
                                var results = '<li class="' + org["dcterms:identifier"].toLowerCase() + '"><a target="_blank" href="' + org["foaf:homepage"] + '">' + org["foaf:name"] + '</a> (' + org["dcterms:identifier"] + ') <ul>';
                                $.each(data.results.bindings, function(index, object) {
                                    var conceptSchemePrefLabel = '';
                                    if (object.conceptSchemePrefLabel) {
                                        conceptSchemePrefLabel = ' (<a target="_blank" href="' + object.conceptScheme.value + '">' + object.conceptSchemePrefLabel.value + '</a>)';
                                    }

                                    results += '<li><a class="property" target="_blank" href="' + object.property.value + '">' + object.prefLabel.value + '</a>' + conceptSchemePrefLabel + ' <button class="moreButton" value="' + object.property.value + '" title="' + org["void:sparqlEndpoint"] + '">&#8505;</button></li>';
                                });
                                results += '</ul></li>';
                                break;

                            case 'getCodeListInfo':
                                var results = codeList = definition = prefLabel = license = versionInfo = issued = hasTopConcept = '';

                                $.each(data.results.bindings, function(index, object) {
                                    prefLabel += (typeof object.prefLabel !== "undefined") ? object.prefLabel.value : object.codeList.value ;
                                    codeList += '<a target="_blank" href="' + object.codeList.value + '">' + prefLabel + '</a>';

                                    definition += (typeof object.definition !== "undefined") ? '<li>' + codeList + ': ' + object.definition.value + '</li>' : '<li>' + codeList + '</li>';

                                    var hasTopConceptPrefLabel =  '';
                                    hasTopConcept += (typeof object.hasTopConcept !== "undefined") ? '<li>e.g: <a  target="_blank" href="' + object.hasTopConcept.value + '">' + ((typeof object.hasTopConceptPrefLabel !== "undefined" && object.hasTopConceptPrefLabel.value != '') ? object.hasTopConceptPrefLabel.value : object.hasTopConcept.value) + '</a></li>' : '';

                                    license += (typeof object.license !== "undefined") ? '<li>License: <a target="_blank" href="' + object.license.value + '">' + object.license.value + '</a></li>' : '';

                                    versionInfo += (typeof object.versionInfo !== "undefined") ? '<li>Version: ' + object.versionInfo.value + '</li>' : '';

                                    issued += (typeof object.issued !== "undefined") ? '<li>Issued: ' + object.issued.value + '</li>' : '';
                                });

                                results += '<ul class="qbCodeListInfo">' + definition + hasTopConcept + license + versionInfo + issued + '</ul>';

                                break;
                        }

                        resultsNode.append(results);
                        resultsNode.removeClass(LSD.S.Processing + ' ' + LSD.S.NoMatches);
                        resultsNode.find('.note').remove();
                    }
                }
            });
        }
    }
};

$(document).ready(function () {
    LSD.U.init();
});
