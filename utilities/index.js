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

Util.getCurrentDate = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();
  return `${month}/${day}/${year}`;
};

module.exports = Util;
