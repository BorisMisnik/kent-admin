/*!
 * Module: Module
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

/**
 * Admin panel main menu items
 */
var menu = {
        operator: [
            {
                url: '/accounts',
                title: 'Профiлi користувачiв',
                state: 'accounts'
                //path: '/accounts.js'
            },
            {
                url: '/gallery',
                title: 'Галерея',
                state: 'gallery'
                //path: '/gallery.js'
            },
            {
                url: '/requests',
                title: 'Запитання',
                state: 'requests'
                //path: '/requests.js'
            },
            {
                url: '/think',
                title: 'Думка про кент',
                state: 'thinks'
                //path: '/requests.js'
            }
        ],
        admin: [
            {
                url: '/accounts',
                title: 'Профiлi користувачiв',
                state: 'accounts'
                //path: '/accounts.js'
            },
            {
                url: '/gallery',
                title: 'Галерея',
                state: 'gallery'
                //path: '/gallery.js'
            },
            {
                url: '/requests',
                title: 'Запитання',
                state: 'requests'
                //path: '/requests.js'
            }
           
//            {
//                url: '/logs',
//                title: 'Журнали та звіти',
//                state: 'logs'
//            },
//            {
//                url: '/import',
//                title: 'Імпорт до бази',
//                state: 'imports'
//            },
//            {
//                url: '/cluster',
//                title: 'Кластер серверів',
//                state: 'cluster'
//            }
        ]
    };

exports.items =
    function( req, res ) {
        // todo: authorize
        if ( !req.user )
            return res.send([]);

        console.log( 'user:', req.user );
        var items = menu[ req.user.role ];
        res.send( items || []);
    };