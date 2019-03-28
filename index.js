const request = require('request')
const fs = require('fs')
const merge = require('merge-images')
const sharp = require('sharp')


const args = process.argv.slice(2);

const merge_background = (img_url, background_url, position) =>{
  sharp(background_url)
    .composite([{ input:  img_url+'.png', gravity: position }])
    .toFile(img_url+'_output.png')
}

const remove_background = (image_url, background_url, position) => {
  let raw_img_url = image_url.slice(0, image_url.lastIndexOf('.'))
  let new_img_url = raw_img_url+".png"
  
  request.post({
      url: 'https://api.remove.bg/v1.0/removebg',
      formData: {
        image_file: fs.createReadStream(image_url),
        size: 'auto',
      },
      headers: {
        'X-Api-Key': 'qs35zXXePhJ1TMB7goiq1rXE'
      },
      encoding: null
    }, function(error, response, body) {
  
      if(error) return console.error('Request failed:', error)
      if(response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'))

      

      fs.writeFileSync(new_img_url, body)

      merge_background(raw_img_url, background_url, position)

  });
  
}


const switch_background = (entry_img = "default_img.jpg", background_img = "default_bg.jpg", position = "center") => {
  remove_background(entry_img, background_img, position)
}


switch_background(args[0], args[1], args[2])





