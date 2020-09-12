var Mock = require('mockjs');

const CARDS = Mock.mock({
  "error": null,
  "status": "success",
  "result|10": [{
    "column_id": "@guid",
    "card_list|20": [{
      "id": "@guid",
      "subject": '@title',
      "sequence": /\d{8}/,
      "index": "@integer(1, 100)",
      "archived": "@boolean",
      "blocked": "@boolean",
      "is_parent": "@boolean",
      "createdOn": "@date",
      "updatedOn": "@date",
      "parent": {
        "id": "@guid",
        "name": "@cword(2,10)"
      },
      "board": { // 卡片所在的看板
        "id": "@guid",
        "name": "@cword(2,10)"
      },
      "column": { // 状态列
        "id": "@guid",
        "name": "@cword(2,10)",
        "type": "@string('upper', 2, 20)",
        "deleted": "@boolean"
      },
      "card_type": { // 卡片类型
        "color": "@color",
        "name": "@cword(2,10)",
        "icon": /icon-[a-z]-{1-3}/,
        "id": "@integer(1, 100)"
      },
      "updater": {
        "name": "@name",
        "id": "@guid",
        "nick_name": "@name",
        "gender": "@string('lower', 4)"
      },
      "author": {
        "name": "@name",
        "id": "@guid",
        "nick_name": "@name",
        "gender": "@string('lower', 4)"
      },
    }]
  }]
});

const API = () => ({
  'cards': CARDS,
});

module.exports = API;
