// 開發模式
const api_user = '';
const api_note = '';
const api_comment = '';

/* -------------------------------------------------------------------------- */
/*                                   details                                  */
/* -------------------------------------------------------------------------- */
//
//
//
//
//
//
//
//
//
// 

/* -------------------------------------------------------------------------- */
/*                                  main code                                 */
/* -------------------------------------------------------------------------- */

// get noteId stored in URL Parameter
const urlParameter = new URL(window.location.toLocaleString()).searchParams;
const noteId = urlParameter.get('noteid');

console.log('URL Param: ' + noteId);

// get useId stored in Cookie
const currentUserId = Cookies.get('cav');
console.log('userId: ' + currentUserId);
console.log('cookie: ' + Cookies.get());

// const currentUserId = document.cookie;
// console.log('Cookie User: ' + currentUserId);

// [TODO]: should from .env
// 圖片路徑
var image_root = '../FileStorage/Note/';
// 圖片列表
var image_list = [];
// 圖片頁數
var current_page = 1;
// 筆記作者
var authorId = '';

/* ---------------------------------- Trans --------------------------------- */

/// 從 String 陣列改為 HTML
function getHTML(template) {
    return template.join('\n');
}

/* --------------------------------- Onload --------------------------------- */

/// 頁面載入時執行
window.onload = function () {
    getNote(noteId);
    getComment(noteId);
}

/// 利用 noteId 取得筆記資訊與圖片 
async function getNote(noteId) {
    // === 讀取筆記資訊
    var jsonObject;

    /*
    Input: 
        筆記 ID
    Output: 
        筆記名稱
        筆記標籤
        筆記敘述
        筆記時間
        筆記按讚數

        筆記圖片名稱陣列

        作者用戶 ID
    */
    // await fetch('http://127.0.0.1:8080/SA/api/User.do?Account=', {
    //     mode: 'no-cors', 
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ note_id: noteId, user_id: currentUserId})
    // })
    //     .then((response) => console.log(response))
    //     .then((data) => {
    //         console.log('response: \n'+data); 
    //         jsonObject =
    //         {
    //             // 筆記資訊
    //             'note_id': noteId,
    //             'note_name': data['NoteInfo']['NoteName'],
    //             'note_tag': data['NoteInfo']['Tag'],
    //             'note_description': data['NoteInfo']['NoteDescription'],
    //             'upload_time': data['NoteInfo']['UploadTime'],
    //             'like': data['NoteInfo']['Like'],
    //             'good': data['NoteInfo']['NoteName'],
    //             // 圖片資訊
    //             'note_pic': data['PicUrl'],
    //             // 作者資訊
    //             'author_id': data['Account'],
    //         }
    //     })
    //     .catch((error) => {
    //         // Handle errors
    //         console.error('Error:', error);
    //     });

    $.ajax({
        url: 'http://127.0.0.1:8080/SA/api/User.do?Account=',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ note_id: noteId, user_id: currentUserId }),
        dataType: 'json',
        success: function (data) {
            console.log('response: \n', data);

            // Check if 'NoteInfo' is present in the response
            if (data && data['NoteInfo']) {
                jsonObject = {
                    'note_id': noteId,
                    'note_name': data['NoteInfo']['NoteName'],
                    'note_tag': data['NoteInfo']['Tag'],
                    'note_description': data['NoteInfo']['NoteDescription'],
                    'upload_time': data['NoteInfo']['UploadTime'],
                    'like': data['NoteInfo']['Like'],
                    'good': data['NoteInfo']['NoteName'],
                    'note_pic': data['PicUrl'],
                    'author_id': data['Account'],
                };
            } else {
                console.error('NoteInfo not present in the response');
            }
        },
        error: function (error) {
            // Handle errors
            console.error('Error:', error);
        }
    });


    // ⚠️ 測試用的假資料
    var jsonObject =
    {
        'note_id': noteId,
        'note_name': 'SA Final',
        'note_tag': 'SA',
        'note_description': 'so much works to do',
        'upload_time': '2023/12/13',
        'like': 15,
        'good': 1,

        'note_pic': ['0.png', '1.png', '2.png', '3.png', '4.png'],

        'author_id': '999',
    }

    console.log('Note: \n' + JSON.stringify(jsonObject));

    // 儲存圖片位置
    image_root += jsonObject['note_id'];
    // 儲存圖片列表
    image_list = [''].concat(jsonObject['note_pic']);
    // 儲存作者 ID
    authorId = jsonObject['author_id'];

    console.log(image_list);

    // 更新頁面內容
    document.getElementById('note-name').innerHTML = jsonObject['note_name'];
    document.getElementById('note-description').innerHTML = jsonObject['note_description'];
    document.getElementById('note-tag').innerHTML = jsonObject['note_tag'];
    document.getElementById('note-upload-time').innerHTML = jsonObject['upload_time'];
    document.getElementById('note-like-count').innerHTML = jsonObject['like'];

    // 用戶按過讚
    if (jsonObject['good'] == 1) {
        document.getElementById('icon-like').src = "./static/icon/icons8-favorite-filled-64.png";
    }
    // 用戶沒按讚
    else {
        document.getElementById('icon-like').src = "./static/icon/icons8-favorite-64.png";

    }

    document.getElementById('note-current-page').innerHTML = current_page.toString();
    document.getElementById('note-total-page').innerHTML = (image_list.length - 1).toString();

    // === 讀取筆記圖片

    // 更新頁面內容
    document.getElementById('pic-displayed').src = image_root + '/' + image_list[current_page];

    document.getElementById('pic-prev').style.visibility = 'hidden';
    document.getElementById('pic-selected').src = image_root + '/' + image_list[current_page];
    document.getElementById('pic-next').src = image_root + '/' + image_list[current_page + 1];

    // === 讀取作者資料
    getAuthor(authorId);


}

/// 利用 userID 查詢作者資訊
async function getAuthor(authorId) {
    var jsonObject;

    /*
    Input: 
        用戶 ID
    Output: 
        用戶 ID
        用戶名稱
    */
    await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: authorId })
    })
        .then((response) => response.json())
        .then((data) => {
            jsonObject =
            {
                // 用戶資訊
                'user_id': data['Account'],
                'user_name': data['Name'],
            }
        })
        .catch((error) => {
            // Handle errors
            console.error('Error:', error);
        });

    // ⚠️ 測試用的假資料
    var jsonObject = {
        'user_id': 1, 'user_name': 'CAV'
    }

    console.log('User: \n' + JSON.stringify(jsonObject));

    // 更新頁面內容
    document.getElementById('user-name').innerHTML = jsonObject['user_name'];

    /// 是否為作者本人
    ifAuthor(currentUserId, jsonObject['user_id']);
}

/// 是否為作者本人
function IFCommenterORAuthor(commenterId) {
    // 留言者本人 OR 筆記作者
    if (currentUserId == commenterId || currentUserId == authorId) {
        // Display delete button
    }
}

/// 利用 noteID 取得相關留言
async function getComment(noteId) {
    var jsonArray;

    /*
    Input: 
        筆記 ID
    Output: 
        留言內容
        留言者 ID
    */
    await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_id: noteId })
    })
        .then((response) => response.json())
        .then((data) => {
            jsonArray = data.map((comment) => ({
                // 留言資訊
                'comment_id': comment['CommentID'],
                'content': comment['Content'],
                'time': comment['Time'],
                'commentor_id': comment['Account'],
            }));
        })
        .catch((error) => {
            // Handle errors
            console.error('Error:', error);
        });

    // ⚠️ 測試用的假資料
    var jsonArray = [
        { user_id: 1, time: '2023-12-15', content: "Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item Item " },
        { user_id: 2, time: '2023-12-12', content: "Item 2" },
        { user_id: 3, time: '2023-12-11', content: "Item 3" },
    ];

    console.log(jsonArray);

    // 迴圈建立子元素
    jsonArray.forEach((comment) => {
        var htmlElement =
            [
                '<div style="box-sizing: border-box; width: 100%; display: flex; flex-direction: column; background-color: #D9D9D9;">',
                '<textarea style="font-size: 24px; resize: none; height: auto" disabled>' + comment['content'] + '</textarea>',

                '<div style="padding: 1vh 5vh 1vh 5vh; display: flex; flex-direction: row; justify-content: space-between;">',
                '<span>' + comment['user_id'] + '</span>',
                '<span>' + comment['time'] + '</span>',
                '</div>',
                '</div>',
            ];

        // html append
        document.getElementById('comment-list').innerHTML += getHTML(htmlElement);
    })

    // 更新留言數
    document.getElementById('note-comment-count').innerHTML = jsonArray.length;
}

/* ------------------------- Picture Page Controller ------------------------ */

/// 上一頁
function prevPicture() {
    if (current_page > 1) {
        current_page -= 1; console.log('%c prev-page => ' + current_page, 'color: blue'); changeGallery(); document.getElementById('pic-next').style.visibility = 'visible';

        if (current_page == 1) {
            // hide <pic-prev>
            document.getElementById('pic-prev').style.visibility = 'hidden';
        }
    }
    else {
        console.log('%c 🛑 1st-page', 'color: red');
    }
}

/// 下一頁
function nextPicture() {
    if (current_page == image_list.length - 1) {
        console.log('%c 🛑 last-page', 'color: red');
    }
    else {
        current_page += 1; console.log('%c next-page => ' + current_page, 'color: blue'); changeGallery(); document.getElementById('pic-prev').style.visibility = 'visible';

        if (current_page == image_list.length - 1) {
            // hide <pic-next>
            document.getElementById('pic-next').style.visibility = 'hidden';
        }
    }
}

/// 修改顯示圖片
function changeGallery() {
    document.getElementById('note-current-page').innerHTML = current_page.toString();

    document.getElementById('pic-displayed').src = image_root + '/' + image_list[current_page];

    document.getElementById('pic-prev').src = image_root + '/' + image_list[current_page - 1];
    document.getElementById('pic-selected').src = image_root + '/' + image_list[current_page];
    document.getElementById('pic-next').src = image_root + '/' + image_list[current_page + 1];
}

/* ----------------------------- User Behaviour ----------------------------- */

/// 新增並上傳留言
// [TODO] 留言者的 userId
// [TODO] 留言為空 >> 提醒用戶
async function addComment() {
    // 留言內容
    var content = document.getElementById('comment-input').value;

    if (content == '') {
        document.getElementById('comment-input').placeholder = '! 請輸入文字'; 
    }
    else {

        // 清空紀錄
        document.getElementById('comment-input').value = '';

        // ⚠️ 測試用的假資料
        var jsonObject = {
            'comment_id': 'UUIDv4',
            'content': content,
            'time': 'NEW', // Date,now() : millisecond
            'commenter_id': currentUserId,
            'note_id': noteId,
        }

        console.log('New Comment: ' + JSON.stringify(jsonObject));

        // 到後端再儲存留言
        /*
        Input: 
            筆記 ID
            留言內容
            留言者用戶 ID
        */
        await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note_id: noteId, commenter_id: 'test', content: content })
        })
            .catch((error) => {
                // Handle errors
                console.error('Error:', error);
            });

        var htmlElement =
            [
                '<div style="box-sizing: border-box; width: 100%; display: flex; flex-direction: column; background-color: #D9D9D9;">',
                '<textarea style="font-size: 24px; resize: none; height: auto" disabled>' + jsonObject['content'] + '</textarea>',

                '<div style="padding: 1vh 5vh 1vh 5vh; display: flex; flex-direction: row; justify-content: space-between;">',
                '<span>' + jsonObject['commenter_id'] + '</span>',
                '<span>' + jsonObject['time'] + '</span>',
                '</div>',
                '</div>',
            ];

        // add to beginning
        document.getElementById('comment-list').insertAdjacentHTML('afterbegin', getHTML(htmlElement));
    }
}

// 刪除留言
async function deleteComment(comment_id, commenter_id) {



}

/// [TODO] 更新資料庫 request
/// 用戶按 / 收回讚
async function favorite() {
    var action;
    // 用戶沒按過讚
    if (document.getElementById('icon-like').getAttribute('src') == "./static/icon/icons8-favorite-64.png") {
        document.getElementById('icon-like').src = "./static/icon/icons8-favorite-filled-64.png";
        document.getElementById('note-like-count').innerHTML = (parseInt(document.getElementById('note-like-count').innerText) + 1).toString();

        action = 'add';
    }
    // 用戶已按過讚
    else {
        document.getElementById('icon-like').src = "./static/icon/icons8-favorite-64.png";
        document.getElementById('note-like-count').innerHTML = (parseInt(document.getElementById('note-like-count').innerText) - 1).toString();

        action = 'minus';
    }

    /*
    Input: 
        筆記 ID
        按讚用戶 ID
        執行動作代號（add / minus）
    */
    await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_id: noteId, user_id: currentUserId, action: action })
    })
        .catch((error) => {
            // Handle errors
            console.error('Error:', error);
        });
}



