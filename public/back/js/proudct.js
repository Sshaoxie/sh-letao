/**
 * Created by 旺财大狗头 on 2018/6/28.
 */
$(function () {
  var currentPage=1;
  var pageSize=5;


  var picArr = [];
  //进入页面发送ajax请求
  function render() {
    $.ajax({
      type:"get",
      url:"/product/queryProductDetailList",
      dataType:"json",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success:function (info) {
        console.log(info);

        var htmlStr=template("productTpl",info);
        $('tbody').html(htmlStr)


      //  分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          totalPages: Math.ceil( info.total / info.size ),
          currentPage: info.page,



          //控制键大小
          size: "mini",



          itemTexts: function(type, page, current) {
            // console.log( arguments );
            switch ( type ) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },

          // 配置每个按钮的 title
          // 每个按钮都会调用这个方法, 将方法的返回值, 作为 title 的内容
          tooltipTitles: function(type, page, current) {
            switch ( type ) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "前往" + page + "页";
            }
          },

          // 使用 bootstrap 的提示框
          useBootstrapTooltip: true,

          onPageClicked: function( a, b, c, page ) {
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        })


      }
    })

  }


  $('#addBtn').click(function () {
    $('#addModal').modal('show');

    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page: 1,
        pageSize: 100
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr=template("dropdownTpl",info);
        $('.dropdown-menu').html(htmlStr)
      }
    })
  });

$('.dropdown-menu').on("click","a",function () {
//  获取里面的文版本
  var txt=$(this).text();

  $('#dropdownTxt').text(txt);

//  将id设置进去
  var id=$(this).data("id");
  $('[name="brandId"]').val(id);

  $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");

})


  $('#fileupload').fileupload({
    // 配置返回的数据类型
    dataType: "json",
    // 配置图片上传成功后台的回调函数
    done: function( e, data ) {
      console.log(data.result);
      var picUrl = data.result.picAddr;
      // 每次上传成功, 将图片地址和图片名称的对象, 推到 picArr 数组的最前面, 和图片结构同步
      picArr.unshift(data.result);

      // 根据图片地址进行图片预览
      $('#imgBox').prepend('<img src="' + picUrl + '" width="100" height="100">');

      // 如果长度大于 3, 就应该删除
      if ( picArr.length > 3 ) {
        // 图片数组要删除最后一个, (最早添加的那个)
        picArr.pop();
        // 图片结构也要删除最后一个图片
        // img:last-of-type 找到最后一个 img 类型的标签, 让他自杀
        $('#imgBox img:last-of-type').remove();
      }


      // 如果 picArr 数组长度等于 3, 就说明当前用户已经上传满了 3 张图片
      // 需要手动重置图片校验状态为 成功 VALID 状态
      if ( picArr.length === 3 ) {
        $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
      }

      console.log(picArr);
    }
  });



  //通过表单插件校验
  $('form').bootstrapValidator({
    excluded: [],

    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      // 要求: 商品库存要求是 必须是非零开头的数字
      // 1 11 121
      /*
       * [1-9]  可以出现 1-9 中的任意一个
       * [^0]   除了0都可以出现, 包括字母
       *
       * \d     数字 [0-9]
       *  + 可以出现 一次 或 多次
       *  * 可以出现 0次 或 的多次
       *  ? 可以出现 0次 或 1次
       *  {n} 可以先 n 次
       * */
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存必须是非零开头的数字'
          }
        }
      },
      // 尺码校验需求: 必须是 xx-xx 的格式, xx 表示数字
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品尺码必须是 xx-xx 的格式, 例如 32-40'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传 3 张图片"
          }
        }
      }
    }
  })


  //组织默认提交 用ajax提价
  $('#form').on("success.form.bv",function (e) {
      e.preventDefault();
    var paramsStr = $('#form').serialize();
    paramsStr += "&picAddr1=" + picArr[0].picAddr + "&picName1=" + picArr[0].picName;
    paramsStr += "&picAddr2=" + picArr[1].picAddr + "&picName2=" + picArr[1].picName;
    paramsStr += "&picAddr3=" + picArr[2].picAddr + "&picName3=" + picArr[2].picN

    $.ajax({
      type:"post",
      url: "/product/addProduct",
      data:paramsStr,
      dataType:"json",
      success:function (info) {
          if(info.success){
            $('#addModal').modal("hide");
            //重置表单内容
            $("#form").data("bootstrapValidator").resetForm(true);
            currentPage=1;
            render();
          //  手动重置文本
            $("#dropdownText").text("亲选择二级分类");
          //  手动重置图片
            $("#imgBox img").remove();
          }
      }
    })
  })

  render();

})