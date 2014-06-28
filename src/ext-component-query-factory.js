/*jslint nomen: true*/
/*global $,define,require,module,Ext */

function getComponent(el) {
    var cmp,
        target = el;

    while (target) {
        cmp = Ext.getCmp(target.id);

        if (cmp) {
            return cmp;
        }

        target = target.parentNode;
    }

    return null;
}

function getQuery(el) {
    var cmp = getComponent(el),
        query;

    if (!cmp) {
        return 'No component query available.';
    }

    // Depend on the ExtJS app, either itemId or cls may be the right one to use.
    // Use cmp.cls with cmp.getXType() to create 'someXtype[cls=someClass]'
    query = {
        itemId: cmp.getItemId(),
        cls: cmp.cls,
        xtype: cmp.getXType(),
        el: {
            name: el.nodeName,
            className: el.className
        }
    };

    return query;
}

module.exports = {
    getQuery: getQuery
};