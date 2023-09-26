console.log('popup.js')

chrome.storage.local.get(['tags_storage'], function(result) {
    console.log(result.tags_storage)
})