var fb = require('fb'),
Chance = require('chance'),
chance = new Chance(),
fs = require('fs'),
readline = require('readline');

// Set access token
accessToken = ''
fb.setAccessToken(accessToken);

// Read input file
const rl = readline.createInterface({
	input: fs.createReadStream('data.txt')
});

// Each post will be scheduled in intervals of 3 days
var publishCycle = 3,
publishTime = 18,
today = new Date();

today.setHours(publishTime);
today.setMinutes(0);

rl.on('line', (line) => {
	data = line.split(';');
	var postDate = today.setDate(today.getDate() + publishCycle);
	checkData(data[0], data[1], postDate);
});

function checkData(content, url, postDate) {
	checkType = url.split('.');

	postDate = Math.round(today.getTime() / 1000);

	if (checkType[checkType.length-1] == 'jpg' || checkType[checkType.length-1] == 'png' || checkType[checkType.length-1] == 'jpeg' ) {
		sendPost(content, url, postDate)
	} else if (checkType[checkType.length-1] == 'gif' || checkType[checkType.length-1] == 'mp4') {
		sendGif(content, url, postDate)
	} else {
		console.log("Unknown file ending.");
	}
}

rl.on('close', function(log) {
	console.log('***');
})

// Function to send a post with a picture
var pic_path = ''
function sendPost(content, url, postDate) {
	fb.api(pic_path + '/photos', 
		'post',	
		{ 
			source 	: fs.createReadStream(url),
			message	: content,
			published: 0,
			scheduled_publish_time: postDate
		}, 
		function (post) {
			if (!post || post.error) {
				console.log(!post ? 'Error occured' : post.error);
				return;
			}
			console.log('Posted! Post ID: ' + post.id);
		})
}


// Function to send a post with a GIF image
var gif_path = ''
function sendGif(content, url, postDate) {
	fb.api(gif_path + '/feed', 
		'post',	
		{ 
			link 	: url,
			message : content,
			published: 0,
			scheduled_publish_time: postDate
		}, 
		function (post) {
			if (!post || post.error) {
				console.log(!post ? 'Error occured' : post.error);
				return;
			}
			console.log('Posted! Post ID: ' + post.id);
		})
}