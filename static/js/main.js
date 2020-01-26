'use strict';

window.isMobile = (/ (android | bb\d +| meego).+mobile | avantgo | bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)));

window.browser = (function () {
    var ua = navigator.userAgent; var tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

let summaryPercentages = null;

$(document).ready(function () {
    cardLoader.loadCardCallback(null, 'start');
    getSummaryData();
});

function getSummaryData() {
    let url = 'https://us-central1-logan-ricky-davis.cloudfunctions.net/bnol-card-name-summary';
    let headers = { "Access-Control-Allow-Origin": "*" }
    axios.get(url, { headers: headers }).then(function (response) {
        let cardNames = response.data;
        cardNames.total -= cardNames.start;
        for (let cardKey in cardNames) {
            if (cardKey === 'total' || cardKey === 'start') { continue; }
            let cardName = cardNames[cardKey];
            cardNames[cardKey] = Math.round(cardName / cardNames.total * 100);
        }
        summaryPercentages = cardNames;
        console.log(summaryPercentages);
    }).catch(function (err) {
        console.log(err);
    }).finally(function () {
        self.startTime = new Date();
    });
}

function Card(name, img, imgAlt, title, description, yesCard, noCard, progress) {
    let self = this;
    this.name = name;
    this.callback = null;
    this.yesCard = yesCard;
    this.noCard = noCard;
    this.progress = progress;

    this.element = $.parseHTML(`<div id="comfortable" class="card" >` +
        `<img class="card-img-top" src="${img}" alt="${imgAlt}">` +
        `<div class="card-body">` +
        `<h5 class="card-title">${title}</h5>` +
        `<p class="card-text">${description}</p>` +
        `<button class="btn btn-primary btn-warning">Back</button>` +
        `<button class="btn btn-primary btn-danger">No</button>` +
        `<button class="btn btn-primary btn-success">Yes</button>` +
        `</div>` +
        `</div>`);

    this.setCallback = function (callback) {
        this.callback = callback;
    }

    this.initElement = function () {
        $(this.element).find('.btn-warning').on('click', function () {
            self.callback('back', null);
        });

        if (self.yesCard) {
            $(this.element).find('.btn-success').on('click', function () {
                self.callback('yes', self.yesCard);
            });
        } else if (!self.noCard) {
            $(this.element).find('.btn-success').text('Start Over!');
            $(this.element).find('.btn-success').on('click', function () {
                self.callback(null, 'start');
            });
        } else {
            $(this.element).find('.btn-success').hide();
        }

        if (self.noCard) {
            $(this.element).find('.btn-danger').on('click', function () {
                self.callback('no', self.noCard);
            });
        } else {
            $(this.element).find('.btn-danger').hide();
            $(this.element).find('.btn-warning').hide();
        }
    }
};

function CardLoader(parentDiv) {
    let self = this;
    this.parentDiv = parentDiv;
    this.activeCard = null;
    this.cards = {};
    this.previousCards = [];
    this.startTime = new Date();

    this.addCard = function (card) {
        card.setCallback(this.loadCardCallback);
        this.cards[card.name] = card;
    }

    this.loadCardCallback = function (buttonPressed, cardName) {
        let cardToLoad = self.cards[cardName];
        if (buttonPressed === 'back') {
            cardToLoad = self.previousCards.pop();
        } else {
            cardToLoad = self.cards[cardName];
            self.previousCards.push(self.activeCard);
        }
        self.activeCard = cardToLoad;

        $(parentDiv).fadeOut(250);
        if ($(parentDiv).html().length) {
            setTimeout(showCard, 240);
        } else {
            showCard();
        }

        function showCard() {
            $('.progress-bar').css('width', `${cardToLoad.progress}%`)
            $(parentDiv).html(cardToLoad.element);
            cardToLoad.initElement();
            $(parentDiv).fadeIn(250);
            if (!cardToLoad.noCard) {
                let cardName = cardToLoad.name;
                if (cardName !== 'start' &&
                    cardName in summaryPercentages) {
                    let resultStat = '<div class="resultStat">' +
                        `${summaryPercentages[cardName]}% of people end up here!</div>`;
                    $('.resultStat').remove();
                    $('.card-text').append(resultStat).show();
                }
                self.sendStat(cardName);
            }
        }
    }

    this.sendStat = function (cardName) {
        let url = 'https://us-central1-logan-ricky-davis.cloudfunctions.net/bnol-finish-stat-upload';
        let headers = { "Access-Control-Allow-Origin": "*" }
        axios.post(url, {
            cardName: cardName,
            browser: browser,
            mobileDevice: isMobile,
            duration: new Date - self.startTime
        }, { headers: headers }).then(function () {
        }).catch(function (err) {
            console.log(err);
        }).finally(function () {
            self.startTime = new Date();
        });
    }
};

let cardLoader = new CardLoader($('#cards'));
cardLoader.addCard(new Card('start', 'images/start-here.jpg', 'the start or beginning', 'Let\'s Get Started!!', '', 'comfortable', null, 0));
let comfortableDescription = 'You don\'t want to go outside your means to get something you simply want.';
cardLoader.addCard(new Card('comfortable', 'images/comfy.jpeg', 'comfortable', 'Can you comfortably afford it?', comfortableDescription, 'useForIt', 'borrow', 13));
let borrowDescription = 'Instead of buying something you may only use a few times, see if you know someone you could borrow it from!';
cardLoader.addCard(new Card('borrow', 'images/borrow-from-friend.jpg', 'ask to borrow', 'Could you borrow it from someone?', borrowDescription, 'borrowIt', 'rent', 63));
let rentDescription = 'Sometimes it is better to rent something out instead of buying it. Maybe apply for a no interest term.';
cardLoader.addCard(new Card('rent', 'images/rent.jpg', 'for rent sign', 'Can you rent it? Would it make sense to?', rentDescription, 'rentIt', 'actuallyWant', 75));
let actuallyWantDescription = 'Make sure it is something you actually want and is not simply an impulse decision.';
cardLoader.addCard(new Card('actuallyWant', 'images/actually-want.jpg', 'wanting something', 'Do you actually want this item?', actuallyWantDescription, 'saveUp', 'dontBuy', 88));
let useForItDescription = 'It is best to think over what you want to buy to make sure you want it.';
cardLoader.addCard(new Card('useForIt', 'images/use-for-it.jpg', 'useful item', 'Do you have a use for it? Have you been waiting to get it?', useForItDescription, 'notCredit', 'dailyBasis', 25));
let dailyBasisDescription = 'Make sure this is something you would actually frequently use.';
cardLoader.addCard(new Card('dailyBasis', 'images/daily-basis.jpg', 'daily basis', 'Would it be used on a daily basis?', dailyBasisDescription, 'fillNeed', 'dontBuy', 55));
let notCreditDescription = 'It is better to buy things use cash. If you have to use credit, make sure you can make the payment.';
cardLoader.addCard(new Card('notCredit', 'images/not-credit.jpg', 'credit card', 'Can you pay without using credit?', notCreditDescription, 'sameThing', 'happyLife', 38));
let happyLifeDescription = 'If this is something that would drastically change your life, it might be worth buying it on credit.';
cardLoader.addCard(new Card('happyLife', 'images/happy-life.jpg', 'happy life', 'Would it dramatically improve your life?', happyLifeDescription, 'sameThing', 'borrow', 40));
let sameThingDescription = 'You should\'nt buy something if you already have something that serves the same purpose.';
cardLoader.addCard(new Card('sameThing', 'images/same-thing.jpg', 'duplicate item', 'Do you own something that is basically the same thing?', sameThingDescription, 'dailyBasis', 'fillNeed', 50));
let fillNeedDescription = 'Why not spend your money on something you truly need as opposed to a simple want.';
cardLoader.addCard(new Card('fillNeed', 'images/fill-need.jpg', 'fills a need', 'Could your money be better spent on fulfilling a need?', fillNeedDescription, 'saveUp', 'discounts', 63));
let discountsDescription = 'Don\'t risk wasting money when there are coupons or same quality off brand options.';
cardLoader.addCard(new Card('discounts', 'images/discounts.jpg', 'discounts or coupons', 'Have you looked for sales, coupons, or generic verions?', discountsDescription, 'youSure', 'compareIt', 75));
let youSureDescription = 'If going through this process has made you reconsider, you may not have actually wanted this item.';
cardLoader.addCard(new Card('youSure', 'images/you-sure.jpg', 'question decision', 'After all of this, do yo still want it?', youSureDescription, 'buyIt', 'dontBuy', 88));
let borrowItDescription = 'Yay! You have an awesome friend that will let you borrow it! Go enjoy!';
cardLoader.addCard(new Card('borrowIt', 'images/ask-to-borrow.jpg', 'borrow it from a friend', 'Ask to borrow it!', borrowItDescription, null, null, 100));
let rentItDescription = 'Great! You\'ve found a good renting option and are able to get it!';
cardLoader.addCard(new Card('rentIt', 'images/rent-it.jpg', 'rent it instead', 'Rent it!', rentItDescription, null, null, 100));
let compareItDescription = 'Go shop around! Make sure this item is the best you can get!';
cardLoader.addCard(new Card('compareIt', 'images/compare-it.jpg', 'compare with other products', 'Go comparision shop!', compareItDescription, null, null, 100));
let dontBuyDescription = 'Wahoo! You just prevented yourself from making an impulse purchase and saved money!';
cardLoader.addCard(new Card('dontBuy', 'images/dont-buy.jpg', 'do not buy wait', 'Don\'t buy it!!!', dontBuyDescription, null, null, 100));
let saveUpDescription = 'If it\'s something you really want, go home and save up money to buy when you can!';
cardLoader.addCard(new Card('saveUp', 'images/save-up.jpg', 'save your money', 'Go save up!', saveUpDescription, null, null, 100));
let buyItDescription = 'Oh yeah! Buy it! Go Enjoy your purchase you smart spender you!';
cardLoader.addCard(new Card('buyIt', 'images/buy-it.jpg', 'buy it go shop', 'What are you waiting for? Buy it!', buyItDescription, null, null, 100));
