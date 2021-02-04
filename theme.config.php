<?php
return [
    'extends' => 'bootstrap3',
    'favicon' => 'aksearch-favicon.ico',
    'helpers' => [
      'factories' => [
        'Acdhch\View\Helper\Root\AccountMenu' => 'Acdhch\View\Helper\Root\AccountMenuFactory',
        'Acdhch\View\Helper\Acdhch\Datepicker' => 'Acdhch\View\Helper\Acdhch\DatepickerFactory',
        'Acdhch\View\Helper\Root\Auth' => 'VuFind\View\Helper\Root\AuthFactory',
        'Acdhch\View\Helper\Root\Citation' => 'VuFind\View\Helper\Root\CitationFactory',
        'Acdhch\View\Helper\Root\Record' => 'VuFind\View\Helper\Root\RecordFactory',
        'Acdhch\View\Helper\Root\SearchBox' => 'Acdhch\View\Helper\Root\SearchBoxFactory',
        'VuFind\View\Helper\Root\RecordDataFormatter' => 'Acdhch\View\Helper\Root\RecordDataFormatterFactory'
      ],
      'aliases' => [
        'accountMenu' => 'Acdhch\View\Helper\Root\AccountMenu',
        'auth' => 'Acdhch\View\Helper\Root\Auth',
        'datepicker' => 'Acdhch\View\Helper\Acdhch\Datepicker',
        'searchbox' => 'Acdhch\View\Helper\Root\SearchBox',

        // Overrides
        'VuFind\View\Helper\Root\Citation' => 'Acdhch\View\Helper\Root\Citation',
        'VuFind\View\Helper\Root\Record' => 'Acdhch\View\Helper\Root\Record'
      ]
    ],
    'js' => [
        'lightbox.js',
        'vendor/klaro/klaro-config.js',
        'vendor/klaro/klaro.js'
    ],
    'less' => [
        'active' => true,
        'compiled.less'
    ]
];
