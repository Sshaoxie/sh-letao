/**
 * Created by 旺财大狗头 on 2018/6/25.
 */
$(function () {
  $('#form').bootstrapValidator({
    //设置小图标
    feedbackIcons:{
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //指定校验字段
    fields: {
      username: {
        // 配置校验规则
        validators: {
          // 配置非空校验
          notEmpty: {
            message: "用户名不能为空"
          },
          // 配置长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须在 2-6位"
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        // 配置校验规则
        validators: {
          // 配置非空校验
          notEmpty: {
            message: "密码不能为空"
          },
          // 配置长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须在 6-12位"
          },
          // 定制一个专门用于响应回调的校验规则
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  });

  //组织默认表单的提交
  $('#form').on("success.form.bv", function( e ) {
    // 阻止默认的表单提交
    e.preventDefault();

    console.log( "阻止了默认的提交, 通过 ajax提交");

    // 通过 ajax 进行提交
  $.ajax({
    type: "post",
    url: "/employee/employeeLogin",
    // 表单序列化, 快速收集表单提交内容, 进行提交, input 必须设置 name 属性
    data: $('#form').serialize(),
    dataType: "json",
    success: function( info ) {
      console.log( info );
      if ( info.success ) {
        // 登陆成功, 跳转到首页
        location.href = "index.html";
      }

      if ( info.error === 1000 ) {
        //alert( "用户名不存在" );
        // 将 username 的校验状态, 置成 校验失败状态, 并提示 用户名不存在
        $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback")
      }

      if ( info.error === 1001 ) {

        //  校验状态, VALID 校验成功  INVALID 校验失败  NOT_VALIDATED 未校验
        //  配置提示信息, 需要传校验规则
        $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
      }
    }
    });
  });
});





