/*
    This script injects button next to user tag in Instagram direct
    The button will send message to background.js to add user to the list
*/
DIRECT_CHAT_XPATH = "//div/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[2]/div"
BUTTON_PARENT_XPATH = "//div/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[2]/div/div/div/div/div/div[1]/div/div[1]"
BUTTON2_PARENT_XPATH = "//div/div/div/div[2]/div/div/div[1]/div[1]/div[1]/div/div/div/div/div[2]"
LINK_XPATH = "//div/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[2]/div/div/div/div/div/div[1]/div/div[1]/div[1]/a"
REQUESTS_HEADER_XPATH = "//div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[1]/div/div/div/div[1]/span"
START_MESSAGE_BUTTON = "//div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[2]/div/div/div/div[4]/div"

function getElementByXPath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function injectButton() {
    if (getElementByXPath(START_MESSAGE_BUTTON)) {
        console.log('Select dialog first!')
        return
    }
    let userTag = getElementByXPath(LINK_XPATH).getAttribute('href').slice(1, -1)
    chrome.storage.local.get(['tags_storage'], function(result) {
        if (result.tags_storage) {
            if (result.tags_storage.includes(userTag)) {
                return
            }
            result.tags_storage.push(userTag)
        }
        else {
            result.tags_storage = [userTag]
        }
        chrome.storage.local.set({tags_storage: result.tags_storage}, function() {
            console.log(`${userTag} added to list!`);
        })
    })
}

async function waitForElementToDisplay(path, timeout) {
    // Some hackish way to wait for chat to load
    while (getElementByXPath(path) == null) {
        console.log('Waiting for chat to load...')
        await new Promise(r => setTimeout(r, timeout));
    }
    return getElementByXPath(path)
}

let directChatElement = null
async function attachChatChangeObserver() {
    directChatElement = await waitForElementToDisplay(DIRECT_CHAT_XPATH, 4000);
    new MutationObserver((a) => {
        injectButton();
    }).observe(directChatElement, {childList: true, subtree: false});
    console.log('Chat change observer attached!')
    console.log(directChatElement)
}

function isBlacklistedPage() {
    let requestsHeaderElement = getElementByXPath(REQUESTS_HEADER_XPATH)
    if (requestsHeaderElement == null) {
        return true;
    }
    return requestsHeaderElement.innerText == 'Message requests';
}

setInterval(() => {
    if (isBlacklistedPage()) {
        return
    }

    if ((directChatElement == null) || (!directChatElement.isConnected)) {
        if (window.location.toString().includes('direct')) {
            attachChatChangeObserver();
        }
    }
}, 1000);