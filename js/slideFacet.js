/**
 * AK: Sliding facets
 *
 * Copyright (C) AK Bibliothek Wien 2020.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @category Acdhch
 * @package  JavaScript
 * @author   Michael Birkner <michael.birkner@akwien.at>
 * @license  https://opensource.org/licenses/gpl-2.0.php GNU General Public License
 */

/**
 * Initialize the hierarchical slide facets. This function is called on hierarchical-facet-slide.phtml
 * 
 * @param {object} baseData Basic data that is passed from the hierarchical-facet-slide.phtml page
 */
function initSlideFacet(baseData) {
    // Get current query for appending it to the ajax call
    var query = window.location.href.split('?')[1];

    // Get the route parameters. This tells us from where the init call comes. This is especially
    // useful if certain actions should only be taken if the facets are displayed on certain pages,
    // e. g. on the NewItems page. See Acdhch\AjaxHandler\GetFacetData->getFacetData() for an
    // example.
    var route = window.location.pathname.split('/');
    // Remove the first element as this is always empty
    route.shift()

    // Some initial parameters
    var params = {
        baseData: baseData,
        menuWrapper: $('#slideMenu_'+baseData.facetName),
        facetWrapper: $('#slideMenu_'+baseData.facetName+'_facets'),
        backWrapper: $('#slideMenu_'+baseData.facetName+'_back'),
        event: 'initial', // Possible values: initial, forward, back
        facetValue: 0
    };
    
    // Query the facet data for the given Solr field
    $.getJSON(
        // Query the facet data. This executes the "method" of the GET parameters below.
        VuFind.path + '/AJAX/JSON?' + query,
        // GET parameter for ajax call
        {
            method: 'getFacetData',
            route: route,
            source: baseData.source,
            facetName: baseData.facetName,
            facetSort: baseData.facetSort,
            facetOperator: baseData.facetOperator
        },
        // Success callback function
        function setInitialFacets(response) {
            // Add facets to parameter object
            params.facets = response.data.facets;
            
            getAndProcessFacetsHtml(params);
        }
    );

    // Set the "inactive" class and the click handler for the back button
    params.backWrapper.find('a').addClass('slInactive');
    setBackClickHandler(params);
}

/**
 * Get the facet HTML and process it. That means:
 * - Set the initial facets to the facet wrapper without slide effect.
 * - If an arrow button was clicked, slide-in the newly loaded facets from the left
 * - If the back button was clicked, slide-in the previous facet level from the right
 * @param {object} params 
 */
function getAndProcessFacetsHtml(params) {
    // Get the facets as array of JS objects for building the HTML
    var filteredFacets = getFilteredFacets(params.event, params.facets, params.facetValue);

    // Get the current query and append it to the ajax call
    var query = window.location.href.split('?')[1];

    // Execute a post query to get the html with the facets
    $.post(
        // Query the template with GET params
        VuFind.path + '/AJAX/JSON?method=getSlideFacetTemplate&' + query,
        // POST data to the template
        {
            template: params.baseData.template,
            facets: JSON.stringify(filteredFacets)
        },
        // Function when we successfully got the template with the facet data
        function setTemplateData(response) {
            // Test with scroll container
            //params.facetWrapper.html('<div style="overflow-y: scroll; height: 200px; position: relative;">'+response.data+'</div>');

            // Process the html. That means: Set the facet html to the facet wrapper and (if applicable)
            // slide it in from left or right.
            processHtml(params, response.data);

            // Set the initial heights to the html wrappers. The heigths will stay the same until
            // the next page load as the facet wrapper gets cloned and will keep it's heigth.
            if (params.event == 'initial') {
                setHeights(params);
            }

            // Set the click handler for the forward arrows
            setForwardClickHanlder(params);
        },
        'json'
    ).error(function() {
        console.error('ERROR when getting facet HTML!');
    });
}

/**
 * Process the HTML with the facets: Set it to the facet wrapper and - if applicable - slide
 * it from left or right.
 * 
 * @param {object} params 
 * @param {string} html 
 */
function processHtml(params, html) {
    // Set the initial facet HTML to the facet wrapper (without slide effect)
    if (params.event == 'initial') {
        params.facetWrapper.html(html);
    }

    // Show the loaded facets with a slide effect
    if (params.event == 'forward' || params.event == 'back') {
        // We clone the current facets and prepend it to the menu wrapper. That has the effect that
        // the child or parent facets seem to slide over the still existing old (=cloned) facets. We
        // have to give the cloned wrapper a new ID because there never should be 2 elements with the
        // same ID and because we delete the old (=cloned) facets after the new ones are visible. For
        // that deletion we need a unique ID.
        var clonedFacetWrapper = params.facetWrapper.clone(false);
        clonedFacetWrapper.prop('id', params.facetWrapper.prop('id')+'_prev');
        params.menuWrapper.prepend(clonedFacetWrapper);

        // Move the new facets 101% to the left or right so that they are out of sight
        var marginLeft = (params.event == 'forward') ? '-101%' : '101%';
        params.facetWrapper.css({
            'margin-left': marginLeft
        });

        // Set the new facets to the now hidden wrapper
        params.facetWrapper.html(html);
        
        // Slide-in the wrapper with the facets
        params.facetWrapper.animate(
            {'margin-left': '0%'},
            500,
            function () {
                // On the end of the animation, remove the old (=cloned) facet wrapper as we
                // don't need it anymore.
                clonedFacetWrapper.remove();

                // Add or remove the "inactive" class from the back button after the animation
                // has finished. This indicates if a click on the back button would have an
                // effect or not.
                if (params.backWrapper.data('facet-value') == null) {
                    params.backWrapper.find('a').addClass('slInactive');
                } else {
                    params.backWrapper.find('a').removeClass('slInactive');
                }
            }
        );
    }
}

/**
 * Set the click handler for the arrows of the facets.
 * 
 * @param {object} params 
 */
function setForwardClickHanlder(params) {
    params.facetWrapper.off('click').on('click', '.slArrow:not(.slInactive)', function() {
        // Get the facet value that is set to the arrow in the "data-facet-value" attribute.
        var currentFacetValue = $(this).data('facet-value');

        // Set the facet value to the back button so that it knows where to go when it
        // get clicked.
        params.backWrapper.data('facet-value', currentFacetValue);

        // Set the parameter values and get the html
        params.event = 'forward';
        params.facetValue = currentFacetValue;
        getAndProcessFacetsHtml(params);
    });
}

/**
 * Set the click handler for the back button
 * 
 * @param {object} params 
 */
function setBackClickHandler(params) {
    params.backWrapper.off('click').click(function() {
        // Get the current facet value
        var facetValue = $(this).data('facet-value');

        // Deactivate back button if set initially (as we are then on the top level)
        // or if the facetValue is null (we are also on the top level).
        if (params.event == 'initial' || facetValue == null) {
            return;
        }
        
        // Get the parent facet value and set it to the data-facet-value
        // for using it as the new back value if the back button is clicked
        // again.
        var parentFacetValue = getParentFacetValue(facetValue);
        $(this).data('facet-value', parentFacetValue);

        // Set the parameter values and get the html
        params.event = 'back';
        params.facetValue = facetValue;
        getAndProcessFacetsHtml(params);
    });
}

/**
 * Set heights to the slide menu. This is necessary because we are working with
 * "position: absolute" which does not let grow it's parent container.
 * 
 * @param {object} params 
 */
function setHeights(params) {
    // Get heights of facet wrapper and button wrapper
    facetsHeight = params.facetWrapper.height();
    buttonHeight = params.backWrapper.height();
    // Set the heights
    params.menuWrapper.height(facetsHeight+buttonHeight);
    params.facetWrapper.height(facetsHeight);
    
}

/**
 * Get filter all facets and return a subset of it based on a facet value.
 * 
 * @param {string} event 
 * @param {array} allFacets 
 * @param {string} facetValue 
 */
function getFilteredFacets(event, allFacets, facetValue) {

    // TODO: Do we need the "levelToGet" or is it enough to just check if "facetValue" is 0 for returning allFacets
    // Calculate the facet level that we should get
    var levelToGet = 0;
    if (facetValue != '0') {
        levelToGet = (event == 'back')
            ? parseInt(facetValue.split('/')[0])
            : parseInt(facetValue.split('/')[0])+1;
    }
    // If we should get level 0, just return all facets as this is the top level
    if (levelToGet == 0) {
        return allFacets;
    }

    // Check if the "back" button was clicked. If yes, we need to get the grand parent value
    // for finally getting the parent facets.
    if (event == 'back') {
        // Get the grand parent value and set it to "facetValue" because below we get
        // all facets that have "facetValue" as parent.
        //var grandParentFacetValue = getGrandParentFacetValue(facetValue);
        //facetValue = (grandParentFacetValue != null) ? grandParentFacetValue : facetValue;

        var parentFacetValue = getParentFacetValue(facetValue);
        facetValue = (parentFacetValue != null) ? parentFacetValue : 0;
    }

    // Find all facets whose parent value is the same as the given facetValue
    var filteredFacets = allFacets.reduce(function getFacet(result, facet) {
        // If a facets parent value equels the given value in "facetValue", add it to the result
        if (facet.parent == facetValue) {
            result.push(facet);
        } else {
            if (facet.children && facet.children.length > 0) {
                // Recursion: Go through all nested children facets
                facet.children.reduce(getFacet, result);
            }
        }
        return result;
    }, []);

    // If the array with the filtered facets is empty, return all the facets as a fallback
    filteredFacets = (Array.isArray(filteredFacets) && filteredFacets.length > 0) ? filteredFacets : allFacets;

    return filteredFacets;
}

/**
 * Get parent facet value from a given facet value. Example: If we would have a value of
 * "4/A/B/C/D/E/", we would get "3/A/B/C/D/".
 * 
 * @param {(string|null)} facetValue Original hierarchical facet value for calculating the parent
 */
function getParentFacetValue(facetValue) {
    // Split the original facet value for which we need to calculate the parent value. Remove
    // any empty strings (caused by trailing slashes) with "filter".
    var splittedFacetValue = facetValue.split('/').filter(function(value){ return value !== "" });

    // Check if the current level is at least 1. If it is lower, there can't be a parent, so we
    // return null.
    var currentLevel = parseInt(splittedFacetValue[0]);
    if (currentLevel < 1) {
        return null;
    }

    // Get the parent level as a string
    var parentLevel = (currentLevel-1).toString();

    // Remove the first and the last element from splitted facet value. Only the values of the
    // parent will remain.
    splittedFacetValue.shift();
    splittedFacetValue.pop();

    // Add the parent level to the beginning of the array
    splittedFacetValue.unshift(parentLevel);

    // Join the array to the parent value and add a trailing slash
    var parentValue = splittedFacetValue.join('/')+'/';

    // Return the calculated value
    return parentValue;
}

/**
 * Get grand parent facet value from a given facet value. Example: If we would have a value of
 * "4/A/B/C/D/E/", we would get "2/A/B/C/".
 * 
 * @param {(string|null)} facetValue Original hierarchical facet value for calculating the grand parent
 */
/*
function getGrandParentFacetValue(facetValue) {
    // Split the original facet value for which we need to calculate the grand-parent value. Remove
    // any empty strings (caused by trailing slashes) with "filter".
    var splittedFacetValue = facetValue.split('/').filter(function(value){ return value !== "" });

    // Check if the current level is at least 2. If it is lower, there can't be a grand parent, so we
    // return null.
    var currentLevel = parseInt(splittedFacetValue[0]);
    if (currentLevel < 2) {
        return null;
    }

    // Get the grand-parent level as a string
    var grandParentLevel = (currentLevel-2).toString();

    // Remove the first and the last 2 elements from splitted facet value. Only the values of the
    // grand-parent will remain.
    splittedFacetValue.shift();
    splittedFacetValue.splice(-2, 2);

    // Add the grand-parent level to the beginning of the array
    splittedFacetValue.unshift(grandParentLevel);

    // Join the array to the grand-parent value and add a trailing slash
    var grandParentValue = splittedFacetValue.join('/')+'/';

    // Return the calculated value
    return grandParentValue;
}
*/
