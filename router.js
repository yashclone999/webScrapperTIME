var express = require('express');
var router = express.Router();
var axios = require('axios');



const baseURL = 'https://time.com/';


const create_json = (arr) => {
    return obj = {
        "title": arr[1],
        "link" : baseURL+arr[0].substring(9)
    }
}

const getIndicesOf = (searchStr, str) => {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    var count = 0;
    index = str.indexOf(searchStr, startIndex);
    while (index > -1 && count < 5) {
        count++;
        indices.push(index);
        startIndex = index + searchStrLen;
        index = str.indexOf(searchStr, startIndex);
    }
    return indices;
}

const reduced_search_window = (start_string, end_string, str) => {
    let start = str.search(start_string);
    let end = str.search(end_string);
    return str.substring(start, end);
}

router.get('/',  async (req, res, next) => {

    //Array to store json object (news & link)
    var news = Array();

    try {
        const fetch = await axios({
            method: "get",
            url: baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        //HTML data in string format
        var data = fetch.data;

        //Narrowing down search space by looking for "div" which has required objects
        var str_start = "class=\"homepage-module latest\"";
        var str_end = "</section>";
        var strt = data.indexOf(str_start);
        var end = data.indexOf(str_end, strt);
        data = data.substring(strt, end);

        //In the "div" with " class="homepage-module latest" ", looking for latest news in "list" element
        //array indices stores starting index of every "list" element 
        var indices = getIndicesOf("<li>", data);
        indices.push(end);

        for (let i = 0; i < 5; i++) {

            //following further narrows down search space, for each "list" element

            let temp = data.substring(indices[i], indices[i + 1]);

            let str_start = "class=\"title\"";
            let str_end = "</h2>";
            temp = reduced_search_window(str_start, str_end, temp);

            str_start = "<a";
            str_end = "</a>";
            temp = reduced_search_window(str_start, str_end, temp);

            //json object consisting of news and link is stored in array- "news"
            var json_obj = create_json(temp.split("/>"));
            news.push(json_obj);
        }

        //send back array of json objects
        res.send(news);
    }
    catch (err) {
        res.send(err);
    }

});

module.exports = router;
