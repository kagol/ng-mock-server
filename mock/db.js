var Mock = require('mockjs');

const CARDS = Mock.mock({
  "error": null,
  "status": "success",
  "result": [{
    "comment_count": "@integer(100, 999)",
    "subject": '@title',
    "dueDate": "@date",
    "description": "@paragraph",
    "is_parent": "@boolean",
    "createdOn": "@date",
    "assignedTo": "@name",
    "updater": {
      "name": "@name",
      "id": "@guid",
      "nick_name": "@name",
      "domain_id": "@guid",
      "domain_name": "@name",
      "gender": "@string('lower', 4)"
    },
    "archived": "@boolean",
    "card_type_id": "@integer(100, 999)",
    "id": "@guid",
    "author": {
      "name": "@name",
      "id": "@guid",
      "nick_name": "@name",
      "domain_id": "@guid",
      "domain_name": "@name",
      "gender": "@string('lower', 4)"
    },
    "column": {
      "id": "@guid",
      "name": "@name",
      "parent_id": "@guid",
      "type": "@string('upper', 5)",
      "parent": {
        "id": "@guid",
        "name": "@name",
        "type": "@string('upper', 5)",
        "status_id": "@integer(100, 999)",
        "description": "@paragraph",
        "deleted": "@boolean"
      },
      "status_id": "@integer(100, 999)",
      "description": "@paragraph",
      "deleted": "@boolean"
    },
    "updatedOn": "@date",
    "priority": "@cword",
    "sequence": /\d{8}/,
    "status_update_date": "@date",
    "is_subscribed": "@boolean",
    "position": {
        "board": {
          "id": "@guid",
          "name": "@name",
          "work_type": "@integer(100, 999)"
        },
        "column": {
          "id": "@guid",
          "name": "@name",
          "parent_id": "@guid"
        },
        "lane": {
          "id": "@guid",
          "name": "@name"
        },
    },
    "attachment_count": "@integer(100, 999)",
    "has_description": "@boolean",
    "startDate": "@date"
  }]
});

const API = () => ({
  'cards': CARDS,
});

module.exports = API;
