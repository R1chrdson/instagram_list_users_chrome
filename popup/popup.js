console.log('popup.js')

var list_container = document.getElementById('list-container')
var total_count = document.getElementById('total-count')
var sub_header = document.getElementById('sub-header')
var new_tag_input = document.getElementById('new-tag-input')
var add_button_input = document.getElementById('add-button-input')

chrome.storage.local.get(['tags_storage'], function (result) {
    total_count.innerHTML = `There are <b>${result['tags_storage'].length}</b> users`

    result['tags_storage'].forEach((element) => {
        let tag_li = document.createElement('li')
        tag_li.className = 'flex'

        let tag_text = document.createElement('p')
        tag_text.innerHTML = element

        let delete_button = document.createElement('button')
        delete_button.innerHTML = 'Delete'
        delete_button.onclick = function () {
            let element_idx = result['tags_storage'].indexOf(element);
            result['tags_storage'].splice(element_idx, 1);
            chrome.storage.local.set({ tags_storage: result['tags_storage'] }, function () {
                console.log(`${element} removed from list!`)
            })
            tag_li.remove()
            total_count.innerHTML = `There are <b>${result['tags_storage'].length}</b> users`
        }

        tag_li.appendChild(tag_text)
        tag_li.appendChild(delete_button)
        list_container.appendChild(tag_li)
    })

    copy_button = document.createElement('button')
    copy_button.innerHTML = 'Copy'
    copy_button.onclick = function () {
        console.log(JSON.stringify(result['tags_storage']))
        navigator.clipboard.writeText(JSON.stringify(result['tags_storage']))
    }
    sub_header.appendChild(copy_button)
})

add_button_input.addEventListener('click', async function () {
    if (!new_tag_input.value) {
        return
    }

    chrome.storage.local.get(['tags_storage'], function (result) {
        if (result.tags_storage) {
            if (result.tags_storage.includes(new_tag_input.value)) {
                return
            }
            result.tags_storage.push(new_tag_input.value)
        }
        else {
            result.tags_storage = [new_tag_input.value]
        }
        chrome.storage.local.set({ tags_storage: result.tags_storage }, function () {
            console.log(`${new_tag_input.value} added to list!`);
        })

        new_tag_input.value = ''

        
    })
})