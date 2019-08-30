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
				else if(result.STATE==1){
					                 chrome.storage.local.clear();
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
    /*
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('copythis.txt'), true);
    console.log('we\'re here00');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            //... The content has been read in xhr.responseText
            console.log('we\'re here');
            console.log(this.responseText);
        }
    };
    xhr.send();
	*/
	var csv = 'Rab,test@example.100,retail - large,00_Trial,Outdoor clothing retailer\nPatagonia,test@example.101,fashion,00_Trial,Fashionable and sustainability driven outdoor clothing brand\nOsprey,test@example.102,fashion,00_Trial,Manufacturer and retailer of travel bags\nMontane,ssss,fashion,00_Trial,Manufacturer and retailer of outdoor clothing and equipment\nMarmot,test@example.104,retail - medium,00_Trial,Manufacturer and retailer of outdoor clothing and equipment';
    var arr = csvToArray(csv, ',');

    chrome.storage.local.get(['key'], function (result) {
        //concatenate that result with the most recent result
        chrome.storage.local.set({ key: arr }, function () { });
        console.log('array stored');

    });

}

function insert() {
    chrome.storage.local.get(['key'], function (result){
		var strerror = " ";
		var strsucc = " ";
		var error = false;
        var arr = result.key;
        console.log('got the array');
        console.log(arr);
        var a = arr.pop();
        document.getElementsByName('name')[0].value = a[0];
        document.getElementsByName('email')[0].value = a[1];
        s = document.getElementById('id_industries').childNodes.length
        var industry_found = 0;
        for (i = 1; i < s; i += 2) {
            if (document.getElementById('id_industries').childNodes[i].childNodes[0].innerText.trim().toLowerCase() == a[2].trim().toLowerCase() || document.getElementById('id_industries').childNodes[i].childNodes[0].innerText.trim().toLowerCase() ==a[3].trim().toLowerCase()) {
                document.getElementById('id_industries').childNodes[i].childNodes[0].childNodes[0].checked = true
                industry_found += 1;
            }
        }
        //document.getElementsByClassName("public-DraftStyleDefault-block public-DraftStyleDefault-ltr")[0].childNodes[0].getElementsByTagName('span')[0].innerText = a[4];
		desc = 'hi';

		document.getElementsByClassName('input  ')[6].innerHTML = '<input type="hidden" name="description" value="{&quot;blocks&quot;:[{&quot;key&quot;:&quot;cxwwj&quot;,&quot;text&quot;:&quot;'+a[4]+'&quot;,&quot;type&quot;:&quot;unstyled&quot;,&quot;depth&quot;:0,&quot;inlineStyleRanges&quot;:[],&quot;entityRanges&quot;:[],&quot;data&quot;:{}}],&quot;entityMap&quot;:{}}" data-draftail-input="" id="id_description"><script>window.draftail.initEditor("#id_description", {"enableHorizontalRule": true, "entityTypes": [{"type": "LINK", "icon": "link", "description": "Link", "attributes": ["url", "id", "parentId"], "whitelist": {"href": "^(http:|https:|undefined$)"}}, {"type": "DOCUMENT", "icon": "doc-full", "description": "Document"}, {"type": "IMAGE", "icon": "image", "description": "Image", "attributes": ["id", "src", "alt", "format"], "whitelist": {"id": true}}, {"type": "EMBED", "icon": "media", "description": "Embed"}], "inlineStyles": [{"type": "BOLD", "icon": "bold", "description": "Bold"}, {"type": "ITALIC", "icon": "italic", "description": "Italic"}, {"type": "BTN-PRIMARY", "icon": "radio-full", "description": "Button Primary", "style": {"background": "#43b1b0", "padding": "7px", "color": "white", "textTransform": "uppercase", "fontSize": "11px", "marginTop": "30px", "border": "2px solid #43b1b0"}}, {"type": "BTN-SECONDARY", "icon": "radio-empty", "description": "Button Secondary", "style": {"background": "#aaa", "padding": "7px", "color": "white", "textTransform": "uppercase", "fontSize": "11px", "marginTop": "30px", "border": "2px solid #aaa"}}], "blockTypes": [{"label": "H2", "type": "header-two", "description": "Heading 2"}, {"label": "H3", "type": "header-three", "description": "Heading 3"}, {"label": "H4", "type": "header-four", "description": "Heading 4"}, {"type": "ordered-list-item", "icon": "list-ol", "description": "Numbered list"}, {"type": "unordered-list-item", "icon": "list-ul", "description": "Bulleted list"}, {"type": "LEAD-TEXT", "label": "L", "description": "Lead Text", "element": "div"}]}, document.currentScript)</script><div class="Draftail-Editor__wrapper" data-draftail-editor-wrapper="true"><div class="Draftail-Editor Draftail-Editor--hide-placeholder"><div class="Draftail-Toolbar" role="toolbar"><div class="Draftail-ToolbarGroup"><button name="BOLD" class="Draftail-ToolbarButton" type="button" aria-label="BoldCtrl + B" data-draftail-balloon="true" tabindex="-1"><span><span class="icon icon-bold " aria-hidden="true"></span></span></button><button name="ITALIC" class="Draftail-ToolbarButton" type="button" aria-label="ItalicCtrl + I" data-draftail-balloon="true" tabindex="-1"><span><span class="icon icon-italic " aria-hidden="true"></span></span></button><button name="BTN-PRIMARY" class="Draftail-ToolbarButton" type="button" aria-label="Button Primary" data-draftail-balloon="true" tabindex="-1"><span><span class="icon icon-radio-full " aria-hidden="true"></span></span></button><button name="BTN-SECONDARY" class="Draftail-ToolbarButton" type="button" aria-label="Button Secondary" data-draftail-balloon="true" tabindex="-1"><span><span class="icon icon-radio-empty " aria-hidden="true"></span></span></button></div><div class="Draftail-ToolbarGroup"><button name="header-two" class="Draftail-ToolbarButton" type="button" aria-label="Heading 2##" data-draftail-balloon="true" tabindex="-1"><span class="Draftail-ToolbarButton__label">H2</span></button><button name="header-three" class="Draftail-ToolbarButton" type="button" aria-label="Heading 3###" data-draftail-balloon="true" tabindex="-1"><span class="Draftail-ToolbarButton__label">H3</span></button><button name="header-four" class="Draftail-ToolbarButton" type="button" aria-label="Heading 4####" data-draftail-balloon="true" tabindex="-1"><span class="Draftail-ToolbarButton__label">H4</span></button><button name="ordered-list-item" class="Draftail-ToolbarButton" type="button" aria-label="Numbered list1." data-draftail-balloon="true" tabindex="-1"><span><span class="icon icon-list-ol " aria-hidden="true"></span></span></button><button name="unordered-list-item" class="Draftail-ToolbarButton" type="button" aria-label="Bulleted list-" data-draftail-balloon="true" tabindex="-1"><span><span class="icon icon-list-ul " aria-hidden="true"></span></span></button><button name="LEAD-TEXT" class="Draftail-ToolbarButton" type="button" aria-label="Lead Text" data-draftail-balloon="true" tabindex="-1"><span class="Draftail-ToolbarButton__label">L</span></button></div><div class="Draftail-ToolbarGroup"><button name="HORIZONTAL_RULE" class="Draftail-ToolbarButton" type="button" aria-label="Horizontal line- - -" data-draftail-balloon="true" tabindex="-1"><span class="Draftail-ToolbarButton__label">―</span></button><button name="BR" class="Draftail-ToolbarButton" type="button" aria-label="Line break⇧ + ↵" data-draftail-balloon="true" tabindex="-1"><svg width="16" height="16" viewBox="0 0 1024 1024" class="Draftail-Icon " aria-hidden="true"><path d="M.436 633.471l296.897-296.898v241.823h616.586V94.117h109.517v593.796H297.333v242.456z"></path></svg></button></div><div class="Draftail-ToolbarGroup"><button name="LINK" class="Draftail-ToolbarButton" type="button" aria-label="LinkCtrl + K" data-draftail-balloon="true" tabindex="-1"><span><span class="icon icon-link " aria-hidden="true"></span></span></button><button name="DOCUMENT" class="Draftail-ToolbarButton" type="button" aria-label="Document" data-draftail-balloon="true" tabindex="-1"><span><span class="icon icon-doc-full " aria-hidden="true"></span></span></button><button name="IMAGE" class="Draftail-ToolbarButton" type="button" aria-label="Image" data-draftail-balloon="true" tabindex="-1"><span><span class="icon icon-image " aria-hidden="true"></span></span></button><button name="EMBED" class="Draftail-ToolbarButton" type="button" aria-label="Embed" data-draftail-balloon="true" tabindex="-1"><span><span class="icon icon-media " aria-hidden="true"></span></span></button></div><div class="Draftail-ToolbarGroup"><button name="undo" class="Draftail-ToolbarButton" type="button" aria-label="UndoCtrl + Z" data-draftail-balloon="true" tabindex="-1"><span class="Draftail-ToolbarButton__label">↺</span></button><button name="redo" class="Draftail-ToolbarButton" type="button" aria-label="RedoCtrl + ⇧ + Z" data-draftail-balloon="true" tabindex="-1"><span class="Draftail-ToolbarButton__label">↻</span></button></div></div><div class="DraftEditor-root"><div class="DraftEditor-editorContainer"><div aria-describedby="placeholder-5m7m6" class="notranslate public-DraftEditor-content" contenteditable="true" role="textbox" spellcheck="true" style="outline: none; user-select: text; white-space: pre-wrap; overflow-wrap: break-word;"><div data-contents="true"><div class="Draftail-block--unstyled " data-block="true" data-editor="5m7m6" data-offset-key="cxwwj-0-0"><div data-offset-key="cxwwj-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="cxwwj-0-0"><span data-text="true">'+a[4]+'</span></span></div></div></div></div></div></div></div></div><span></span>'
        if (industry_found == 2 && a[1].includes('@')) {
            document.getElementsByClassName('button action-save button-longrunning')[0].click();
			chrome.storage.local.get(['success'], function (result) {
				succ = strsucc.concat(result.success);
				//concatenate that result with the most recent result
				chrome.storage.local.set({ success: succ }, function () { });
			});
        }
		else if(a[1].includes('@')!=true){
			error = true;
			strerror = a[0] + "=          email address incorrect for " + a[0] + " . \n";
		}
        else {
			error = true;
            strerror = a[0] + '=          industries (' + a[2] + " , " + a[3] + ') not found so the company '+a[0]+' was not added\n';
        }
		
		if(error){
			location.reload();
			chrome.storage.local.get(['errors'], function (result) {
				err = strerror.concat(result.errors);
				//concatenate that result with the most recent result
				chrome.storage.local.set({ errors: err }, function () { });
			});
		}
		
        chrome.storage.local.get(['key'], function (result) {
            //concatenate that result with the most recent result
            total = arr;
            //save the total into the same key in our JSON Chrome storage
            chrome.storage.local.set({ key: total }, function () { });
            //if we have reached the last page, invoke the downloading procedure
            if (arr.length == 0) {
				    chrome.storage.local.get(['errors'], function (result) {
						//if we have reached the last page, invoke the downloading procedure
						saveTextAsFile(result.errors, 'Error');//look at the functions' explanations
					});
					chrome.storage.local.get(['success'], function (result) {
						//if we have reached the last page, invoke the downloading procedure
						saveTextAsFile(result.success,'Success');//look at the functions' explanations
					});
                 chrome.storage.local.clear();
            }
        });
    });

}

    //------------------------------------------saveTextAsFile() function start ---------------------

function saveTextAsFile(list, inp) {
        var textToWrite = list
        var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var fileNameToSaveAs = "Rightly CMS Insertion " + inp + " Log " + date;
        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download Report";
        if (window.webkitURL != null) {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        else {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
		}

    downloadLink.click();
}
//------------------------------------------saveTextAsFile() function end ---------------------------