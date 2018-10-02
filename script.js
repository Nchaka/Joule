var tags = '';
var elements = [];
var currEl = '0';
var prevEl = '-1';
var nextEl = '1';
var surNdx = '0';
function getRadioGroup(group) {
    tags = "<form>";
    group.map(function (name) {
        tags += "<label>" + name + "<input type='radio' name='group' value='" + name + "' /></label>";
    });
    tags += "</form>";
    return tags;
}
function getMatrixCaption(col) {
    var caption = "<th></th>";
    col.map(function (name) {
        caption += "<th>" + name + "</th>";
    });
    return caption;
}
function getMatrixRadio(col, item) {
    var radio = "";
    col.map(function (name) {
        radio += "<td><label><input type='radio' name='" + item + "' /></label></td>";
    });
    return radio;
}
function getMatrix(col, row) {
    var thtags = '';
    tags = '';
    col.map(function (name, nDex) {
        tags += "<tr ><td>" + row[nDex] + "</td>" + getMatrixRadio(col, row[nDex]) + "</tr>";
    });
    var ths = getMatrixCaption(col);
    tags = "<div class='table'><table>" + ths + tags + "</table></div>";
    return tags;
}
function getHeaders(el) {
    var html = '';
    if (el.name) {
        html += "<h2>" + el.name + "</h2>";
    }
    if (el.title) {
        html += "<h3>" + el.title + "</h3>";
    }
    return html;
}
function getRating(el) {
    var rating = "";
    var stars = "<div class='rating'><strong onclick='enableRating()' data-value='1'>&#10023;</strong><strong onclick='enableRating()' data-value='2'>&#10023;</strong><strong onclick='enableRating()' data-value='3'>&#10023;</strong><strong onclick='enableRating()' data-value='4'>&#10023;</strong><strong onclick='enableRating()' data-value='5'>&#10023;</strong></div>";
    if (el.title) {
        return stars + el.title;
    }
    else {
        return stars + "<a href='#'>Please rate this survey</a>";
    }
}
function getText(el) {
    var txtHTML = "";
    if (el.title) {
        txtHTML += "<textarea>" + el.title + "</textarea>";
        return txtHTML;
    }
}
function getDropDown(dropdown) {
    tags = '';
    tags += "<select>";
    dropdown.map(function (name) {
        tags += "<option value='" + name + "'>" + name + "</option>";
    });
    tags += "</select>";
    return tags;
}
function getElementType(els) {
    var html = '';
    elements = [];
    els.map(function (el, nDex) {
        elements.push({
            'name': el.name,
            'choices': el.choices,
            'index': nDex
        });
        html += (nDex === 0) ? "<div class='element showTEl'>" : "<div class='element'>";
        switch (el.type) { // Return the proper HTML based on the element type
            case 'radiogroup':
                html += getHeaders(el);
                html += getRadioGroup(el.choices);
                break;
            case 'matrix':
                html += getHeaders(el);
                html += getMatrix(el.columns, el.rows);
                break;
            case 'text':
                html += getHeaders(el);
                html += getText(el);
                break;
            case 'rating':
                html += getHeaders(el);
                html += "<a href='#' class='rating'>" + getRating(el) + "</a>";
                break;
            case 'dropdown':
                html += getHeaders(el);
                html += getDropDown(el.choices);
                break;
        }
        html += "</div>";
    });
    return html;
}
function insertReply(content) {
    var html = '';
    html = "<select onchange='switchSurvey()' id='selectSurvey'><option value='http://api.survey.services.joulecma.ca:8080/surveys?surveyId=1'>Survey No. 1</option><option value='http://api.survey.services.joulecma.ca:8080/surveys?surveyId=2'>Survey No. 2</option><option value='http://api.survey.services.joulecma.ca:8080/surveys?surveyId=972'>Survey No. 3</option></select>";
    html += "<span class='logoHolder'><a href='index.htm'><img class='logo' src='https://joule.cma.ca/content/joule/en/boilerplates/joule-header/_jcr_content/main_par/header/logo.img.png/1521126087297.png' alt='Joule Logo' /></a></span>";
    if (document.getElementsByTagName('BODY')[0]) {
        document.getElementsByTagName('BODY')[0].style.backgroundImage = 'none';
    }
    content.map(function (survey, sNdex) {
        html += "<div class='survey'>";
        html += "<span>" + survey.name + " <em>ID: " + survey.surveyId + "</em></span>";
        html += getElementType(survey.elements);
        html += "</div><div class='loader'></div>";
    });
    html += "<div class='questBtnHolder'><span id='prevQuest' class='questionsCtrl disabledQuestBtn' onclick='prevQuestion()'>&#60;</span>";
    html += "<span id='nextQuest' class='questionsCtrl' onclick='nextQuestion()'>&#62;</span></div>";
    document.getElementsByTagName('BODY')[0].innerHTML = html;
    if (document.getElementById('selectSurvey') !== null) {
        document.getElementById('selectSurvey').getElementsByTagName("option")[surNdx].selected = true;
    }
    nprocessing();
}
function prepareJSONP(url) {
    processing();
    if (!url) {
        url = 'http://api.survey.services.joulecma.ca:8080/surveys?surveyId=1';
    }
    var script = document.createElement('script'); // create script element
    var callbackStr = '&callback=insertReply';
    script.src = url + callbackStr; // assing src with callback name
    document.body.appendChild(script); // insert script to document and load content
}
function switchSurvey() {
    var nDex = document.getElementById('selectSurvey').selectedIndex;
    var url = document.getElementById('selectSurvey').getElementsByTagName("option")[nDex].value;
    prepareJSONP(url);
    currEl = '0';
    prevEl = '-1';
    nextEl = '1';
    surNdx = nDex;
}
function setThese(el, cName, prop) {
    if (el) {
        el.className = cName;
        prop;
    }
}
function prevQuestion() {
    if (prevEl >= 0) {
        setThese(document.getElementsByClassName('element')[currEl], 'element', currEl--);
        setThese(document.getElementsByClassName('element')[prevEl], 'element showTEl', prevEl--);
        setThese(document.getElementById('nextQuest'), 'questionsCtrl', nextEl--);
        if (currEl == 0 && prevEl == '-1' && nextEl == '1') {
            setThese(document.getElementById('prevQuest'), 'questionsCtrl disabledQuestBtn', 1);
        }
    }
    else {
        setThese(document.getElementById('prevQuest'), 'questionsCtrl disabledQuestBtn', 1);
    }
}
function nextQuestion() {
    if (nextEl <= (elements.length - 1)) {
        setThese(document.getElementsByClassName('element')[currEl], 'element', currEl++);
        setThese(document.getElementsByClassName('element')[nextEl], 'element showTEl', nextEl++);
        setThese(document.getElementById('prevQuest'), 'questionsCtrl', prevEl++);
        if (currEl == (elements.length - 1)) {
            setThese(document.getElementById('nextQuest'), 'questionsCtrl disabledQuestBtn', 1);
        }
    }
    else {
        setThese(document.getElementById('nextQuest'), 'questionsCtrl disabledQuestBtn', 1);
    }
}
function enableRating(event) {
    var e = e || window.event;
    var targ = e.target || e.srcElement;
    if (targ.nodeType == 3)
        targ = targ.parentNode; // defeat Safari bug
    if (document.getElementsByClassName('rating')[1]) {
        var rating = document.getElementsByClassName('rating')[1];
        var stars = Array.prototype.slice.call(rating.getElementsByTagName('STRONG'));
        stars.map(function (star, sNdx) {
            if (Number(sNdx) < Number(targ.getAttribute('data-value'))) {
                star.innerHTML = "&#10022;";
            }
        });
    }
}
function processing() {
    document.getElementsByClassName('loader')[0].style.display = 'block';
}
function nprocessing() {
    document.getElementsByClassName('loader')[0].style.display = 'none';
}
