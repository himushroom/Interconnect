$(function() {
  // 1对1
  var a = $('.single').find('#a'),
    b = $('.single').find('#b'),
    line = $('.single').find('.line'),
    loader = $('.loader');
  // 初始化
  var center = getCenter(a);
  var data = getData(a, b);
  $(line).css({
    left: `${center.x}px`,
    top: `${center.y}px`,
    height: `${data.beveling}px`,
    transform: `rotate(${data.angle}deg)`
  });
  // 点击
  fnDown(a);
  fnDown(b);

  // 1对多
  var left = $('.one-to-many-left'),
    right = $('.one-to-many-right');
  getDom(left);
  getDom(right);

  loader.css('display', 'none');
});

function init(send, line, circle) {
  // 获得主模块的中心点已经主模块到其他模块的距离和角度
  var center = getCenter(send),
    data = geSingletData(send, circle);

  // 给每条连接线定位
  $(circle).map(i => {
    $(line)
      .eq(i)
      .css({
        left: `${center.x}px`,
        top: `${center.y}px`,
        height: `${data.beveling[i]}px`,
        transform: `rotate(${data.angle[i]}deg)`
      });
  });
}

// 初始化模块
function getDom(ele) {
  var line = $(ele).find('.line'),
    send = $(ele).find('.send'),
    circle = $(ele).find('.circle:not(.send)');
  // 初始化
  init(send, line, circle);
  // 窗口改变时重新计算
  $(window).resize(function() {
    init(send, line, circle);
  });
}

// 点击模块
function fnDown(ele) {
  var dld = $('.dld');
  $(ele).mousedown(function() {
    e = event || window.event;
    e.stopPropagation();
    // 光标按下时光标在模块中距离模块的距离
    // 这里的e是以目标模块为参考
    var disX = e.clientX - $(this).offset().left,
      disY = e.clientY - $(this).offset().top;
    // 移动
    $(document).bind('mousemove', function() {
      e = event || window.event;
      fnMove(e, disX, disY, ele);
    });
    // 释放
    $(document).bind('mouseup', function() {
      $(document).unbind('mousemove');
      $(document).unbind('mouseup');
    });
  });
}

// 模块跟随鼠标移动
function fnMove(e, posX, posY, ele) {
  var dld = $('.dld.single'),
    a = $('.single').find('#a'),
    b = $('.single').find('#b'),
    line = $('.single').find('.line');
  // 这里的e是以鼠标为参考
  var l = e.clientX - posX - $(dld).offset().left,
    t = e.clientY - posY - $(dld).offset().top,
    winW = $(dld).width(),
    winH = $(dld).height(),
    maxW = winW - $(ele).width(),
    maxH = winH - $(ele).height();
  // 限制拖动范围只能在dld中
  if (l < 0) {
    l = 0;
  } else if (l > maxW) {
    l = maxW;
  }
  if (t < 0) {
    t = 0;
  } else if (t > maxH) {
    t = maxH;
  }

  $(ele).css({ left: `${l}px`, top: `${t}px` });

  // 重新计算连接线的长度和角度
  var center = getCenter(a);
  var data = getData(a, b);
  $(line).css({
    left: `${center.x}px`,
    top: `${center.y}px`,
    height: `${data.beveling}px`,
    transform: `rotate(${data.angle}deg)`
  });
}

// 计算角度和斜边长度
function getData(ele1, ele2) {
  // 通过计算得到a和b离顶部和左侧的距离差
  var disX = $(ele1).offset().left - $(ele2).offset().left,
    disY = $(ele1).offset().top - $(ele2).offset().top;
  // 已知临边和斜边，通过atan计算得到a，b连线的倾斜角度
  var angle = -(Math.atan(disX / disY) * 180) / Math.PI;
  // 如果b模块在a模块上方
  if (disY >= 0) {
    // 如果b模块在a模块的左侧
    angle = disX > 0 ? angle + 180 : angle - 180;
  }
  // 已知临边和斜边，通过勾股定理得到斜边长度
  var beveling = Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2)).toFixed(2);

  return { angle: angle, beveling: beveling };
}

// 计算角度和斜边长度
function geSingletData(sendEle, receiveEle) {
  e = event || window.event;
  // 通过计算得到a和b离顶部和左侧的距离差
  var angle = [],
    beveling = [];
  var left = $(sendEle).offset().left,
    top = $(sendEle).offset().top;
  // 循环计算每个模块离主模块的距离和角度
  for (let i = 0; i < receiveEle.length; i++) {
    var disX =
      left -
      $(receiveEle)
        .eq(i)
        .offset().left;
    var disY =
      top -
      $(receiveEle)
        .eq(i)
        .offset().top;

    // 已知临边和斜边，通过atan计算得到a，b连线的倾斜角度
    var list = -(Math.atan(disX / disY) * 180) / Math.PI;
    // 如果b模块在a模块上方
    if (disY >= 0) {
      // 如果b模块在a模块的左上方
      list = disX > 0 ? list + 180 : list - 180;
    }

    angle.push(list);
    // 已知临边和斜边，通过勾股定理得到斜边长度
    beveling.push(Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2)).toFixed(2));
  }

  return { angle: angle, beveling: beveling };
}

// 获取线条依存模块的中心坐标
function getCenter(ele) {
  var box = $(ele).parents('.dld');
  var disX =
      $(ele).offset().left - $(box).offset().left + $(ele).width() / 2 - 1,
    disY = $(ele).offset().top - $(box).offset().top + $(ele).height() / 2 - 1;
  return { x: disX, y: disY };
}
