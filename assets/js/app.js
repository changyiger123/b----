/**
 * @Author Brant Liu
 * @Desc TODO
 * @MailTo lbf1988@qq.com
 * @Date 2017/09/08
 */
var layer,element,codeCount = 60,interval;
layui.use(['layer','element'], function(){
    layer = layui.layer
    ,element = layui.element;
});
function ajaxData(url,dataParams,callback,methodType){
    var type = methodType || "POST";
    $.ajax({
        url: window.BASE_URL+"/"+url,
        type:type,
        dataType:"json",
        data: dataParams,
        success: function(data){
            callback(data,layer);
        }
    });
}
function codeCountDown(){
    var self = $(".getyzm");
    if(1 == codeCount){
        codeCount = 60;
        self.val("获取验证码").removeAttr("disabled").css("background","#ffa800");
        clearInterval(interval);
    }else{
        --codeCount;
        self.attr("disabled","disabled").val(codeCount).css("background","#e6e6e6");
    }
}
$(".getyzm").on("click",function (e) {
    e.preventDefault();
    var username = $("input[name='mobile']").val();
    if($.trim(username).length==0){
        layer.msg("请输入登录用户名或手机号码", {icon: 5});
        return;
    }
    layer.open({
        type: 1
        ,title: false
        ,closeBtn: false
        ,area: '330px;'
        ,shade: 0.5
        ,id: 'LAY_layuipro'
        ,btn: ['取消', '确认']
        ,moveType: 1
        ,content:'<div class="yzm" style="width:310px;background: #ffffff;padding-top:20px;padding-left:20px;"><p style="height:30px;font-size:17px;line-height: 30px;margin-bottom: 5px;"><span>验证码</span><input type="text" name="captcha" style="width:196px;height:30px; margin-left:10px;"/></p><h6><b style="color:#666666;font-size: 12px;margin-left: 60px;line-height: 18px;">输入下图中的字符</b></h6><p class="yzpic" style="height:40px;padding-left: 60px;"><img id="psrc" src="'+window.BASE_URL+'/captcha.jpg" style="width:130px;height:40px;"/><span id="captcha"><a href="javascript:;">看不清，换一张</a></span></p></div>'
        ,success: function(layero){
            $('#captcha').click(function () {
                $('#psrc').attr('src', window.BASE_URL+'/captcha.jpg?' + new Date().getTime());
            });
            var btn = layero.find('.layui-layer-btn');
            btn.css('text-align', 'center');
            btn.find('.layui-layer-btn0').css({'background-color':'#ffffff','border-color':'#d6d7dc','color':'#333'})
            btn.find('.layui-layer-btn1').click(function(){
                var captcha = $("input[name='captcha']").val();
                if(captcha==''){
                    layer.msg("请输入验证码", {icon: 5});
                }else{
                    ajaxData('code/send.html',"username="+username+"&type=reset&captcha="+captcha,function(result){
                        if(result.code==0){
                            interval = setInterval(codeCountDown,1000);
                        }else{
                            layer.msg(result.message, {icon: 5});
                        }
                    });
                }
            })
        }
    });
});
function uploadPlugin(upload,options){
    var defaults={
        elem:"#test1",
        url: window.BASE_URL+'/uploader.html',
        data:{
            type:'business'
        },
        previewElem:"#demo1",
        inputHiddenElem:"input[name='businessUrl']",
        uploadDone:function () {}
    };
    var settings = $.extend(defaults,options);
    var uploadInst = upload.render({
        elem: settings.elem
        ,url: settings.url
        ,data:settings.data
        ,method:'post'
        ,accept:'images'
        ,auto:true
        ,size:5120
        ,multiple:false
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $(settings.previewElem).attr('src', result);
            });
        }
        ,done: function(res,index,upload){
            console.log(res);
            if(res.code == 0){
                $(settings.inputHiddenElem).val(res.content.url);
                $(settings.previewElem).src=res.content.url;
                settings.uploadDone(res.content.url);
                layer.msg('上传成功');
            }else{
                layer.msg('上传失败，文件大小限制5MB以内',{icon:-5});
            }
        }
        ,error: function(){
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-mini demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst.upload();
            });
        }
    });
}
/**
 * 登录
 * */
function loginPost(data){
    ajaxData("login.html",data,loginPostCallBack);
}
function loginPostCallBack(result){
    if(result.code==0){
        window.location.href = window.BASE_URL+"/";
    }else{
        layer.msg(result.message, {icon: 5});
    }
}
$("#loginBtn").on("click",function (e) {
    e.preventDefault();
    var username = $("input[name='username']").val();
    var password = $("input[name='password']").val();
    var rememberMe = $("input[name='rememberMe']").is(':checked');
    if($.trim(username).length==0){
        layer.msg("请输入登录用户名或手机号码", {icon: 5});
        return;
    }
    if($.trim(password).length==0){
        layer.msg("请输入密码", {icon: 5});
        return;
    }
    ajaxData("login/captcha.html","username="+username,function (result) {
        if(result.content){
            layer.open({
                type: 1
                ,title: false
                ,closeBtn: false
                ,area: '330px;'
                ,shade: 0.5
                ,id: 'LAY_layuipro'
                ,btn: ['取消', '确认']
                ,moveType: 1
                ,content:'<div class="yzm" style="width:310px;background: #ffffff;padding-top:20px;padding-left:20px;"><p style="height:30px;font-size:17px;line-height: 30px;margin-bottom: 5px;"><span>验证码</span><input type="text" name="captcha" style="width:196px;height:30px; margin-left:10px;"/></p><h6><b style="color:#666666;font-size: 12px;margin-left: 60px;line-height: 18px;">输入下图中的字符</b></h6><p class="yzpic" style="height:40px;padding-left: 60px;"><img id="psrc" src="'+window.BASE_URL+'/captcha.jpg" style="width:130px;height:40px;"/><span id="captcha"><a href="javascript:;">看不清，换一张</a></span></p></div>'
                ,success: function(layero){
                    $('#captcha').click(function () {
                        $('#psrc').attr('src', window.BASE_URL+'/captcha.jpg?' + new Date().getTime());
                    });
                    var btn = layero.find('.layui-layer-btn');
                    btn.css('text-align', 'center');
                    btn.find('.layui-layer-btn0').css({'background-color':'#ffffff','border-color':'#d6d7dc','color':'#333'})
                    btn.find('.layui-layer-btn1').click(function(){
                        var captcha = $("input[name='captcha']").val();
                        if(captcha==''){
                            layer.msg("请输入验证码", {icon: 5});
                        }else{
                            loginPost("username="+username+"&password="+md5(password)+"&rememberMe="+rememberMe+"&captcha="+captcha);
                        }
                    })
                }
            });
        }else{
            loginPost("username="+username+"&password="+md5(password)+"&rememberMe="+rememberMe);
        }
    });
});
/**
 * 忘记密码
 * */
$("#forgetBtn").on("click",function (e) {
    e.preventDefault();
    var username = $("input[name='mobile']").val();
    var yzm = $("input[name='yzm']").val();
    var psd = $("input[name='psd']").val();
    if($.trim(username).length==0){
        layer.msg("请输入登录用户名或手机号码", {icon: 5});
        return;
    }
    if($.trim(yzm).length==0){
        layer.msg("请输入验证码", {icon: 5});
        return;
    }
    if($.trim(psd).length==0){
        layer.msg("请输入密码", {icon: 5});
        return;
    }
    ajaxData('forget.html',"username="+username+"&password="+md5(psd)+"&code="+yzm,function (result) {
        if(result.code==0){
            $('.registerinput').html('<h1 style="line-height: 155px">修改密码成功，2秒后跳转到登录页面......</h1>');
            window.setTimeout(function(){
                window.location.href = window.BASE_URL + "/";
            },2000);
        }else{
            layer.msg(result.message, {icon: 5});
        }
    });
});
/**
 * 注册
 * */
$("#registerReadme").on("click",function(e){
    e.preventDefault();
    var href = $(this).attr("href");
    layer.open({
        type: 2,
        area: ['1103px','700px'],
        maxmin: true,
        content: href,
        zIndex: layer.zIndex
    });
});
$("#registerBtn").on("click",function(e){
    var username = $("input[name='username']").val();
    var mobile = $("input[name='mobile']").val();
    var yzm = $("input[name='yzm']").val();
    var psd = $("input[name='psd']").val();
    if($.trim(username).length==0){
        layer.msg("请输入登录用户名", {icon: 5});
        return;
    }
    if($.trim(mobile).length==0){
        layer.msg("请输入手机号码", {icon: 5});
        return;
    }
    if($.trim(yzm).length==0){
        layer.msg("请输入验证码", {icon: 5});
        return;
    }
    if($.trim(psd).length==0){
        layer.msg("请输入密码", {icon: 5});
        return;
    }
    if(!$("input[type='checkbox']").is(':checked')){
        layer.msg("请勾选阅读并同意该协议", {icon: 5});
    }else{
        ajaxData('register.html',"username="+username+"&password="+md5(psd)+"&code="+yzm+"&mobile="+mobile,function(data){
            if(data.code==0){
                $('.registerinput').html('<h1 style="line-height: 155px">注册成功，2秒后跳转到登录页面......</h1>');
                window.setTimeout(function(){
                    window.location.href = window.BASE_URL + "/";
                },2000);
            }else{
                layer.msg(data.message, {icon: 5});
            }
        })
    }
});

/**
 * 扫描二维码下载
 * */
$('#ewm').mouseenter(function(){
    $('#dewm').show();
}).mouseleave(function(){
    $('#dewm').hide();
})
/**
 * 联系电话
 * */
$(document).on("click","#lxdh",function(){
    layer.open({
        title: '联系电话'
        ,area: ['350px','200px']
        ,offset: '300px'
        ,content:'<h5><b>免费热线:4000-518-571</b></h5>服务时间:周一至周六9:00-18:00'
    });
});
$('.mainlogo').on('click',function(){
    window.location.href = '/'+'index.html';
})
function companyAuthInfo(){
    ajaxData("company/auth/info.html",null,function(result){
        if(result.code==30000){
            $('.wrz').attr('src',window.BASE_URL+'/assets/img/yrz.png');
            $('.identifybody').css('background','url(/assets/img/sy_bg.png)');
        }else if(result.code==30003){
            $('.rz').html('<dl style="margin-top:20px"><dt style="margin-bottom:20px"><img src="'+window.BASE_URL+'/assets/img/zy_dd.png" alt=""/></dt><dd>您的企业认证正在审核中，请耐心等待......</dd></dl>');
        }else if(result.code==30004){
            $('.rz').html('<h4>您的企业认证审核未通过请重新认证</h4><p>'+result.message+'</p><a href="'+window.BASE_URL+'/company/auth.html">修改认证</a>');
        }else{
            $('.rz').html('<h4>请进行企业认证</h4><p>为了保证您的数据安全，项目管理功能需在企业认证后使用</p><a href="'+window.BASE_URL+'/company/auth.html">立即认证</a>');
        }
    },"GET");
}
function companyAuthForm(){
    ajaxData("company/auth/info.html",null,function(result){
        if(result.code==30003){
            $('.upbody').html('<dl style="margin-top:20px"><dt style="margin-bottom:20px"><img src="'+window.BASE_URL+'/assets/img/zy_dd.png" alt=""/></dt><dd>您的企业认证正在审核中，请耐心等待......</dd></dl>')
                .css("text-align","center");
            $(".tj").remove();
        }else if(result.code==30004 || result.code==30002) {
            $("input[name='id']").val(result.content.id);
            $("input[name='cname']").val(result.content.cname);
            $("input[name='address']").val(result.content.address);
            $("input[name='businessCode']").val(result.content.businessCode);
            if ($.trim(result.content.businessUrl).length > 0) {
                $("input[name='businessUrl']").val(result.content.businessUrl.replace("http://res.ejegweb.com",""));
                $("#demo1").attr("src",result.content.businessUrl);
            }
            $("input[name='certificatesCode']").val(result.content.certificatesCode);
            if ($.trim(result.content.certificatesUrl).length > 0) {
                $("input[name='certificatesUrl']").val(result.content.certificatesUrl.replace("http://res.ejegweb.com",""));
                $("#demo2").attr("src",result.content.certificatesUrl);
            }
        }else if(result.code==30000){
            $('.upbody').html('<div style="text-align: center">您已经是认证用户，请勿重复提交</div>');
        }
    },"GET");
}
$('#authBtn').on('click',function(){
    var id = $("input[name='id']").val();
    var cname = $("input[name='cname']").val();
    var address = $("input[name='address']").val();
    var businessCode = $("input[name='businessCode']").val();
    var businessUrl = $("input[name='businessUrl']").val();
    var certificatesCode = $("input[name='certificatesCode']").val();
    var certificatesUrl = $("input[name='certificatesUrl']").val();
    var formData = new Array();
    if($.trim(id).length>0){
        formData.push("id="+id);
    }
    formData.push("cname="+cname);
    formData.push("address="+address);
    formData.push("businessCode="+businessCode);
    formData.push("businessUrl="+businessUrl);
    if($.trim(certificatesCode).length>0){
        formData.push("certificatesCode="+certificatesCode);
    }
    if($.trim(certificatesUrl).length>0){
        formData.push("certificatesUrl="+certificatesUrl);
    }
    formData.push("status=3");
    ajaxData("company/auth.html",formData.join('&'),function(data){
        if(data.code==0){
            $('.upbody').html('<dl style="margin-top:20px"><dt style="margin-bottom:20px"><img src="'+window.BASE_URL+'/assets/img/zy_dd.png" alt=""/></dt><dd>提交审核中，请耐心等待......</dd></dl>')
                .css("text-align","center");
            $(".tj").remove();
        }else if(data.code==-2){
            layer.alert(data.message);
        }
    });
});
addTeam("");
function addTeam(ele){
    $(ele+' .cjbefore').click(function(e){
        e.preventDefault();
        layer.prompt({
            formType: 0,
            title: '创建分组',
            area: '150px'
        }, function(value, index, elem){
            ajaxData("project/team/add.html","tname="+value,function(result){
                if(result.code==0){
                    if($(ele).length){
                        $(ele+' .cjbefore').before('<dd><a href="javascript:;" class="fzname" data-id="'+result.content+'">'+value+'</a></dd>');
                    }
                    $('.cjbefore').before('<a href="/project/list/'+result.content+'.html" class="fzname" data-id="'+result.content+'">'+value+'</a>');
                }else{
                    location.reload();
                }
            });
            layer.close(index);
        });
    });
}
