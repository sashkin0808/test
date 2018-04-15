var api = {
    content: {},
    contactsGetAll: function(callback) {
        if (!localStorage["contacts"]) {
            api.content = [];
        } else {
            api.content = JSON.parse(localStorage["contacts"]);
        }
        setTimeout(callback, 2000, api.content);
    },
    contactsAdd: function(row, callback) {
        api.content.push(row);
        localStorage["contacts"] = JSON.stringify(api.content);
        setTimeout(callback, 1000);
    },
    contactsRemove: function(pos, callback) {
        api.content.splice(pos, 1);
        localStorage["contacts"] = JSON.stringify(api.content);
        setTimeout(callback, 1000);
    },
    contactsEdit: function(pos, row, callback) {
        api.content[pos] = row;
        localStorage["contacts"] = JSON.stringify(api.content);
        setTimeout(callback, 1000);
    }
};