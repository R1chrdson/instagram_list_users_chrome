/*
    This script injects button next to user tag in Instagram direct
    The button will send message to background.js to add user to the list
*/

DIRECT_CHAT_XPATH = "\/\/div/div/div/div[2]/div/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[2]/div"

function getElementByXPath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function injectButton() {
    console.log('Chat changed!')
}

async function waitForElementToDisplay(path, timeout) {
    // Some hackish way to wait for chat to load
    while (getElementByXPath(path) == null) {
        console.log('Waiting for chat to load...')
        await new Promise(r => setTimeout(r, timeout));
    }
}

async function attachChatChangeObserver() {
    await waitForElementToDisplay(DIRECT_CHAT_XPATH, 1000);
    new MutationObserver((a) => {
        injectButton();
    }).observe(getElementByXPath(DIRECT_CHAT_XPATH), {childList: true, subtree: false});
    console.log('Chat change observer attached!')
}

attachChatChangeObserver();
console.log('content.js is loaded!')
