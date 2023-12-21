const Util = {};

/* ************************
 * Constructs the navigation
 ************************** */
Util.getNav = async function (req, res, next) {
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    list += '<li><a href="/add_inventory" title="Add Inventory">Add Inventory</a></li>';
    list += '<li><a href="/incoming_inventory" title="Incoming Inventory">Incoming Inventory</a></li>';
    list += '<li><a href="/inventory_usage" title="Inventory Usage">Inventory Usage</a></li>';
    list += '<li><a href="/reports" title="Reports">Reports</a></li>';

    list += "</ul>";
    return list;
  };

module.exports = Util;
