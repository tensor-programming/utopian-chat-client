import Vue from 'vue'

// append the valid image types to Vue so that it can properly deal with them.
function fileValid(file,size = 100) {
  let types = ['image/jpeg','image/gif','image/png']
  let res = {
    flag: true
  }
  if(types.indexOf(file.type) < 0) {
    res.flag = false
    res.msg = 'Please use a gif，png, or jpg file type'
  } else if(file.size > size * 1024) {
    res.flag = false
    res.msg = `Image must not exceed ${size}KB`
  }

  return res
}

fileValid.types = {
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/png': 'png'
}

Object.defineProperty(Vue.prototype,'fileValid',{
  value: fileValid
})
