// By default, Klaro will load the config from  a global "klaroConfig" variable.
// You can change this by specifying the "data-config" attribute on your
// script take, e.g. like this:
// <script src="klaro.js" data-config="myConfigVariableName" />
// You can also disable auto-loading of the consent notice by adding
// data-no-auto-load=true to the script tag.
var klaroConfig = {
    // You can customize the ID of the DIV element that Klaro will create
    // when starting up. If undefined, Klaro will use 'klaro'.
    elementID: 'klaro',

    // How Klaro should store the user's preferences. It can be either 'cookie'
    // (the default) or 'localStorage'.
    storageMethod: 'cookie',

    // You can customize the name of the cookie that Klaro uses for storing
    // user consent decisions. If undefined, Klaro will use 'klaro'.
    cookieName: 'klaro',

    // You can also set a custom expiration time for the Klaro cookie.
    // By default, it will expire after 120 days.
    cookieExpiresAfterDays: 365,

    // You can change to cookie domain for the consent manager itself.
    // Use this if you want to get consent once for multiple matching domains.
    // If undefined, Klaro will use the current domain.
    //cookieDomain: '.github.com',

    // Put a link to your privacy policy here (relative or absolute).
    privacyPolicy: '/Content/privacy#cookies',

    // Defines the default state for applications (true=enabled by default).
    default: false,

    // If "mustConsent" is set to true, Klaro will directly display the consent
    // manager modal and not allow the user to close it before having actively
    // consented or declines the use of third-party apps.
    mustConsent: true,

    // Show "accept all" to accept all apps instead of "ok" that only accepts
    // required and "default: true" apps
    acceptAll: false,

    // replace "decline" with cookie manager modal
    hideDeclineAll: false,

    // You can define the UI language directly here. If undefined, Klaro will
    // use the value given in the global "lang" variable. If that does
    // not exist, it will use the value given in the "lang" attribute of your
    // HTML tag. If that also doesn't exist, it will use 'en'.
    //lang: 'de',

    // You can overwrite existing translations and add translations for your
    // app descriptions and purposes. See `src/translations/` for a full
    // list of translations that can be overwritten:
    // https://github.com/KIProtect/klaro/tree/master/src/translations

    // Example config that shows how to overwrite translations:
    // https://github.com/KIProtect/klaro/blob/master/src/configs/i18n.js
    translations: {
        // If you erase the "consentModal" translations, Klaro will use the
        // bundled translations.
        de: {
            acceptSelected: 'Auswahl speichern',
            consentModal: {
                description:
                    'Hier können Sie einsehen und anpassen, welche Cookies von dieser Webseite gespeichert werden.',
                privacyPolicy: {
                    name: 'Datenschutzerklärung',
                    text: 'Weitere Details finden Sie in unserer {privacyPolicy}. Dort können Sie die bereits getroffenen Einstellungen auch wieder ändern.'
                }
            },
            matomo: {
                description: 'Sammeln von Besucherstatistiken (DSGVO konform)',
            },
            functional: {
                description: 'Cookies die zur Ausführung einiger Funktionalitäten benötigt werden, jedoch nicht unbedingt für das generelle Funktionieren der Seite wichtig sind.',
            },
            required: {
                description: 'Notwendige Cookies damit die Seite korrekt funktioniert',
            },
            purposes: {
                analytics: 'Besucher-Statistiken',
                functional: 'Funktionalitäten der Seite',
                required: 'Benötigte Cookies',
            },
        },
        en: {
            consentModal: {
                description:
                    'Here you can see and customize the cookies that are saved by this website.',
                privacyPolicy: {
                    name: 'Privacy Statement',
                    text: 'Please find more information in our {privacyPolicy}. There you can change the settings you have already made.'
                }
            },
            matomo: {
                description: 'Collecting of visitor statistics (GDPR compliant)',
            },
            functional: {
                description: 'Cookies that are used for some functions on the site. They are not necessary for the site to work in general.',
            },
            required: {
                description: 'Required cookies for the site to work',
            },
            purposes: {
                analytics: 'Analytics',
                functional: 'Functional',
                required: 'Required',
            },
        }
    },

    apps: [
        {
            name: 'matomo',
            default: true,
            title: 'Matomo/Piwik',
            purposes: ['analytics'],
            cookies: [
                /^_pk_.*$/,
                'piwik_ignore',
            ],
            required: false,
            optOut: false,
            onlyOnce: true,
        },
        {
            name: 'functional',
            title: 'Funktional',
            default: true,
            purposes: ['functional'],
            cookies: [
                /^vufind_.*$/
            ],
            required: false,
            optOut: false,
            onlyOnce: true,
        },
        {
            name: 'required',
            title: 'Benötigt',
            purposes: ['required'],
            required: true
        },
    ],
};
