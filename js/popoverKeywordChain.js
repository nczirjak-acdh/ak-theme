$(document).ready(function () {
    // AK: Initialize popover for keyword chains (see data-allSubjectHeadings.phtml)
    // See: https://getbootstrap.com/docs/3.4/javascript/#popovers
    // TODO: Check for accessibility (WCAG / ARIA)
    $('[data-toggle="popover"]').popover({
        title: VuFind.translate('searchFor')+' ...',
        html: true,
        placement: 'auto bottom',
        container: 'body',
        content: function() {
            var keyword = $(this).data('keyword');
            var keywordLink = $(this).data('keyword-link');
            var keywordchainSeparated = $(this).data('keywordchain-separated');
            var keywordchainLink = $(this).data('keywordchain-link');
            console.log(keywordchainSeparated);
            return '<div class="popoverEntry">'
                + VuFind.translate('currentTerm')+':<br />'
                + '<a href="'+keywordLink+'">'+keyword+'</a>'
                + '</div><div class="popoverEntry">'
                + VuFind.translate('currentAndPreviousTerms')+':<br />'
                + '<a href="'+keywordchainLink+'">'+keywordchainSeparated+'</a></div>';
        }
    });
});
