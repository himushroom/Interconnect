$(function() {
  var a = $('#a'),
    b = $('#b'),
    line = $('.line')
  // 初始化
  var data = getData(a, b)
  $(line).css({
    height: `${data.beveling}px`,
    transform: `rotate(${data.angle}deg)`
  })
  // 点击
  fnDown(a)
  fnDown(b)
})

// 点击模块
function fnDown(ele) {
  var dld = $('.dld')
  $(ele).mousedown(function() {
    e = event || window.event
    e.stopPropagation()
    // 光标按下时光标在模块中距离模考的距离
    // 这里的e.client是以目标模块为参考
    var disX = e.clientX - $(this).offset().left,
      disY = e.clientY - $(this).offset().top
    // 移动
    $(document).bind('mousemove', function() {
      e = event || window.event
      fnMove(e, disX, disY, ele)
    })
    // 释放
    $(document).bind('mouseup', function() {
      $(document).unbind('mousemove')
      $(document).unbind('mouseup')
    })
  })
}

// 模块跟随鼠标移动
function fnMove(e, posX, posY, ele) {
  var dld = $('.dld'),
    a = $('#a'),
    b = $('#b'),
    line = $('.line')
  // 这里的e.client是以鼠标为参考
  var l = e.clientX - posX - $(dld).offset().left,
    t = e.clientY - posY - $(dld).offset().top,
    winW = $(dld).width(),
    winH = $(dld).height(),
    maxW = winW - $(ele).width(),
    maxH = winH - $(ele).height()
  if (l < 0) {
    l = 0
  } else if (l > maxW) {
    l = maxW
  }
  if (t < 0) {
    t = 0
  } else if (t > maxH) {
    t = maxH
  }
  $(ele).css('left', `${l}px`)
  $(ele).css('top', `${t}px`)

  // 重新计算连接线的长度和角度
  var data = getData(a, b)
  $(line).css({
    height: `${data.beveling}px`,
    transform: `rotate(${data.angle}deg)`
  })
}

// 计算角度和斜边长度
function getData(ele1, ele2) {
  e = event || window.event
  // 通过计算得到a和b离顶部和左侧的距离差
  var disX = $(ele1).offset().left - $(ele2).offset().left,
    disY = $(ele1).offset().top - $(ele2).offset().top
  // 已知临边和斜边，通过atan计算得到a，b连线的倾斜角度
  var angle = -(Math.atan(disX / disY) * 180) / Math.PI
  if (disY >= 0) {
    angle = disX > 0 ? angle + 180 : angle - 180
  }
  // 已知临边和斜边，通过勾股定理得到斜边长度
  var beveling = Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2)).toFixed(2)

  return { angle: angle, beveling: beveling }
}
