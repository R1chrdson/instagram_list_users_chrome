console.log('popup.js')

chrome.storage.sync.get(['tags_storage'], function(result) {
    console.log(result.tags_storage)
})