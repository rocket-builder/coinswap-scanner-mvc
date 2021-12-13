/*let json = ' [\n' +
    '            "55877",\n' +
    '            {\n' +
    '                "token": {\n' +
    '                    "id": 122,\n' +
    '                    "title": "Synthetix",\n' +
    '                    "slug": "synthetix-network-token",\n' +
    '                    "symbol": "SNX",\n' +
    '                    "platform": {\n' +
    '                        "id": 0,\n' +
    '                        "type": 0,\n' +
    '                        "title": "Ethereum"\n' +
    '                    },\n' +
    '                    "quote": {\n' +
    '                        "usdPrice": {\n' +
    '                            "price": 5.54,\n' +
    '                            "volume24h": 58974572,\n' +
    '                            "updated": 1639228967770\n' +
    '                        }\n' +
    '                    }\n' +
    '                },\n' +
    '                "firstPair": {\n' +
    '                    "title": "SNX/USDT",\n' +
    '                    "url": "https://www.bitget.com/en/swap/cmt_snxusdt",\n' +
    '                    "exchange": {\n' +
    '                        "id": 0,\n' +
    '                        "title": "Bitget",\n' +
    '                        "quote": {\n' +
    '                            "usdPrice": {\n' +
    '                                "price": 0,\n' +
    '                                "volume24h": 0,\n' +
    '                                "updated": 1639228967736\n' +
    '                            }\n' +
    '                        }\n' +
    '                    },\n' +
    '                    "updated": 1639228967736,\n' +
    '                    "price": 5.51,\n' +
    '                    "volume24h": 108899\n' +
    '                },\n' +
    '                "secondPair": {\n' +
    '                    "title": "SNX/USDT",\n' +
    '                    "url": "https://www.bvnex.com/#/trade/snx_usdt",\n' +
    '                    "exchange": {\n' +
    '                        "id": 0,\n' +
    '                        "title": "Bvnex",\n' +
    '                        "quote": {\n' +
    '                            "usdPrice": {\n' +
    '                                "price": 0,\n' +
    '                                "volume24h": 0,\n' +
    '                                "updated": 1639228967738\n' +
    '                            }\n' +
    '                        }\n' +
    '                    },\n' +
    '                    "updated": 1639228967738,\n' +
    '                    "price": 12.3,\n' +
    '                    "volume24h": 1303729\n' +
    '                },\n' +
    '                "profitPercent": 76.249,\n' +
    '                "url": "https://coinmarketcap.com/currencies/synthetix-network-token/markets/",\n' +
    '                "recieveDate": 1639228967950\n' +
    '            }\n' +
    '        ]';



console.log(json);
for (let i = 0 ; i < 20; i ++)  {
    getForkHTML(JSON.parse(json));
}
let html = getForkHTML(JSON.parse(json));
*/