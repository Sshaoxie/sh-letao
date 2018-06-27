/**
 * Created by 旺财大狗头 on 2018/6/26.
 */
$(function () {
  var currentPag=1;
  var pageSize=2;


  render();
  function render(){
    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:currentPag,
        pageSize:pageSize
      },
      dataType:"json",
      success:function (info) {
        console.log(info);
        // 将数据和模板相结合 template
        var htmlStr = template( "tpl", info );
        $('tbody').html( htmlStr );
        //分页初始化
        $('#paginator').bootstrapPaginator({
        //  初始版本
          bootstrapMajorVersion:3,
        //  指定总页数
          totalPages:Math.ceil(info.total/info.size),
        //  指定当前页面
          currentPage:info.page,
        //  给按钮添加点击事件
          onPageClicked:function(a,b,c,page){
            currentPag=page;
            render()
          }

        })
      }
    })
  }

// 添加点击事件
  $('#addBtn').click(function () {
      $('#addModal').modal('show');
  });

  $('#form').bootstrapValidator({
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置字段
    fields: {
      categoryName: {
        // 配置校验规则
        validators: {
          // 非空校验
          notEmpty: {
            message: "一级分类名称不能为空"
          }
        }
      }
    }
  });

//  阻止默认成功提交事件,通过ajax提交
  $('#form').on("success.form.bv",function (e) {
      e.preventDefault();

  //  通过ajax提交
    $.ajax({
      type:"post",
      url:"/category/addTopCategory",
      data:$('#form').serialize(),
      datatype:"json",
      success:function (info) {
        console.log(info);
        if(info.success){
        //  添加成功关闭莫泰狂
          $('#addModal').modal('hide');
        //  重新渲染页面,渲染第一页
          currentPag=1;
          render();

        //  重置模态框的表单,传true不仅重置表单校验状态还重置内容
          $('#form').data("bootstrapValidator").resetForm(true);
        }
      }
    })
  });
})