/*!
 * Module: Module
 *
 * @author Andjey Guzhovskiy, <me.the.ascii@gmail.com>
 * @copyright (c) 2013 Andjey Guzhovskiy
 * @licence CLOSED
 * @version 0.0.1
 */

exports.items =
    function( req, res ) {

        // todo: authorize
        if ( !req.user )
            res.send([]);
        else
            res.send([
                { url: '/requests', title: 'Профiлi користувачiв' },
                { url: '/faq', title: 'Вiдповiдi на запитання' },
                { url: '/logs', title: 'Журнали та звіти' },
                { url: '/import', title: 'Імпорт до бази' }
            ]);
    };