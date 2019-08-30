//Beginning of content.js
//---------------------------------------%%% Rightly Extension %%%-----------------------------------------
//---------------------------------------adding listener for brower action -----------------------------
// add listener to catch the user activating the extension
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        //was it clicked?
        if (request.message === "clicked_browser_action") {
            chrome.storage.local.get(['STATE'], function (result) {
                console.log('populating');
                populate();
                if (result.STATE != 1) {//if clicked before and not turned on, turn it on. 
                    chrome.storage.local.set({ STATE: 1 }, function () {});
                    //this storage needs to be turned off later, which will be by clearing
                    
                }
            });


        }
    }
);

//-------------------------------------------Recurring part begin-----------------------------------------
//If the state is run, allow the lister function to run
chrome.storage.local.get(['STATE'], function (result){
    if (result.STATE == 1) {
        //Reading a file
        chrome.runtime.sendMessage({ running: "yes" }, function (response) {
            console.log(response.cur_url);
            if (response.cur_url == "https://www.rightly-staging.co.uk/cms/companies/company/") {
                document.getElementsByClassName("button bicolor icon icon-plus")[0].click();
            }
            if (response.cur_url == "https://www.rightly-staging.co.uk/cms/companies/company/create/") {
                console.log('inserting');

                insert();
            }
            //chrome.storage.local.clear();
        });
//reading file done
        }
});
//-------------------------------------------Recurring part end--------------------------------------------


function csvToArray(data, delimeter) {
        // Retrieve the delimeter
        if (delimeter == undefined)
            delimeter = ',';
        if (delimeter && delimeter.length > 1)
            delimeter = ',';

        // initialize variables
        var newline = '\n';
        var eof = '';
        var i = 0;
        var c = data.charAt(i);
        var row = 0;
        var col = 0;
        var array = new Array();

        while (c != eof) {
            // skip whitespaces
            while (c == '\t' || c == '\r') {
                c = data.charAt(++i); // read next char
            }

            // get value
            var value = "";
            if (c == '\"') {
                // value enclosed by double-quotes
                c = data.charAt(++i);

                do {
                    if (c != '\"') {
                        // read a regular character and go to the next character
                        value += c;
                        c = data.charAt(++i);
                    }

                    if (c == '\"') {
                        // check for escaped double-quote
                        var cnext = data.charAt(i + 1);
                        if (cnext == '\"') {
                            // this is an escaped double-quote. 
                            // Add a double-quote to the value, and move two characters ahead.
                            value += '\"';
                            i += 2;
                            c = data.charAt(i);
                        }
                    }
                }
                while (c != eof && c != '\"');

                if (c == eof) {
                    throw "Unexpected end of data, double-quote expected";
                }

                c = data.charAt(++i);
            }
            else {
                // value without quotes
                while (c != eof && c != delimeter && c != newline && c != '\t' && c != '\r') {
                    value += c;
                    c = data.charAt(++i);
                }
            }

            // add the value to the array
            if (array.length <= row)
                array.push(new Array());
            array[row].push(value);

            // skip whitespaces
            while (c == '\t' || c == '\r') {
                c = data.charAt(++i);
            }

            // go to the next row or column
            if (c == delimeter) {
                // to the next column
                col++;
            }
            else if (c == newline) {
                // to the next row
                col = 0;
                row++;
            }
            else if (c != eof) {
                //unexpected character
                throw "Delimiter expected after character " + i +" " + data.charAt(++i);
            }

            // go to the next character
            c = data.charAt(++i);
        }

        return array;
}

function populate() {
    var csv = '﻿11 Degrees,dpo@example.99,fashion,00_Trial,\"11 Degrees offer a range of men\'s & women\'s t-shirts, jackets, jeans & tracksuits\"\nAcqua Di Parma,dpo@example.100,Fashion,00_Trial,\"Acqua di Parma is an Italian lifestyle and fashion company that produces fragrances, candles, bathrobes and leather accessories\"\nArket,dpo@example.101,Fashion,00_Trial,\"Arket is a unique, Nordic-inspired fashion and homewares store\"\nBirchbox,dpo@example.102,Fashion,00_Trial,Birchbox is a New York City-based online monthly subscription service that sends a box of four to five beauty related products\nBuccellati,dpo@example.103,Fashion,00_Trial,Buccellati Holding Italia is a Chinese-owned Italian jewellery and watch company\nCarhartt,dpo@example.104,Fashion,00_Trial,A collection of durable and comfortable men\'s and women\'s clothing\nDamsel In A Dress,dpo@example.105,Fashion,00_Trial,Damsel in a Dress is a contemporary clothing brand for women\nDeborah Lippmann,dpo@example.106,Fashion,00_Trial,Deborah Lippmann is a celebrity and fashion manicurist who has designed nail polishes\nFashionBeans,dpo@example.107,Fashion,00_Trial,\"Men\'s Fashion, Style & Grooming Advice\"\nFor Love & Lemons,dpo@example.108,Fashion,00_Trial,Los Angeles women\'s fashion brand\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,\n,,,,';
    var arr = csvToArray(csv, ',');

    chrome.storage.local.get(['key'], function (result) {
        //concatenate that result with the most recent result
        chrome.storage.local.set({ key: arr }, function () { });
        console.log('array stored');

    });

}

function insert() {
    chrome.storage.local.get(['key'], function (result){
        var arr = result.key;
        console.log('got the array');
        console.log(arr);
        var a = arr.pop();
        document.getElementsByName('name')[0].value = a[0];
        document.getElementsByName('email')[0].value = a[1];
        s = document.getElementById('id_industries').childNodes.length
        for (i = 1; i < s; i += 2) {
            if (document.getElementById('id_industries').childNodes[i].childNodes[0].innerText.includes(a[2]) || document.getElementById('id_industries').childNodes[i].childNodes[0].innerText.includes(a[3])) {
                document.getElementById('id_industries').childNodes[i].childNodes[0].childNodes[0].checked = true
            }
        }
        document.getElementsByClassName("public-DraftStyleDefault-block public-DraftStyleDefault-ltr")[0].childNodes[0].childNodes[0].innerText = a[4];
        document.getElementsByClassName('button action-save button-longrunning')[0].click();

        chrome.storage.local.get(['key'], function (result) {
            //concatenate that result with the most recent result
            total = arr;
            //save the total into the same key in our JSON Chrome storage
            chrome.storage.local.set({ key: total }, function () { });
            //if we have reached the last page, invoke the downloading procedure
            if (arr.length == 0) {
                //console.log('here')
                 chrome.storage.local.clear();
            }
        });
    });

}